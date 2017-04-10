'use strict';
const {writeFile, mkdir} = require('fs');
const vinylRead = require('vinyl-read');
const path = require('path');
const logger = require('backed-logger');
import platformPath from './platform-path.js';

class Fs {
  /**
   * @param {object} sources [{src: ["some/glob/exp"], dest: "some/dest"}]
   */
  copySources(sources=[]) {
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

  /**
   * returns a destination using [vinyl](https://github.com/gulpjs/vinyl) info
   */
  destinationFromFile(file) {
    let dest = path.win32.relative(process.cwd(), file.path);
    dest = dest.split(path.sep);
    if (dest.length > 0) {
      dest[0] = file.dest;
    }
    dest = dest.toString().replace(/,/g, '/');
    return dest;
  }

  /**
   * @param {string} src "some/src/path"
   * @param {string} dest "some/dest/path"
   */
  copy(src=null, dest=null) {
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

  /**
   * @param {object} file {src: "some/src/path", dest: "some/dest/path"}
   */
  write(file, destination) {
    return new Promise((resolve, reject) => {
      if (file) {
        writeFile(destination, file.contents, err => {
          if (err) {
            if (global.debug) {
              logger.warn(
                  `subdirectory(s)::not existing
                  Backed will now try to create ${destination}`
                );
            }
            const dest = platformPath.dirname(destination);
            const paths = dest.split('/');
            let prepath = '';
            for (let path of paths) {
              prepath += `${path}/`;
              if (path.length > 2) {
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
export default new Fs();
