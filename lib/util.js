import { createHash } from 'crypto';
import { spawn } from 'child_process';

export function getMD5Hash(string) {
  let md5 = createHash('md5');

  md5.update(string);
  return md5.digest('hex');
}

export function assign(dest) {
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

export function parseTransport(transport) {
  var returned = {};
  transport.split(';').forEach((part) => {
    var split = part.split('=');
    returned[split[0].trim()] = split.slice(1).join('=').trim();
  });

  return returned;
}
