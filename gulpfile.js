/**
 * @author monkeywang
 * Date: 17/3/27
 */
var webpackConfigDev = require('./webpack.config.js');
var webpackConfigProd = require('./webpack.prod.js');
var gulp = require('gulp');
var webpack = require("webpack");
var stylus = require('gulp-stylus');
var gutil = require('gulp-util');

// Load plugins
var $ = require('gulp-load-plugins')();

/* es6 */
gulp.task("webpack-dev", function(callback) {
  var myConfig = Object.create(webpackConfigDev);
  webpack(myConfig, function(err, stats) {
    if(err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString({
    	 // output options
    }));
    callback();
  });
});

/* es6 */
gulp.task("webpack-prod", function(callback) {
  var myConfig = Object.create(webpackConfigProd);
  webpack(myConfig, function(err, stats) {
    if(err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString({
       // output options
    }));
    callback();
  });
});
/**
 * 编译stylus
 */
gulp.task('build.css', function () {
  /**
   * 入口主题themes，如果要新建主题，在这里添加
   * @type {[*]}
   */
  var themes = ['theme1', 'theme11', 'theme12', 'theme13', 'theme14', 'theme15', 'theme16', 'theme17', 'theme18', 'theme19', 'theme20', 'theme21'];
  // var themes = ['theme1'];
  themes.forEach(function (item, i) {
    gulp.src('./webApp/'+item+'/style/**/index.styl')
      .pipe(stylus({
        compress: true
      }))
      .pipe(gulp.dest('./static/'+item+'/css'));
  })

  gulp.src('./webApp/common/style/**/*.styl')
    .pipe(stylus({
      compress: true
    }))
    .pipe(gulp.dest('./static/common/css'));

});

gulp.task('watch.css', function () {
  gulp.watch('./webApp/**/style/**/*.styl', ['build.css']);
});
//监听文件修改
gulp.task('watch.js', function () {
  gulp.watch(['./webApp/**/js/**/*.js'], ['webpack-dev']);
});

// 拷贝jade
gulp.task('copy',function(){
  /**
   * 入口主题themes，如果要新建主题，在这里添加
   * @type {[*]}
   */
  var themes = ['common', 'theme1',  'theme11',  'theme12',  'theme13',  'theme14',  'theme15',  'theme16', 'theme17', 'theme18', 'theme19', 'theme20', 'theme21'];
  // var themes = ['common', 'theme1'];
  themes.forEach(function (item, i) {
    gulp.src('./webApp/'+item+'/views/**/*.jade')
      .pipe(gulp.dest('./static/'+item+'/views'))
    //拷贝 bootstrap 
    // gulp.src('./webApp/common/js/libs/*.js')
    //   .pipe(gulp.dest('./static/common/js/libs'))
    // gulp.src('./webApp/common/style/*.css')
    //   .pipe(gulp.dest('./static/common/css'));
    // gulp.src('./webApp/common/style/font/*')
    //   .pipe(gulp.dest('./static/common/css/font'));
  });
   gulp.src('./webApp/common/**/*.jade')
      .pipe(gulp.dest('./static/common'))

});

gulp.task('dev', ['build.css', 'webpack-dev', 'copy', 'watch.css', 'watch.js']);
gulp.task('build', ['build.css', 'webpack-prod', 'copy']);
// gulp.task('watch', ['watch.css', 'watch.js']);