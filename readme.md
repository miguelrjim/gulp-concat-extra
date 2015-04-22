## Install

```
$ npm install --save-dev gulp-concat-extra
```


## Usage

```js
var gulp = require('gulp');
var gitChanged = require('gulp-git-changed');

gulp.task('default', function () {
  return gulp.src('src/file.ext')
    .pipe(concatExtra({
      'src/file.ext': {
        prepend: [
          'src/lib1.js',
          'src/lib2.js'
        ],
        append: [
          'src/init.js'
        ]
      }
    }))
    .pipe(gulp.dest('dist'));
});
```

## License

MIT © [Miguel Jimenez](https://github.com/miguelrjim)
