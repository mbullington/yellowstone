import net from 'net';

import { createHash } from 'crypto';
import { parse } from 'url';
import { EventEmitter } from 'events';
import { spawn } from 'child_process';

import ffmpeg from 'ffmpeg-static';

const WWW_AUTH_REGEX = new RegExp('([a-z]+)=\'([^,\s]+)\'');

function getMD5Hash(string) {
  let md5 = createHash('md5');

  md5.update(string);
  return md5.digest('hex');
}

function assign(dest) {
  var count = 1;
  var length = arguments.length;

  for(; count < length; count++) {
    var arg = arguments[count];

    for(var prop in arg) {
      if(arg.hasOwnProperty(prop)) {
        dest[prop] = arg[prop];
      }
    }
  }
  return dest;
}

function getVideoStream(url, port) {
  return spawn(ffmpeg.path, [
    '-i',
    `udp://${url}:${port}`,
    '--c:v',
    'mpeg4',
    'pipe:1'
  ]).stdout;
}

function parseTransport(transport) {
  var returned = {};
  transport.split(';').forEach((part) => {
    var split = part.split('=');
    returned[split[0].trim()] = split.slice(1).join('=').trim();
  });

  return returned;
}

export class RtspClient extends EventEmitter {
  constructor(username, password, headers) {
    super();

    this.username = username;
    this.password = password;
    this.headers = headers || {};

    this._isConnected = false;
    this._CSeq = 0;

    this.on('response', (responseName, headers, mediaHeaders) => {
      var name = responseName.split(' ')[0];
      if(name.indexOf('RTSP/') === 0)
        return;

      // TODO: Send back errors... for some reason?
      this.respond('200 OK', {
        CSeq: headers.CSeq
      });

      if(name === 'REDIRECT') {
        this.close();
        this.connect(headers.Location);
      }
    });
  }

  connect(url) {
    this._url = url;
    let parsedUrl = parse(url);
    parsedUrl.port = parsedUrl.port || 554;
    let mediaUrl;

    return new Promise((resolve, reject) => {
      let errorListener = (err) => {
        client.removeListener('error', errorListener);
        reject(err);
      };

      let client = net.connect(parsedUrl.port, parsedUrl.hostname, () => {
        this._isConnected = true;
        this._client = client;

        client.removeListener('error', errorListener);

        client.setEncoding('utf8');
        client.on('data', (data) => {
          let lines = data.split('\n');
          let headers = {};
          let mediaHeaders = [];

          lines.forEach((line, index) => {
            if(index == 0)
              return;

            if(line[1] === '=') {
              mediaHeaders.push(line);
            } else {
              let split = line.split(':');
              headers[split[0].trim()] = split.slice(1).join(':').trim();
            }
          });

          this.emit('response', lines[0], headers, mediaHeaders);
        });

        resolve(this);
      });

      client.on('error', errorListener);
    }).then(() => {
      return this.request('DESCRIBE', {
        Accept: 'application/sdp'
      });
    }).then((obj) => {
      obj.mediaHeaders.forEach((header) => {
        if(header.indexOf('a=control:') === 0) {
          mediaUrl = header.substring(10);
          if(mediaUrl[0] === '/')
            mediaUrl = this.url + '/' + mediaUrl;
        }
      });

      return this.request('SETUP', assign({
        Transport: 'RTP/AVP;unicast;client_port=8001-8002;'
      }));
    }).then((headers) => {
      if(headers.Unsupported)
        this._unsupportedExtensions = headers.Unsupported.split(',');
      var transport = parseTransport(headers.Transport);
      this._session = headers.Session;

      return getVideoStream(mediaUrl, transport['client-port'].split('-')[0]);
    }).then(() => {
      return this;
    });
  }

  request(requestName, headers, url) {
    headers = headers || {};

    let id = ++this._cSeq;
    let string = `${requestName} ${url || this._url} RTSP/1.0\r\nCSeq: ${id}\r\n`;

    assign(headers, this.headers);
    Object.keys(headers).forEach((header, index) => {
      string += `${header}: ${headers[Object.keys(headers)[index]].toString()}\r\n`;
    });

    this._client.write(string);

    return new Promise((resolve, reject) => {
      let responseHandler = (responseName, headers, mediaHeaders) => {
        if(parseInt(headers.CSeq) !== id)
          return;

        this.removeListener('response', responseHandler);

        var status = parseInt(responseName.split(' ')[1]);
        if(status !== 0) {
          if(status === 401) {
            var type = headers['WWW-Authenticate'].split(' ')[0];
            var authHeaders = {};

            var match = WWW_AUTH_REGEX.exec(headers['WWW-Authenticate']);
            while(match) {
              authHeaders[match[0]] = match[1];

              match = WWW_AUTH_REGEX.exec(headers['WWW-Authenticate']);
            }

            let authString = '';
            if(type === 'Digest') {
              var ha1 = getMD5Hash(`${this.username}:${authHeaders.realm}:${this.password}`);
              var ha2 = getMD5Hash(`${requestName}:${this._url}`);
              var ha3 = getMD5Hash(`${ha1}:${authHeaders.nonce}:${ha2}`);

              var authString = `Digest username="${this.username}",realm="${authHeaders.realm}",nonce="${authHeaders.nonce}",uri="${this._url}",response="${ha3}"`;
            } else if(type === 'Basic') {
              var authString = 'Basic ' + new Buffer(`${this.username}:${this.password}`).toString('base64');
            }

            resolve(this.request(requestName, assign(headers, {
              Authorization: authString
            }), url));
            return;
          }
          reject(new Error(`Bad RTSP status code: ${status}`));
          return;
        } else {
          if(mediaHeaders.length > 0) {
            resolve({
              headers,
              mediaHeaders
            });
          } else {
            resolve(headers);
          }
        }
      };

      this.on('response', responseHandler);
    });
  }

  respond(status, headers) {
    headers = headers || {};

    let string = `RTSP/1.0 ${status}\r\n`;

    assign(headers, this.headers);
    Object.keys(headers).forEach((header, index) => {
      string += `${header}: ${headers[Object.keys(headers)[index]].toString()}\r\n`;
    });

    this._client.write(string);
  }

  play() {
    return this.request('PLAY', {
      Session: this._session
    }).then(() => {
      return this;
    });
  }

  pause() {
    return this.request('PAUSE', {
      Session: this._session
    }).then(() => {
      return this;
    });
  }

  close() {
    return this.request('TEARDOWN', {
      Session: this._session
    }).then(() => {
      this._client.end();

      delete this._client;
      delete this._session;
      delete this._url;

      this.removeAllListeners('response');

      this._isConnected = false;
      this._cSeq = 0;

      return this;
    });
  }
}
