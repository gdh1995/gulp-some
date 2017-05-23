'use strict';
/// @author: Dahan Gong <gdh1995@qq.com> (github: gdh1995)
/// @license: MIT

var Transform = require('stream').Transform;
var util = require('util');
var PLUGIN_NAME = 'gulp-some';

function Some(options) {
  Transform.call(this, {objectMode: true});

  if (!options) {
    throw new TypeError(PLUGIN_NAME,
      'Requires a check function or options object');
  }

  if (typeof options === 'function') {
    options = {check: options};
  }
  else if (typeof options.check !== 'function') {
    throw new TypeError(PLUGIN_NAME, 'Requires options.check to be a function');
  }

  /**
   * Function to check if a file needs to be piped.
   * @type {function(File): boolean}
   */
  this._check = options.check;

  /**
   * Source files need to be buffered until a newer file is found. 
   * When a newer file is found, buffered source files are flushed
   * (and the `_all` flag is set).
   * @type {[File]}
   */
  this._bufferedFiles = [];

  /**
   * Indicates that all files should be passed through.  This is set when the
   * provided dest is a file and we have already encountered a newer source
   * file.  When true, all remaining source files should be passed through.
   * @type {boolean}
   */
  this._all = false;

}
util.inherits(Some, Transform);


/**
 * Pass through newer files only.
 * @param {File} srcFile A vinyl file.
 * @param {string} encoding Encoding (ignored).
 * @param {function(Error, File)} done Callback.
 */
Some.prototype._transform = function(srcFile, encoding, done) {
  if (!srcFile || !srcFile.stat) {
    done(new TypeError(PLUGIN_NAME, 'Expected a source file with stats'));
    return;
  }
  if (!this._all) {
    if (!this._check(srcFile)) {
      this._bufferedFiles.push(srcFile);
      return done();
    }
    // flush buffer
    var self = this;
    this._bufferedFiles.forEach(function(file) {
      self.push(file);
    });
    this._bufferedFiles.length = 0;
    // pass through all remaining files as well
    this._all = true;
  }
  this.push(srcFile);
  return done();
};


/**
 * Remove references to buffered files.
 * @param {function(Error)} done Callback.
 */
Some.prototype._flush = function(done) {
  this._bufferedFiles.length = 0;
  this._all = false;
  done();
};


/**
 * Only pass through source files if there's at least one newer than the provided destination.
 * @param {{check (file: File): boolean} | { (file: File): boolean}} options An options object or path to destination.
 * @return {Some} A transform stream.
 */
module.exports = function some(options) {
  return new Some(options);
};