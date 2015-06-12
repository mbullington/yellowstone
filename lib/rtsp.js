import net from 'net';

import { parse } from 'url';
import { EventEmitter } from 'events';
import { spawn } from 'child_process';

import ffmpeg from 'ffmpeg-static';

function getVideoStream(url, port) {
  return spawn(ffmpeg.path, [
    '-i',
    `udp://${url}:${port}`,
    '--c:v',
    'mpeg4',
    'pipe:1'
  ]).stdout;
}

parseTransport(transport) {
  var returned = {};
  transport.split(';').forEach((part) => {
    var split = part.split('=');
    returned[split[0].trim()] = split.slice(1).join('=').trim();
  });

  return returned;
}

export class RtspClient extends EventEmitter {
  constructor(headers) {
    super();

    this.headers = headers || {};

    this._isConnected = false;
    this._CSeq = 0;

    this.on('response', (responseName, headers, mediaHeaders) => {
      if(responseName.split(" ")[0].toUpperCase() !== 'REDIRECT')
        return;

      this.close();
      this.connect(headers.Location);
    });
  }

  connect(url) {
    this._url = url;
    let parsedUrl = parse(url);
    let mediaUrl;

    return new Promise((resolve, reject) => {
      let errorListener = (err) => {
        client.removeListener('error', errorListener);
        reject(err);
      };

      let client = net.createConnection({
        port: parsedUrl.port || 554,
        host: parsedUrl.hostname
      }, () => {
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
              headers[split[0].trim()] = split.slice(1).join(":").trim();
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
        if(header.indexOf("a=control:") === 0) {
          mediaUrl = header.substring(10);
          if(mediaUrl[0] === '/')
            mediaUrl = this.url + '/' + mediaUrl;
        }
      });

      return this.request('SETUP', Object.assign({
        Transport: 'RTP/AVP;unicast;client_port=8001-8002;'
      });
    }).then((headers) => {
      if(headers.Unsupported)
        this._unsupportedExtensions = headers.Unsupported.split(",");
      var transport = parseTransport(headers.Transport);
      this._session = headers.Session;

      return getVideoStream(mediaUrl, transport['client-port'].split('-')[0]);
    }).then(() => {
      return this;
    });
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

  request(requestName, headers, url) {
    headers = headers || {};

    let id = ++this._cSeq;
    let string = `${requestName} ${url || this._url} RTSP/1.0\r\nCSeq: ${id}\r\n`;

    Object.assign(headers, this.headers);
    Object.keys(headers).forEach((header, index) => {
      string += `${header}: ${headers[Object.keys(headers)[index]].toString()}\r\n`;
    });

    this._client.write(string);

    return new Promise((resolve, reject) => {
      let responseHandler = (responseName, headers, mediaHeaders) => {
        if(parseInt(headers.CSeq) !== id)
          return;

        // TODO: Count for errors in protocol.
        this.removeListener('response', responseHandler);

        if(responseName.indexOf('RTSP/1.0 200 OK') < 0) {
          reject();
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
}
