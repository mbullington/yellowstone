import net from 'net';
import { parse } from 'url';

import { EventEmitter } from 'events';

export class RtspClient extends EventEmitter {
  constructor() {
    this._isConnected = false;
    this._CSeq = 0;
  }

  connect(url: string): Promise {
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
        if(header.indexOf("a=control:") === 0)
          mediaUrl = header.substring(10);
      });

      return this.request('SETUP', {
        Transport: 'RTP/AVP;unicast;client_port=8001-8002;'
      }, `${this._url}/${mediaUrl}`);
    }).then((headers) => {
      this._session = headers.Session;
      return this.request('PLAY', {
        Session: this._session
      });
    }).then(() => {
      return this;
    });
  }

  request(requestName : string, headers, url): Promise {
    headers = headers || {};

    let id = ++this._cSeq;
    let string = `${requestName} ${url || this._url} RTSP/1.0\r\nCSeq: ${id}\r\n`;
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

  close(): Future {
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
