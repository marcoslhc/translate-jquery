gulp    = require 'gulp'
uglify  = require 'gulp-uglify'
coffee  = require 'gulp-coffee'
del     = require 'del'
gutil   = require 'gulp-util'
concat  = require 'gulp-concat'
order   = require 'gulp-order'
rename  = require 'gulp-rename'

gulp.task 'build', (cb)->
    gulp.src('translate.jquery.coffee')
        .on('error', gutil.log)
        .pipe(coffee({bare: true}))
        .pipe(gulp.dest './dist/')
        .pipe(uglify())
        .pipe(rename 'translate.jquery.min.js')
        .pipe(gulp.dest './dist/')

gulp.task 'test', ['build'], (cb)->
    src = [
        'bower_components/jquery/dist/jquery.min.js',
        'bower_components/i18n/i18n.js',
        'translate.jquery.js',
        'test/test.js'
        ];
    gulp.src(src)
    .on('error', gutil.log.bind this, 'Error in Test')
    .pipe(order(src, {base:'./'}))
    .pipe(concat('test.js'))
    .pipe(gulp.dest('test/build'))
