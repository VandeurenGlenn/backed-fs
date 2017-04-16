'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var path = _interopDefault(require('path'));
var os = require('os');

var onPlatform = os.platform();
var posix = void 0;
if (onPlatform === 'win32') {
  posix = 'win32';
} else {
  posix = 'posix';
}
var parse = function parse(src) {
  return path[posix].parse(src);
};
var basename = function basename(src) {
  return path[posix].basename(src);
};
var dirname = function dirname(src) {
  return path[posix].dirname(src);
};
var relative = function relative(from, against) {
  return path[posix].relative(from, against);
};
var platformPath = {
  parse: parse,
  basename: basename,
  dirname: dirname,
  relative: relative
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var _require = require('fs');
var writeFile = _require.writeFile;
var mkdir = _require.mkdir;
var vinylRead = require('vinyl-read');
var path$1 = require('path');
var logger = require('backed-logger');
var Fs = function () {
  function Fs() {
    classCallCheck(this, Fs);
  }
  createClass(Fs, [{
    key: 'copySources',
    value: function copySources() {
      var _this = this;
      var sources = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      return new Promise(function (resolve, reject) {
        if (sources) {
          try {
            var promises = [];
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;
            try {
              for (var _iterator = sources[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var source = _step.value;
                promises.push(_this.copy(source.src, source.dest));
              }
            } catch (err) {
              _didIteratorError = true;
              _iteratorError = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }
              } finally {
                if (_didIteratorError) {
                  throw _iteratorError;
                }
              }
            }
            Promise.all(promises).then(function () {
              resolve();
            });
          } catch (error) {
            reject(error);
          }
        }
      });
    }
  }, {
    key: 'destinationFromFile',
    value: function destinationFromFile(file) {
      var dest = platformPath.relative(process.cwd(), file.path);
      dest = dest.split(path$1.sep);
      if (dest.length > 0) {
        dest[0] = file.dest;
      }
      dest = dest.toString().replace(/,/g, '/');
      return dest;
    }
  }, {
    key: 'copy',
    value: function copy() {
      var _this2 = this;
      var src = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var dest = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      return new Promise(function (resolve) {
        var promises = [];
        vinylRead(src, {
          cwd: process.cwd()
        }).then(function (files) {
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;
          try {
            for (var _iterator2 = files[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var file = _step2.value;
              file.dest = dest;
              promises.push(_this2.write(file, _this2.destinationFromFile(file)));
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
          Promise.all(promises).then(function () {
            resolve();
          });
        });
      });
    }
  }, {
    key: 'write',
    value: function write(file, destination) {
      var _this3 = this;
      return new Promise(function (resolve, reject) {
        if (file) {
          writeFile(destination, file.contents, function (err) {
            if (err) {
              if (global.debug) {
                logger.warn('subdirectory(s)::not existing\n                  Backed will now try to create ' + destination);
              }
              var dest = platformPath.dirname(destination);
              var paths = dest.split('/');
              var prepath = '';
              var _iteratorNormalCompletion3 = true;
              var _didIteratorError3 = false;
              var _iteratorError3 = undefined;
              try {
                for (var _iterator3 = paths[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                  var _path = _step3.value;
                  prepath += _path + '/';
                  if (_path.length > 2) {
                    mkdir(prepath, function (err) {
                      if (err) {
                        if (err.code !== 'EEXIST') {
                          reject(err);
                        }
                      }
                    });
                  }
                }
              } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion3 && _iterator3.return) {
                    _iterator3.return();
                  }
                } finally {
                  if (_didIteratorError3) {
                    throw _iteratorError3;
                  }
                }
              }
              _this3.write(file, destination).then(function () {
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
  }]);
  return Fs;
}();
var fs = new Fs();

module.exports = fs;
//# sourceMappingURL=fs-node.js.map
