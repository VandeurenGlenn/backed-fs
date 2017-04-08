'use strict';
import path from 'path';
import {platform} from 'os';

const onPlatform = platform();
let posix;

if (onPlatform === 'win32') {
  posix = 'win32';
} else {
  posix = 'posix';
}

const parse = src => {
  return path[posix].parse(src)
}

const basename = src => {
  return path[posix].basename(src);
}

const dirname = src => {
  return path[posix].dirname(src);
}

export default {
  parse: parse,
  basename: basename,
  dirname: dirname
}
