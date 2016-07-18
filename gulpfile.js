var gulp    = require('gulp');
var plugins = require('gulp-load-plugins')();
var gutil   = require('gulp-util');
var config  = require("./tools/gulptasks/config.js")();   // all of our configuration vars

var del = require('del');
var jshint = require('gulp-jshint');

var Server = require('karma').Server;

var sourcemaps = require('gulp-sourcemaps');

// plugins for sassing.
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var sassdoc = require('sassdoc');


// Use a function to get tasks defined in separate files and modules
function getFileTask(task, param) {
    if (param == undefined) {
        console.log('Loading Task: ' + task );
        return require(config.paths.gulptasks + task)(gulp, plugins);
    }
    else { return require(config.paths.gulptasks + task)(gulp, plugins, param); }
}

// Gulp FileTasks ----------------------------------------------------------------------------------------------
gulp.task('hello', getFileTask('hello'));

// Testing ----------------------------------------------------------------------------------------------------
gulp.task('test', ['jshintNreport', 'jshintspecsNreport'], function (done) {
    new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true //set to false to debug tests
    }, function (exitCode) {
        done();
    }).start();

});

// Linting ------------------------------------------------------------------------------------------------------
gulp.task('jshint', function () {
    return gulp.src(config.paths.webroot + "*.js")
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('jshintspecs', function () {
    return gulp.src("./test/**/*.js")
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'));
});

// TODO: Figure out how to make this work when dir doesnt exist.
gulp.task('jshintNreport', function () {
    return gulp.src(config.paths.webroot + "*.js")
      .pipe(jshint())
      .pipe(jshint.reporter('gulp-jshint-html-reporter', {
          filename: __dirname + '/reports/jshint/jshint-output.html',
          createMissingFolders: true
      }));
});

// TODO: Figure out how to make this work when dir doesnt exist.
gulp.task('jshintspecsNreport', function () {
    return gulp.src("./test/**/*.js")
      .pipe(jshint())
      .pipe(jshint.reporter('gulp-jshint-html-reporter', {
          filename: __dirname + '/reports/jshint/jshintspecs-output.html',
          createMissingFolders: true
      }));
});


// Clean ------------------------------------------------------------------------------------------------------
gulp.task("clean", ["clean:tests", "clean:cov", "clean:env"], function (cb) {
    return del([config.paths.reports]);
});
gulp.task("clean:tests", function (cb) {
    del([config.paths.testReport + "/**/*.*"]);
    return del([config.paths.testReport]);
});
gulp.task("clean:cov", function (cb) {
    del([config.paths.coverageReport + "/**/*.*"]);
    return del([config.paths.coverageReport]);
});
gulp.task("clean:env", function (cb) {
    del([config.ENVIRONMENT.DEV + "**/*.*"]);
    del([config.ENVIRONMENT.DEV]);
    del([config.ENVIRONMENT.PROD + "**/*.*"]);
    del([config.ENVIRONMENT.PROD]);
    return;
});


// Build ------------------------------------------------------------------------------------------------------
gulp.task("build", ["build:prod", "build:dev"], function (cb) {
    // Shortcut for building all envs.
});

// Watch task
gulp.task("buildwatch",function() {
    gulp.watch("./src/wwwroot/*.*",["build"]);
});

gulp.task("build:dev", function (cb) {
    // Will keep this really crude for now, just to flesh out across time
    gulp.src(config.paths.webroot + "*.js")
        .pipe(gulp.dest(config.ENVIRONMENT.DEV));
    gulp.src(config.paths.webroot + "*.html")
        .pipe(gulp.dest(config.ENVIRONMENT.DEV));

    gulp.src("./bower_components/angular/angular.js")
        .pipe(gulp.dest(config.ENVIRONMENT.DEV + "lib/"));
    gulp.src("./bower_components/angular-resource/angular-resource.js")
        .pipe(gulp.dest(config.ENVIRONMENT.DEV + "lib/"));
    gulp.src("./bower_components/angular-route/angular-route.js")
        .pipe(gulp.dest(config.ENVIRONMENT.DEV + "lib/"));

    gulp.src("./bower_components/bootstrap/dist/js/bootstrap.js")
        .pipe(gulp.dest(config.ENVIRONMENT.DEV + "lib/"));
    gulp.src("./bower_components/bootstrap/dist/css/bootstrap.css")
        .pipe(gulp.dest(config.ENVIRONMENT.DEV + "lib/"));
    gulp.src("./bower_components/bootstrap/dist/css/bootstrap-theme.css")
        .pipe(gulp.dest(config.ENVIRONMENT.DEV + "lib/"));

    gulp.src("./bower_components/jquery/dist/jquery.min.js")
        .pipe(gulp.dest(config.ENVIRONMENT.DEV + "lib/"));

    gulp.src("./bower_components/c3/c3.js")
        .pipe(gulp.dest(config.ENVIRONMENT.DEV + "lib/"));
    gulp.src("./bower_components/d3/d3.js")
        .pipe(gulp.dest(config.ENVIRONMENT.DEV + "lib/"));

    return;
});

gulp.task("build:prod", function (cb) {
    // we will probably need to drive towards minification here.
    gulp.src(config.paths.webroot + "*.js")
        .pipe(gulp.dest(config.ENVIRONMENT.PROD));
    gulp.src(config.paths.webroot + "*.html")
        .pipe(gulp.dest(config.ENVIRONMENT.PROD));

    gulp.src("./bower_components/angular/angular.js")
        .pipe(gulp.dest(config.ENVIRONMENT.PROD + "lib/"));
    gulp.src("./bower_components/angular-resource/angular-resource.js")
        .pipe(gulp.dest(config.ENVIRONMENT.PROD + "lib/"));
    gulp.src("./bower_components/angular-route/angular-route.js")
        .pipe(gulp.dest(config.ENVIRONMENT.PROD + "lib/"));

    gulp.src("./bower_components/bootstrap/dist/js/bootstrap.js")
        .pipe(gulp.dest(config.ENVIRONMENT.PROD + "lib/"));
    gulp.src("./bower_components/bootstrap/dist/css/bootstrap.css")
        .pipe(gulp.dest(config.ENVIRONMENT.PROD + "lib/"));
    gulp.src("./bower_components/bootstrap/dist/css/bootstrap-theme.css")
        .pipe(gulp.dest(config.ENVIRONMENT.PROD + "lib/"));

    gulp.src("./bower_components/jquery/dist/jquery.min.js")
        .pipe(gulp.dest(config.ENVIRONMENT.PROD + "lib/"));

    gulp.src("./bower_components/c3/c3.js")
        .pipe(gulp.dest(config.ENVIRONMENT.PROD + "lib/"));
    gulp.src("./bower_components/d3/d3.js")
        .pipe(gulp.dest(config.ENVIRONMENT.PROD + "lib/"));

    return;
});


// Sassing WIP ----------------------------------------------------------------------------------------------------
var sassinput = './src/styles/*.scss';
var sassoutput = './dist/dev/css';
var sassoutputprod = './dist/prod/css'
var sassOptions = {
  errLogToConsole: true,
  outputStyle: 'expanded'
};

gulp.task('sass', function () {
  return gulp
    .src(sassinput)
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(sourcemaps.write())
    //.pipe(sourcemaps.write('/maps')) // we probably dont want to be doing both, this is just an illustration.
    .pipe(gulp.dest(sassoutput))
    .pipe(gulp.dest(sassoutputprod));
});

// Sassing Watch task
gulp.task('sasswatch',function() {
    gulp.watch(sassinput,['sass']);
});


// Sassdoc WIP ----------------------------------------------------------------------------------------------------
var sassdocOptions = {
  dest: './docs/sassdoc'
};

gulp.task('sassdoc', function () {
  return gulp
    .src(sassinput)
    .pipe(sassdoc(sassdocOptions))
    .resume();
});


// JSDOC WIP ------------------------------------------------------------------------------------------------------
var jsdoc = require('gulp-jsdoc3');
gulp.task('jsdoc', function (cb) {
    var jsdocconfig = require('./jsdoc.json');
    gulp.src(['./src/wwwroot/*.js'], {read: false})
        .pipe(jsdoc(jsdocconfig, cb));
});
