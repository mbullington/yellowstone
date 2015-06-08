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
    var parsedUrl = parse(url);

    return new Promise((resolve, reject) => {
      var errorListener = (err) => {
        client.removeListener('error', errorListener);
        reject(err);
      };

      var client = net.createConnection({
        path: parsedUrl.path,
        host: parsedUrl.hostname
      }, () => {
        this._isConnected = true;
        this._client = client;

        client.removeListener('error', errorListener);

        client.setEncoding('utf8');
        client.on('data', (data) => {
          var lines = data.split('\n');
          var headers = {};

          lines.forEach((line, index) => {
            if(index == 0)
              return;

            var split = line.split(':');
            headers[split[0].trim()] = split.slice(1).join(":").trim();
          });

          this.emit('response', lines[0], headers);
        });

        resolve(this);
      });

      client.on('error', errorListener);
    });
  }

  request(requestName : string, headers): Promise {
    var id = ++this._CSeq;
    var string = `${requestName} ${this._url} RTSP/1.0\r\nCSeq: ${id}\r\n`;
    headers.forEach((header) => {
      string += header + '\r\n';
    });

    this._client.write(string);

    return new Promise((resolve, reject) => {
      var responseHandler = (responseName, headers) => {
        if(parseInt(headers.CSeq) !== id)
          return;

        // TODO: Count for errors in protocol.
        this.removeListener('response', responseHandler);
        resolve(headers);
      };

      this.on('response', responseHandler);
    });
  }
}
