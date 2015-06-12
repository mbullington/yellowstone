import net from 'net';

import { getMD5Hash, assign, parseTransport } from './util.js';
import { RTPPacket } from './rtp.js';

import { parse } from 'url';
import { EventEmitter } from 'events';

import transform from 'sdp-transform';

const WWW_AUTH_REGEX = new RegExp('([a-z]+)=\'([^,\s]+)\'');

export class RtspClient extends EventEmitter {
  constructor(username, password, headers) {
    super();

    this.username = username;
    this.password = password;
    this.headers = headers || {};

    this._isConnected = false;
    this._cSeq = 0;

    this.on('response', (responseName, headers, mediaHeaders) => {
      var name = responseName.split(' ')[0];
      if(name.indexOf('RTSP/') === 0)
        return;

      // TODO: Send back errors... for some reason?
      if(name === 'REDIRECT' || name === 'ANNOUNCE')
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

        let packetLength = -1;
        let packets = [];

        client.removeListener('error', errorListener);

        client.on('data', (data) => {
          if(data[0] === 0x24 && data[1] === 0) {
            // rtp
            packetLength = data.readUInt16BE(2);

            let packetPiece = data.slice(4);
            if(packetLength - packetPiece.length <= 0) {
              packetLength = -1;
              this.emit('packet', new RTPPacket(packetPiece));
            } else {
              packetLength -= packetPiece.length;
              packets.push(packetPiece);
            }

            return;
          }

          if(packetLength >= 0) {
            // partial rtp
            packets.push(data);
            if(packetLength - data.length <= 0) {
              packetLength = -1;
              this.emit('packet', new RTPPacket(Buffer.concat(packets)));
            } else {
              packetLength -= data.length;
              packets.push(data);
            }
            return;
          }

          data = data.toString('utf8');

          if(data.split(" ")[0].indexOf("RTSP") < 0)
            return;
          this.emit('rawData', data);

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
              let data = split.slice(1).join(':').trim();

              headers[split[0].trim()] = !isNaN(parseInt(data)) ? parseInt(data) : data;
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
      var sdp = transform.parse(obj.mediaHeaders.join('\r\n'));

      let mediaSource;
      sdp.media.forEach((media) => {
        if(media.type === 'video' && media.protocol === 'RTP/AVP')
          mediaSource = media;
      });

      if(!mediaSource)
        throw new Error('Only video sources using the RTP/AVP protocol are supported at this time');

      if(mediaSource.control)
        mediaUrl = this._url + '/' + mediaSource.control;

      this._url = mediaUrl;
      return this.request('SETUP', assign({
        Transport: 'RTP/AVP/TCP;interleaved=0-1'
      }));
    }).then((headers) => {
      if(headers.Unsupported)
        this._unsupportedExtensions = headers.Unsupported.split(',');
      var transport = parseTransport(headers.Transport);
      this._session = headers.Session;

      // return getVideoStream(mediaUrl, transport['client_port'].split('-')[0]);
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

    this.emit('rawRequest', string);
    this._client.write(string + '\r\n');

    return new Promise((resolve, reject) => {
      let responseHandler = (responseName, headers, mediaHeaders) => {
        if(headers.CSeq !== id && headers.Cseq !== id)
          return;

        this.removeListener('response', responseHandler);

        var status = parseInt(responseName.split(' ')[1]);
        if(status !== 200) {
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

              var authString = `Digest username="${this.username}",realm="${authHeadefrs.realm}",nonce="${authHeaders.nonce}",uri="${this._url}",response="${ha3}"`;
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
    string += Object.keys(headers).map((header, index) => {
      return `${header}: ${headers[Object.keys(headers)[index]].toString()}`;
    }).join('\r\n');
    Object.keys(headers).forEach((header, index) => {
      string += `${header}: ${headers[Object.keys(headers)[index]].toString()}\r\n`;
    });

    this._client.write(string + '\r\n');
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
