    /*  INITIALIZING OF CONSTS  */
    const { src, dest, watch, parallel, series } = require('gulp');
    const babel = require('gulp-babel');
    const scss = require('gulp-sass')(require('sass'));
    const concat = require('gulp-concat');
    const uglify = require('gulp-uglify-es').default;
    const browserSync = require('browser-sync').create();
    const autoprefixer = require('gulp-autoprefixer');
    const clean = require('gulp-clean');
    const webp = require('gulp-webp');
    const imagemin = require('gulp-imagemin');
    const svgsprite = require('gulp-svg-sprite');
    const newer = require('gulp-newer');
    const ttf2woff2 = require('gulp-ttf2woff2');
    const fileinclude = require('gulp-file-include');
    const notify = require('gulp-notify');
    const plumber = require('gulp-plumber');
    const sourcemaps = require('gulp-sourcemaps');
    const htmlmin = require('gulp-htmlmin');
    const zip = require('gulp-zip');


    /*  INCLUDE HTML PAGES  */

    function pages() {
        return src('dev/html/*.html')
            .pipe(fileinclude({ prefix: '@@' }))
            .pipe(dest('dev'))
            .pipe(htmlmin({ collapseWhitespace: true }))
            .pipe(dest('dev'))
            .pipe(browserSync.stream())
    }


    /*  SCSS COMPILE/MINIFY/MAP FUNCTIONS(SWIPER IS OFF BY DEFAULT)  */

    function styles() {
        return src([
                //'node_modules/swiper/swiper-bundle.css',
                'dev/scss/components/normalize.css',
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
            .pipe(autoprefixer({
                overrideBrowserlist: ['last 5 version']
            }))
            .pipe(concat('style.min.css'))
            .pipe(scss({ outputStyle: 'compressed' }))
            .pipe(sourcemaps.write())
            .pipe(dest('dev/css'))
            .pipe(browserSync.stream())
    }


    /*  JS-FILES CONCAT/MINIFY(SWIPER IS OFF BY DEFAULT)  */

    function scripts() {
        return src([
                //'node_modules/swiper/swiper-bundle.js',
                'dev/js/components/*.js',
                'dev/js/main.js'
            ])
            .pipe(sourcemaps.init())
            .pipe(babel({
                presets: ['@babel/env']
            }))
            .pipe(uglify())
            .pipe(concat('main.min.js'))
            .pipe(sourcemaps.write())
            .pipe(dest('dev/js'))
            .pipe(browserSync.stream())
    }


    /*  TTF TO WOFF2 FONTS CONVERTING  */

    function fonts() {
        return src('dev/fonts/src/*.*')
            .pipe(src('dev/fonts/*.ttf'))
            .pipe(ttf2woff2())
            .pipe(dest('dev/fonts'))
    }


    /*  IMGS MINIFY/CONVERTING/UPDATING  */

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


    /*  CONVERTING SVG-SPRITES  */

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


    /*  WATCHING FILES MODIFY & BROWSERSYNC */

    function watcher() {
        browserSync.init({
            server: {
                baseDir: 'dev/'
            }
        });
        watch(['dev/scss/components/*.scss', 'dev/scss/style.scss'], styles)
        watch(['dev/images/src'], images)
        watch(['dev/images/src/svg'], sprite)
        watch(['dev/fonts/src/*.*'], fonts)
        watch(['dev/js/main.js', 'dev/js/components/*.js'], scripts)
        watch(['dev/html/**/*.html'], pages)
        watch(['dev/*.html']).on('change', browserSync.reload)
    }


    /*  CLEAN 'DIST' FOLDER BEFORE BUILD  */

    function cleanapp() {
        return src('dist')
            .pipe(clean())
    }


    /*  BUILD PROJECT  */

    function compile() {
        return src([
                'dev/css/style.min.css',
                'dev/images/*.*',
                'dev/fonts/*.*',
                'dev/js/main.min.js',
                'dev/*.html'
            ], { base: 'dev' })
            .pipe(dest('dist'))
    }


    /*ARCHIVE THE PROJECT  */

    function zipfiles() {
        return src('dist/**')
            .pipe(zip('dist.zip'))
            .pipe(dest('./'))
    }


    /*  EXPORT EVERYTHING  */
    
    exports.styles = styles;
    exports.scripts = scripts;
    exports.watcher = watcher;
    exports.images = images;
    exports.sprite = sprite;
    exports.fonts = fonts;
    exports.pages = pages;
    exports.zip = zipfiles;

    exports.build = series(cleanapp, compile);
    exports.default = parallel(pages, styles, scripts, watcher);