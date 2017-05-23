# `gulp-some`

A MIT-licensed [Gulp](http://gulpjs.com/) plugin for passing through all source files only if at least one returns true.

## Install

```
npm install gulp-some --save-dev
```

## Example

### Using `some` with many sources

```js
var gulp = require('gulp');
var newer = require('gulp-newer');
var some = require('gulp-some');
var ts = require('gulp-typescript');

// Compile all TypeScript files
gulp.task('ts', function() {
  // Add the some pipe to pass through all sources only if at least one source file is newer.
  // Otherwise, pass an empty stream to ts() to skip compiling pure definition files.
  return gulp.src('src/*.ts', 'types/*.d.ts')
      .pipe(newer('dist'))
      .pipe(some((i) => !i.relative.endsWith(".d.ts")))
      .pipe(ts())
      .pipe(gulp.dest('dist'));
});
```


## API

### `some(check)`
* **check** - `function` check if a File object needs to be piped, just as the `options.check` below.

### `some(options)`

 * **options.check** - `function` check if a File object needs to be piped (e.g. `function(file) { return !file.relative.endsWith(".d.ts"); }`)

Create a [transform stream](http://nodejs.org/api/stream.html#stream_class_stream_transform_1) that passes through all files in which at least one needs to be piped.


## Thanks
This project is inspired by [gulp-newer](https://github.com/tschaub/gulp-newer) .
Some source code is also from https://github.com/tschaub/gulp-newer/blob/master/index.js .
