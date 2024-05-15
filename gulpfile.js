    /****************************/
    /*  INITIALIZING OF CONSTS  */
    /****************************/

    const { src, dest, watch, parallel, series } = require('gulp');
    const { pipeline } = require('stream');
    const sass = require('sass');
    const autoprefixer = require('gulp-autoprefixer');
    const babel = require('gulp-babel');
    const browserSync = require('browser-sync').create();
    const clean = require('gulp-clean');
    const concat = require('gulp-concat');
    const fileinclude = require('gulp-file-include');
    const fs = require('fs-extra');
    const gulpSass = require('gulp-sass');
    const gulpif = require('gulp-if');
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
    const webpack = require('webpack');
    const webpackstream = require('webpack-stream');
    const zip = require('gulp-zip');
    const csso = require('gulp-csso');




    /************************/
    /*  INCLUDE HTML PAGES  */
    /************************/

    const html = (callback) => {
        return pipeline(
            src('./dev/html/*.html'),
            fileinclude({ prefix: '@@' }),
            webpHTML(),
            dest('./dev'),
            browserSync.stream(),
            callback
        );
    }




    /*****************************************************************/
    /*  SCSS COMPILE/CONCAT/MAP FUNCTIONS(SPLIDE IS OFF BY DEFAULT)  */
    /*****************************************************************/

    const styles = (callback) => {
        return pipeline(
            src([
                //'./node_modules/@splidejs/splide/dist/css/splide.min.css',
                //'./node_modules/bootstrap/scss/bootstrap.scss',
                './dev/scss/style.scss'
            ]),
            sourcemaps.init(),
            plumber({
                errorHandler: notify.onError(function(err) {
                    return {
                        title: 'Styles error',
                        sound: false,
                        message: err.message
                    }
                })
            }),
            mainSass(),
            autoprefixer({
                cascade: false,
                grid: true,
                overrideBrowserslist: ["last 5 versions"]
            }),
            concat('style.min.css'),
            sourcemaps.write('./'),
            dest('./dev/css'),
            browserSync.stream(),
            callback
        );
    }




    /******************************************************/
    /*  JS-FILES CONCAT/MINIFY(SPLIDE IS OFF BY DEFAULT)  */
    /******************************************************/

    const scripts = (callback) => {
        return pipeline(
        src([
                //'./node_modules/@splidejs/splide/dist/js/splide.js',
                './dev/js/components/*.js',
            ]),
            plumber({
                errorHandler: notify.onError(function(err) {
                    return {
                        title: 'JS error',
                        sound: false,
                        message: err.message
                    }
                })
            }),
            webpackstream(require('./webpack.config.js')[1], webpack),
            dest('./dev/js'),
            (browserSync.stream()),
            callback
        );
    }




    /*************************************/
    /*  IMGS MINIFY/CONVERTING/UPDATING  */
    /*************************************/

    const images = (callback) => {
        return pipeline(
        src(['./dev/images/src/*.*', '!dev/images/src/*.svg']),
            src('./dev/images/src/*.*'),
            newer('./dev/images'),
            webp(),
            src('./dev/images/src/*.*'),
            newer('./dev/images'),
            imagemin(),
            dest('./dev/images'),
            callback
        );
    }




    /****************************/
    /*  CONVERTING SVG-SPRITES  */
    /****************************/

    const sprite = (callback) => {
        return pipeline(
        src('./dev/images/src/svg/*.svg'),
            svgsprite({
                mode: {
                    stack: {
                        sprite: '../sprite.svg',
                        example: true
                    }
                }
            }),
            dest('./dev/images/svg_out'),
            callback
        );
    }




    /***********************************/
    /*  TTF TO WOFF2 FONTS CONVERTING  */
    /***********************************/

    const fonts = (callback) => {
        return pipeline(
        src('./dev/fonts/src/*.*'),
            src('./dev/fonts/*.ttf'),
            ttf2woff2(),
            dest('./dev/fonts'),
            callback
        );
    }




    /*************************/
    /*  ARCHIVE THE PROJECT  */
    /*************************/

    const zipfiles = (callback) => {
        return pipeline(
            src('./dist/**'),
            zip('dist.zip'),
            dest('./'),
            callback
        );
    }




    /****************************************/
    /*  WATCHING FILES MODIFY & BROWSERSYNC */
    /****************************************/

    const watcher = () => {
        browserSync.init({
            server: {
                baseDir: 'dev/'
            },
            browser: "google-chrome",
        });
        watch(['./dev/scss/**/*.scss'], styles)
        watch(['./dev/images/src'], images)
        watch(['./dev/images/src/svg'], sprite)
        watch(['./dev/fonts/src/'], fonts)
        watch(['./dev/js/components/*.js'], scripts)
        watch(['./dev/html/**/*.html'], html)
        watch(['./dev/*.html']).on('change', browserSync.reload)
    }




    /**************************************/
    /*  CLEAN 'DIST' FOLDER BEFORE BUILD  */
    /**************************************/

    const cleanapp = (callback) => {
        return pipeline(
        src('./dist/*'),
            gulpif(fs.existsSync('./dist'), clean()),
            callback
        );
    }




    /****************************/
    /*  BUILD PROJECT FOR PROD  */
    /****************************/

    const compileProd = (callback) => {
        return pipeline(
        src([
                './dev/css/style.min.css',
                './dev/images/favicon.ico',
                './dev/images/*.webp',
                './dev/images/*.png',
                './dev/images/*.jpeg',
                './dev/fonts/*.*',
                './dev/js/main.bundle.js',
                './dev/*.html',
                './dev/media/*.mp3'
            ], { base: 'dev' }),
            dest('./dist'),
            callback
        );
    }




    /*******************************/
    /*  BUILD PROJECT FOR BACKEND  */
    /*******************************/

    const htmlback = (callback) => {
        return pipeline(
        src('./dev/html/*.html'),
            fileinclude({ prefix: '@@' }),
            webpHTML(),
            dest('./dist'),
            callback
        );
    }


    const stylesback = (callback) => {
        return pipeline(
        src([
                //'./node_modules/@splidejs/splide/dist/css/splide.min.css',
                //'./node_modules/bootstrap/scss/bootstrap.scss',
                './dev/scss/style.scss'
            ]),
            mainSass(),
            autoprefixer({
                cascade: false,
                grid: true,
                overrideBrowserslist: ["last 8 versions"],
                browsers: [
                    'Android >= 4',
                    'Chrome >= 20',
                    'Firefox >= 24',
                    'Explorer >= 11',
                    'iOS >= 6',
                    'Opera >= 12',
                    'Safari >= 6',
                  ],
            }),
            concat('style.min.css'),
            dest('./dist/css'),
            callback
        );
    }


    const scriptsback = (callback) => {
        return pipeline(
        src([
                //'./node_modules/@splidejs/splide/dist/js/splide.js',
                './dev/js/components/*.js'
            ]),
            concat('main.bundle.js'),
            dest('./dist/js'),
            callback
        );
    }


    const compileBack = (callback) => {
        return pipeline(
        src([
                './dev/images/*.webp',
                './dev/images/*.png',
                './dev/images/*.jpeg',
                './dev/images/*.ico',
                './dev/fonts/*.*',
                './dev/media/*.mp3'
            ], { base: 'dev' }),
            dest('./dist'),
            callback
        );
    }




    /******************************/
    /*  MINIFYING FILES FOR PROD  */
    /******************************/

    const htmlminify = (callback) => {
        return pipeline(
        src('./dev/html/*.html'),
            fileinclude({ prefix: '@@' }),
            webpHTML(),
            htmlmin({ collapseWhitespace: true }),
            dest('./dev'),
            callback
        )
    }


    const stylesminify = (callback) => {
        return pipeline(
        src([
                //'./node_modules/@splidejs/splide/dist/css/splide.min.css',
                //'./node_modules/bootstrap/scss/bootstrap.scss',
                './dev/scss/style.scss'
            ]),
            mainSass(),
            concat('style.min.css'),
            csso(),
            dest('./dev/css'),
            callback
        );
    }


    const scriptsminify = (callback) => {
        return pipeline(
        src([
                //'./node_modules/@splidejs/splide/dist/js/splide.js',
                './dev/js/components/*.js',
            ]),
            babel({
                presets: ['@babel/env']
            }),
            webpackstream(require('./webpack.config.js')[0], webpack),
            dest('./dev/js'),
            callback
        );
    }




    /********************/
    /*  EXPORT MODULES  */
    /********************/

    module.exports = {
        "default": parallel(html, styles, scripts, images, sprite, watcher),
        "build": series(cleanapp, htmlminify, stylesminify, scriptsminify, compileProd),
        "backend": series(cleanapp, htmlback, stylesback, scriptsback, compileBack),
        "fonts": series(fonts),
        "zip": series(zipfiles)
    };
