    /****************************/
    /*  INITIALIZING OF CONSTS  */
    /****************************/

    const { src, dest, watch, parallel, series } = require('gulp');
    const sass = require('sass');
    const autoprefixer = require('gulp-autoprefixer');
    const babel = require('gulp-babel');
    const browserSync = require('browser-sync').create();
    const clean = require('gulp-clean');
    const concat = require('gulp-concat');
    const fileinclude = require('gulp-file-include');
    const gulpSass = require('gulp-sass');
    const htmlmin = require('gulp-htmlmin');
    const imagemin = require('gulp-imagemin');
    const mainSass = gulpSass(sass);
    const newer = require('gulp-newer');
    const notify = require('gulp-notify');
    const plumber = require('gulp-plumber');
    const sourcemaps = require('gulp-sourcemaps');
    const svgsprite = require('gulp-svg-sprite');
    const ttf2woff2 = require('gulp-ttf2woff2');
    const webp = require('gulp-webp');
    const webpHTML = require('gulp-webp-html');
    const webpack = require('webpack-stream');
    const zip = require('gulp-zip');


    /************************/
    /*  INCLUDE HTML PAGES  */
    /************************/

    function html() {
        return src('dev/html/*.html')
            .pipe(fileinclude({ prefix: '@@' }))
            .pipe(webpHTML())
            .pipe(dest('dev'))
            .pipe(htmlmin({ collapseWhitespace: true }))
            .pipe(dest('dev'))
            .pipe(browserSync.stream())
    }


    /*****************************************************************/
    /*  SCSS COMPILE/MINIFY/MAP FUNCTIONS(SWIPER IS OFF BY DEFAULT)  */
    /*****************************************************************/

    function styles() {
        return src([
                //'node_modules/swiper/swiper-bundle.css',
                'dev/scss/components/_normalize.css',
                'dev/scss/components/*.scss',
                'dev/scss/style.scss'
            ])
            .pipe(sourcemaps.init())
            .pipe(plumber({
                errorHandler: notify.onError(function(err) {
                    return {
                        title: 'Styles error',
                        sound: false,
                        message: err.message
                    }
                })
            }))
            .pipe(mainSass())
            .pipe(autoprefixer({
                cascade: false,
                grid: true,
                overrideBrowserslist: ["last 5 versions"]
              }))
            .pipe(concat('style.min.css'))
            .pipe(sourcemaps.write('/maps'))
            .pipe(dest('dev/css'))
            .pipe(browserSync.stream())
    }

    function stylesminify() {
        return src([
            'dev/css/style.min.css',
        ])
            .pipe(mainSass({ outputStyle: 'compressed' }))
            .pipe(dest('dev/css'))
    }


    /******************************************************/
    /*  JS-FILES CONCAT/MINIFY(SWIPER IS OFF BY DEFAULT)  */
    /******************************************************/

    function scripts() {
        return src([
                //'node_modules/swiper/swiper-bundle.js',
                'dev/js/components/*.js',
                'dev/js/main.js'
            ])
            .pipe(sourcemaps.init())
            .pipe(plumber({
                errorHandler: notify.onError(function(err) {
                    return {
                        title: 'JS error',
                        sound: false,
                        message: err.message
                    }
                })
            }))
            .pipe(webpack(require('./webpack.config.js')))
            .pipe(sourcemaps.write('./maps'))
            .pipe(babel({
                presets: ['@babel/env']
            }))
            .pipe(dest('dev/js'))
            .pipe(browserSync.stream())
    }


    /***********************************/
    /*  TTF TO WOFF2 FONTS CONVERTING  */
    /***********************************/

    function fonts() {
        return src('dev/fonts/src/*.*')
            .pipe(src('dev/fonts/*.ttf'))
            .pipe(ttf2woff2())
            .pipe(dest('dev/fonts'))
    }


    /*************************************/
    /*  IMGS MINIFY/CONVERTING/UPDATING  */
    /*************************************/

    function images() {
        return src(['dev/images/src/*.*', '!dev/images/src/*.svg'])
            .pipe(src('dev/images/src/*.*'))
            .pipe(newer('dev/images'))
            .pipe(webp())
            .pipe(src('dev/images/src/*.*'))
            .pipe(newer('dev/images'))
            .pipe(imagemin())
            .pipe(dest('dev/images'))
    }


    /****************************/
    /*  CONVERTING SVG-SPRITES  */
    /****************************/

    function sprite() {
        return src('dev/images/src/svg/*.svg')
            .pipe(svgsprite({
                mode: {
                    stack: {
                        sprite: '../sprite.svg',
                        example: true
                    }
                }
            }))
            .pipe(dest('dev/images/svg_out'))
    }


    /****************************************/
    /*  WATCHING FILES MODIFY & BROWSERSYNC */
    /****************************************/

    function watcher() {
        browserSync.init({
            server: {
                baseDir: 'dev/'
            }
        });
        watch(['dev/scss/**/*.scss'], styles)
        watch(['dev/images/src'], images)
        watch(['dev/images/src/svg'], sprite)
        watch(['dev/fonts/src/*.*'], fonts)
        watch(['dev/js/main.js', 'dev/js/components/*.js'], scripts)
        watch(['dev/html/**/*.html'], html)
        watch(['dev/*.html']).on('change', browserSync.reload)
    }


    /**************************************/
    /*  CLEAN 'DIST' FOLDER BEFORE BUILD  */
    /**************************************/

    function cleanapp() {
        return src('dist')
            .pipe(clean())
    }


    /*******************/
    /*  BUILD PROJECT  */
    /*******************/

    function compile() {
        return src([
                'dev/css/style.min.css',
                'dev/images/*.*',
                'dev/fonts/*.*',
                'dev/js/main.bundle.js',
                'dev/*.html'
            ], { base: 'dev' })
            .pipe(dest('dist'))
    }


    /*************************/
    /*  ARCHIVE THE PROJECT  */
    /*************************/

    function zipfiles() {
        return src('dist/**')
            .pipe(zip('dist.zip'))
            .pipe(dest('./'))
    }


    /*******************************/
    /*  BUILD PROJECT FOR BACKEND  */
    /*******************************/
    
    function htmlback() {
        return src('dev/html/*.html')
            .pipe(fileinclude({ prefix: '@@' }))
            .pipe(webpHTML())
            .pipe(dest('dev'))
    }


    function stylesback() {
        return src([
                //'node_modules/swiper/swiper-bundle.css',
                'dev/scss/components/_normalize.css',
                'dev/scss/components/*.scss',
                'dev/scss/style.scss'
            ])
            .pipe(mainSass())
            .pipe(autoprefixer({
                cascade: false,
                grid: true,
                overrideBrowserslist: ["last 5 versions"]
              }))
            .pipe(concat('style.min.css'))
            .pipe(dest('dev/css'))
    }


    const scriptsback = () => {
        return src([
                //'node_modules/swiper/swiper-bundle.js',
                'dev/js/components/*.js',
                'dev/js/main.js'
            ])
            .pipe(concat('main.bundle.js'))
            .pipe(babel({
                presets: ['@babel/env']
            }))
            .pipe(dest('dev/js'))
    }


    /********************/
    /*  EXPORT MODULES  */
    /********************/

    module.exports = {fonts, zipfiles};
    module.exports = {
        "default":  parallel(html, styles, scripts, images, sprite, watcher),
        "build":    series(cleanapp, html, stylesminify, scripts, compile),
        "backend":  series(cleanapp, htmlback, stylesback, scriptsback, compile)
    };