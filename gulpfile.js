var gulp = require('gulp');
var terser = require('gulp-terser');
var cleanCss = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var concat = require('gulp-concat');




var styleSrc = [
        'assets/css/unminify.css', 
        'assets/css/dropzone.min.css',
        'assets/css/bootstrap-datetimepicker.min.css', 
        'plugins/chartjs/Chart.min.css',
        'assets/css/table-layout.css',
        'assets/css/angular-notify-material.css',
        'assets/css/custom.css'
        ];

gulp.task('app-styles', function(){

    return gulp.src(styleSrc)

    	.pipe(plumber())				//keep the task running even when an error 
        .pipe(cleanCss())			//parse and minify css files
        .pipe(autoprefixer('last 2 versions'))	//add vendor specific prefixes to the style rules
        .pipe(concat('bundleapp.min.css'))	//combine all minified styles into one file
        .pipe(gulp.dest('assets/css'));
		
});



gulp.task('app', function(){

    return gulp.src([
        'app/*.js',
        'app/components/*.js',
        'app/directives/*.js',
        'app/factory/*.js',
        'app/filters/*.js',
        'app/services/*.js',
        'app/controllers/*.js'
        ])
        .pipe(terser())         
        .pipe(concat('bundle.min.js'))
        .pipe(gulp.dest('dist'));

});



gulp.task('default', function() {
   // watch for CSS changes
   gulp.watch(styleSrc, function() {
      // run styles upon changes
      gulp.run('app-styles');
   });
});

