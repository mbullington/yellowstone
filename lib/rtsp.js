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
    this.headers = assign({
      'User-Agent': 'yellowstone/1.0'
    }, headers || {});

    this.isConnected = false;
    this._cSeq = 0;
  }

  connect(url) {
    this._url = url;
    let parsedUrl = parse(url);
    parsedUrl.port = parsedUrl.port || 554;

    let format = "";

    return new Promise((resolve, reject) => {
      let client;

      let errorListener = (err) => {
        client.removeListener('error', errorListener);
        reject(err);
      };

      let closeListener = () => {
        client.removeListener('close', closeListener);
        this.close(true);
      };

      let responseListener = (responseName, headers) => {
        let name = responseName.split(' ')[0];
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
      };

      client = net.connect(parsedUrl.port, parsedUrl.hostname, () => {
        this.isConnected = true;
        this._client = client;

        let packetLength = -1;
        let packets = [];

        client.removeListener('error', errorListener);

        this.on('response', responseListener);

        client.on('data', (data) => {
          if(data[0] === 0x24 && data[1] === 0) {
            // rtp
            packetLength = data.readUInt16BE(2);

            let packetPiece = data.slice(4);
            if(packetLength - packetPiece.length <= 0) {
              packetLength = -1;
              let packet = new RTPPacket(packetPiece);
              this.emit('data', packet.payload, packet);
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
              let packet = new RTPPacket(Buffer.concat(packets));
              this.emit('data', packet.payload, packet);
            } else {
              packetLength -= data.length;
              packets.push(data);
            }
            return;
          }

          data = data.toString('utf8');

          if(data.split(' ')[0].indexOf('RTSP') < 0)
            return;
          this.emit('log', data, 'S->C');

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

              headers[split[0].trim()] = data.match(/^[0-9]+$/) ? parseInt(data, 10) : data;
            }
          });

          this.emit('response', lines[0], headers, mediaHeaders);
        });

        resolve(this);
      });

      client.on('error', errorListener);
      client.on('close', closeListener);
    }).then(() => {
      return this.request('DESCRIBE', {
        Accept: 'application/sdp'
      });
    }).then((obj) => {
      let sdp = transform.parse(obj.mediaHeaders.join('\r\n'));

      let mediaSource;
      sdp.media.forEach((media) => {
        if(media.type === 'video' && media.protocol === 'RTP/AVP')
          mediaSource = media;
      });

      if(!mediaSource)
        throw new Error('only video sources using the RTP/AVP protocol are supported at this time');

      if(mediaSource.control)
        this._url += '/' + mediaSource.control;

      mediaSource.rtp.forEach((obj) => {
        if(format.length > 0)
          return;
        if(obj.codec) {
          format = obj.codec;
        }
      })

      return this.request('SETUP', assign({
        Transport: 'RTP/AVP/TCP;interleaved=0-1'
      }));
    }).then((headers) => {
      if(headers.Transport.split(';')[0] !== 'RTP/AVP/TCP')
        throw new Error('only RTSP servers supporting RTP/AVP over TCP are supported at this time');

      if(headers.Unsupported)
        this._unsupportedExtensions = headers.Unsupported.split(',');
      let transport = parseTransport(headers.Transport);
      this._session = headers.Session;

      return {
        format
      };
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

    this.emit('log', string, 'C->S');
    this._client.write(string + '\r\n');

    return new Promise((resolve, reject) => {
      let responseHandler = (responseName, headers, mediaHeaders) => {
        if(headers.CSeq !== id && headers.Cseq !== id)
          return;

        this.removeListener('response', responseHandler);

        let status = parseInt(responseName.split(' ')[1]);
        if(status !== 200) {
          if(status === 401) {
            let type = headers['WWW-Authenticate'].split(' ')[0];
            let authHeaders = {};

            let match = WWW_AUTH_REGEX.exec(headers['WWW-Authenticate']);
            while(match) {
              authHeaders[match[0]] = match[1];

              match = WWW_AUTH_REGEX.exec(headers['WWW-Authenticate']);
            }

            let authString = '';
            if(type === 'Digest') {
              let ha1 = getMD5Hash(`${this.username}:${authHeaders.realm}:${this.password}`);
              let ha2 = getMD5Hash(`${requestName}:${this._url}`);
              let ha3 = getMD5Hash(`${ha1}:${authHeaders.nonce}:${ha2}`);

              let authString = `Digest username="${this.username}",realm="${authHeadefrs.realm}",nonce="${authHeaders.nonce}",uri="${this._url}",response="${ha3}"`;
            } else if(type === 'Basic') {
              let authString = 'Basic ' + new Buffer(`${this.username}:${this.password}`).toString('base64');
            }

            resolve(this.request(requestName, assign(headers, {
              Authorization: authString
            }), url));
            return;
          }
          reject(new Error(`bad RTSP status code ${status}`));
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

    this.emit('log', string, 'C->S');
    this._client.write(string + '\r\n');
  }

  play() {
    if(!this.isConnected)
      throw new Error('client is not connected');

    return this.request('PLAY', {
      Session: this._session
    }).then(() => {
      return this;
    });
  }

  pause() {
    if(!this.isConnected)
      throw new Error('client is not connected');

    return this.request('PAUSE', {
      Session: this._session
    }).then(() => {
      return this;
    });
  }

  close(isImmediate) {
    isImmediate = isImmediate || false;
    let promise = new Promise((resolve, reject) => {
      this._client.end();

      delete this._client;
      delete this._session;
      delete this._url;

      this.removeAllListeners('response');

      this.isConnected = false;
      this._cSeq = 0;

      return this;
    });

    if(!isImmediate) {
      return this.request('TEARDOWN', {
        Session: this._session
      }).then(() => {
        return promise;
      });
    } else {
      return promise;
    }
  }
}
