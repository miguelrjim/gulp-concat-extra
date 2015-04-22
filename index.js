'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var concat = require('gulp-concat');
var vinyl_fs = require('vinyl-fs');
var path = require('path');

module.exports = function (config) {
  if (!config) {
    throw new gutil.PluginError('gulp-concat-extra', '`configuration` required');
  }

  return through.obj(function (file, enc, cb) {

    if (file.isNull()) {
      cb(null, file);
      return;
    }

    if (file.isStream()) {
      cb(new gutil.PluginError('gulp-concat-extra', 'Streaming not supported'));
      return;
    }

    // Get configuration of file
    var fileConf = config[file.path.substr(process.cwd().length+1)];

    // If file not present in configuration, skip
    if(!fileConf || (fileConf.prepend.length == 0 && fileConf.append.length == 0)) {
      this.push(file);
      cb();
      return;
    }

    // Setting up the transform function to add the current file to the stream
    var that = this;
    var stream = through.obj(function(file, enc, cb) {
      this.push(file);
      cb();
    }, function(cb) {
      this.push(file);
      cb();
    });

    // Prepending specified files to the stream
    if(fileConf.prepend && fileConf.prepend.length > 0)
      stream = vinyl_fs.src(fileConf.prepend)
        .pipe(stream);

    // Append specified files to the stream
    if(fileConf.append && fileConf.append.length > 0)
      stream = stream.pipe(through.obj(function(file, enc, cb) {
        this.push(file);
        cb();
      }, function(cb) {
        var that = this;
        vinyl_fs.src(fileConf.append)
          .pipe(through.obj(function(file, enc, cb) {
            that.push(file);
            cb();
          }, function(icb) {
            icb();
            cb();
          }));
      }));

    // Concatenating prepended, current and appended files
    stream.pipe(concat(path.basename(file.relative)))
      .pipe(through.obj(
        function(file, enc, icb) {
          that.push(file);
          icb();
          cb();
        }));
  });
};
