var gulp = require('gulp');
var gutil = require('gutil');
var replace = require('gulp-replace');
var webpack = require('webpack');
var del = require('del');

gulp.task('default', ['buildAll', 'syncContents']);

// Delete files in generator
gulp.task('deleteGeneratorContents', function(){
    return del('generator/generators/contents/templates/copy/**', {force:true});
});

// Sync files between src and generator
gulp.task('syncContents', ['deleteGeneratorContents'], function(){
    gulp.src(['src/contents/**/*.js', '!src/contents/index.js'])
      .pipe(replace('../../', 'wordpress-rest-admin/'))
      .pipe(gulp.dest('generator/generators/contents/templates/copy'));
});

gulp.task('buildAll', function(callback){

    const buildPaths = [
        'util/**/*.js',
        'WPAdmin.js',
        'actions/index.js',
        'components/**/*.js',
        'contents/**/*.js',
        'hoc/**/*.js',
        'reducers/**/*.js',
        'containers/**/*.js',
        'services/**/*.js',
    ];

    process.env.npm_config_entryPath = buildPaths.join(",");

    webpack(require('./webpack.config.js'), function(err){
        callback(err);
    });
});

