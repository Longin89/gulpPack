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




    /************************/
    /*  INCLUDE HTML PAGES  */
    /************************/

    const html = () => {
        return src('./dev/html/*.html')
            .pipe(fileinclude({ prefix: '@@' }))
            .pipe(webpHTML())
            .pipe(dest('./dev'))
            .pipe(browserSync.stream())
    }




    /*****************************************************************/
    /*  SCSS COMPILE/CONCAT/MAP FUNCTIONS(SPLIDE IS OFF BY DEFAULT)  */
    /*****************************************************************/

    const styles = () => {
        return src([
                //'./node_modules/@splidejs/splide/dist/css/splide.min.css',
                './dev/scss/components/*.scss',
                './dev/scss/style.scss'
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
            .pipe(sourcemaps.write('./'))
            .pipe(dest('./dev/css'))
            .pipe(browserSync.stream())
    }




    /******************************************************/
    /*  JS-FILES CONCAT/MINIFY(SPLIDE IS OFF BY DEFAULT)  */
    /******************************************************/

    const scripts = () => {
        return src([
                //'./node_modules/@splidejs/splide/dist/js/splide.js',
                './dev/js/components/*.js',
            ])
            .pipe(plumber({
                errorHandler: notify.onError(function(err) {
                    return {
                        title: 'JS error',
                        sound: false,
                        message: err.message
                    }
                })
            }))
            .pipe(webpackstream(require('./webpack.config.js')[1], webpack))
            .pipe(dest('./dev/js'))
            .pipe(browserSync.stream())
    }




    /*************************************/
    /*  IMGS MINIFY/CONVERTING/UPDATING  */
    /*************************************/

    const images = () => {
        return src(['./dev/images/src/*.*', '!dev/images/src/*.svg'])
            .pipe(src('./dev/images/src/*.*'))
            .pipe(newer('./dev/images'))
            .pipe(webp())
            .pipe(src('./dev/images/src/*.*'))
            .pipe(newer('./dev/images'))
            .pipe(imagemin())
            .pipe(dest('./dev/images'))
    }




    /****************************/
    /*  CONVERTING SVG-SPRITES  */
    /****************************/

    const sprite = () => {
        return src('./dev/images/src/svg/*.svg')
            .pipe(svgsprite({
                mode: {
                    stack: {
                        sprite: '../sprite.svg',
                        example: true
                    }
                }
            }))
            .pipe(dest('./dev/images/svg_out'))
    }




    /***********************************/
    /*  TTF TO WOFF2 FONTS CONVERTING  */
    /***********************************/

    const fonts = () => {
        return src('./dev/fonts/src/*.*')
            .pipe(src('./dev/fonts/*.ttf'))
            .pipe(ttf2woff2())
            .pipe(dest('./dev/fonts'))
    }




    /*************************/
    /*  ARCHIVE THE PROJECT  */
    /*************************/

    const zipfiles = () => {
        return src('./dist/**')
            .pipe(zip('dist.zip'))
            .pipe(dest('./'))
    }




    /****************************************/
    /*  WATCHING FILES MODIFY & BROWSERSYNC */
    /****************************************/

    const watcher = () => {
        browserSync.init({
            server: {
                baseDir: 'dev/'
            }
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

    const cleanapp = () => {
        return src('./dist/*')
            .pipe(gulpif(fs.existsSync('./dist'), clean()))
    }




    /****************************/
    /*  BUILD PROJECT FOR PROD  */
    /****************************/

    const compileProd = () => {
        return src([
                './dev/css/style.min.css',
                './dev/images/favicon.ico',
                './dev/images/*.webp',
                './dev/images/*.png',
                './dev/images/*.jpeg',
                './dev/fonts/*.*',
                './dev/js/main.bundle.js',
                './dev/*.html',
                './dev/media/*.mp3'
            ], { base: 'dev' })
            .pipe(dest('./dist'))
    }




    /*******************************/
    /*  BUILD PROJECT FOR BACKEND  */
    /*******************************/

    const htmlback = () => {
        return src('./dev/html/*.html')
            .pipe(fileinclude({ prefix: '@@' }))
            .pipe(webpHTML())
            .pipe(dest('./dist'))
    }


    const stylesback = () => {
        return src([
                //'./node_modules/@splidejs/splide/dist/css/splide.min.css',
                './dev/scss/components/*.scss',
                './dev/scss/style.scss'
            ])
            .pipe(mainSass())
            .pipe(autoprefixer({
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
            }))
            .pipe(concat('style.min.css'))
            .pipe(dest('./dist/css'))
    }


    const scriptsback = () => {
        return src([
                //'./node_modules/@splidejs/splide/dist/js/splide.js',
                './dev/js/components/*.js'
            ])
            .pipe(concat('main.bundle.js'))
            .pipe(dest('./dist/js'))
    }


    const compileBack = () => {
        return src([
                './dev/images/*.webp',
                './dev/images/*.png',
                './dev/images/*.jpeg',
                './dev/images/*.ico',
                './dev/fonts/*.*',
                './dev/media/*.mp3'
            ], { base: 'dev' })
            .pipe(dest('./dist'))
    }




    /******************************/
    /*  MINIFYING FILES FOR PROD  */
    /******************************/

    const htmlminify = () => {
        return src('./dev/html/*.html')
            .pipe(fileinclude({ prefix: '@@' }))
            .pipe(webpHTML())
            .pipe(htmlmin({ collapseWhitespace: true }))
            .pipe(dest('./dev'))
    }


    const stylesminify = () => {
        return src([
                //'./node_modules/@splidejs/splide/dist/css/splide.min.css',
                './dev/scss/components/*.scss',
                './dev/scss/style.scss'
            ])
            .pipe(mainSass({ outputStyle: 'compressed' }))
            .pipe(concat('style.min.css'))
            .pipe(dest('./dev/css'))
    }


    const scriptsminify = () => {
        return src([
                //'./node_modules/@splidejs/splide/dist/js/splide.js',
                './dev/js/components/*.js',
            ])
            .pipe(babel({
                presets: ['@babel/env']
            }))
            .pipe(webpackstream(require('./webpack.config.js')[0], webpack))
            .pipe(dest('./dev/js'))
    }




    /********************/
    /*  EXPORT MODULES  */
    /********************/

    module.exports = { fonts, zipfiles };
    module.exports = {
        "default": parallel(html, styles, scripts, images, sprite, watcher),
        "build": series(cleanapp, htmlminify, stylesminify, scriptsminify, compileProd),
        "backend": series(cleanapp, htmlback, stylesback, scriptsback, compileBack)
    };