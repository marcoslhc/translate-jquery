gulp = require 'gulp'
uglify = require 'gulp-uglify'
coffee = require 'gulp-coffee'
del = require 'del'
gutil = require 'gulp-util'

gulp.task 'build', ()->
    gulp.src('translate.jquery.coffee')
        .on('error', gutil.log)
        .pipe(coffee({bare: true}))
        .pipe(gulp.dest('./'))
        .pipe(uglify())
        .pipe(gulp.dest './dist/')
