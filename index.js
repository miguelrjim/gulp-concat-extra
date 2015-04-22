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

    var fileConf = config[file.relative];

    if(!fileConf || (fileConf.prepend.length == 0 && fileConf.append.length == 0) {
      this.push(file);
      cb();
      return;
    }

    var stream = through.obj(function(file, enc, cb) {
      this.push(file);
      cb():
    });

    if(fileConf.prepend)
      stream = vinyl_fs.src(fileConf.prepend)
        .pipe(stream);

    if(fileConf.append)
      stream = stream.pipe(vinyl_fs.src(fileConf.append));

    stream.pipe(concat(path.basename(file.relative)))
      .pipe(through.obj(
        function(file, enc, icb) {
          that.push(file);
          icb();
          cb();
        }));
    });
	});
};
