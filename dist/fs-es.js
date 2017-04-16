import path from 'path';
import { platform } from 'os';

const onPlatform = platform();
let posix;
if (onPlatform === 'win32') {
  posix = 'win32';
} else {
  posix = 'posix';
}
const parse = src => {
  return path[posix].parse(src);
};
const basename = src => {
  return path[posix].basename(src);
};
const dirname = src => {
  return path[posix].dirname(src);
};
const relative = (from, against) => {
  return path[posix].relative(from, against);
};
var platformPath = {
  parse: parse,
  basename: basename,
  dirname: dirname,
  relative: relative
};

const { writeFile, mkdir } = require('fs');
const vinylRead = require('vinyl-read');
const path$1 = require('path');
const logger = require('backed-logger');
class Fs {
  copySources(sources = []) {
    return new Promise((resolve, reject) => {
      if (sources) {
        try {
          let promises = [];
          for (let source of sources) {
            promises.push(this.copy(source.src, source.dest));
          }
          Promise.all(promises).then(() => {
            resolve();
          });
        } catch (error) {
          reject(error);
        }
      }
    });
  }
  destinationFromFile(file) {
    let dest = platformPath.relative(process.cwd(), file.path);
    dest = dest.split(path$1.sep);
    if (dest.length > 0) {
      dest[0] = file.dest;
    }
    dest = dest.toString().replace(/,/g, '/');
    return dest;
  }
  copy(src = null, dest = null) {
    return new Promise(resolve => {
      let promises = [];
      vinylRead(src, {
        cwd: process.cwd()
      }).then(files => {
        for (let file of files) {
          file.dest = dest;
          promises.push(this.write(file, this.destinationFromFile(file)));
        }
        Promise.all(promises).then(() => {
          resolve();
        });
      });
    });
  }
  write(file, destination) {
    return new Promise((resolve, reject) => {
      if (file) {
        writeFile(destination, file.contents, err => {
          if (err) {
            if (global.debug) {
              logger.warn(`subdirectory(s)::not existing
                  Backed will now try to create ${destination}`);
            }
            const dest = platformPath.dirname(destination);
            const paths = dest.split('/');
            let prepath = '';
            for (let path$$1 of paths) {
              prepath += `${path$$1}/`;
              if (path$$1.length > 2) {
                mkdir(prepath, err => {
                  if (err) {
                    if (err.code !== 'EEXIST') {
                      reject(err);
                    }
                  }
                });
              }
            }
            this.write(file, destination).then(() => {
              resolve();
            });
          } else {
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }
}
var fs = new Fs();

export default fs;
//# sourceMappingURL=fs-es.js.map
