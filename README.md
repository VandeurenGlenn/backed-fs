# backed-fs [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]
> A command line interface for fast es6 development

## Installation

```sh
$ npm install backed-fs
```

## Usage
```js
soon...
```

## API

### copy(src, dest)
#### src
Type: `string`<br>
Default: `null`<br>
#### dest
Type: `string`<br>
Default: `null`<br>

copy files

### copySources([{options}])
Type: `array`<br>
Default: `[]`<br>
Options: `src, dest`

Options is an array of objects with each object containing a source & destination property

### destinationFromFile(file)
Type: `file`<br>
Default: `{}`<br>

returns a destination using [vinyl](https://github.com/gulpjs/vinyl) file info

### write(file, destination)
#### file
Type: `file`<br>
Default: `{}`<br>
#### destination
Type: `string`<br>
Default: `null`<br>

Write a file to given destination.

[npm-image]: https://badge.fury.io/js/backed-fs.svg
[npm-url]: https://npmjs.org/package/backed-fs
[travis-image]: https://travis-ci.org/VandeurenGlenn/backed-fs.svg?branch=master
[travis-url]: https://travis-ci.org/VandeurenGlenn/backed-fs
[daviddm-image]: https://david-dm.org/VandeurenGlenn/backed-fs.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/VandeurenGlenn/backed-fs
[coveralls-image]: https://coveralls.io/repos/VandeurenGlenn/backed-fs/badge.svg
[coveralls-url]: https://coveralls.io/r/VandeurenGlenn/backed-fs
