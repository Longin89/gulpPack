    //initializing of consts
    const { src, dest, watch, parallel, series } = require('gulp');
    const scss = require('gulp-sass')(require('sass'));
    const concat = require('gulp-concat');
    const uglify = require('gulp-uglify-es').default;
    const browserSync = require('browser-sync').create();
    const autoprefixer = require('gulp-autoprefixer');
    const clean = require('gulp-clean');
    const webp = require('gulp-webp');
    const imagemin = require('gulp-imagemin');
    const newer = require('gulp-newer');
    const ttf2woff2 = require('gulp-ttf2woff2');
    const fileinclude = require('gulp-file-include');
    const notify = require('gulp-notify');
    const plumber = require('gulp-plumber');
    const sourcemaps = require('gulp-sourcemaps');
    const htmlmin = require('gulp-htmlmin');


    //include pages function
    function pages() {
        return src('dev/html/*.html')
            .pipe(fileinclude({ prefix: '@@' }))
            .pipe(dest('dev'))
            .pipe(htmlmin({ collapseWhitespace: true }))
            .pipe(dest('dev'))
            .pipe(browserSync.stream())
    }


    //fonts converting function
    function fonts() {
        return src('dev/fonts/src/*.*')
            .pipe(src('dev/fonts/*.ttf'))
            .pipe(ttf2woff2())
            .pipe(dest('dev/fonts'))
    }


    //functions for imgs(minify/converting/updating)
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


    //scripts concat function, swiper is off by default
    function scripts() {
        return src([
                //'node_modules/swiper/swiper-bundle.js',
                'dev/js/main.js',
                'dev/js/components/*.js'
            ])
            .pipe(concat('main.min.js'))
            .pipe(uglify())
            .pipe(dest('dev/js'))
            .pipe(browserSync.stream())
    }


    //SCSS function, swiper styles is off by default
    function styles() {
        return src([
                //'node_modules/swiper/swiper-bundle.css',
                'dev/scss/style.scss',
                'dev/scss/components/*.scss',
                'dev/scss/components/normalize.css'
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


    //watcher function + browserSync
    function watcher() {
        browserSync.init({
            server: {
                baseDir: 'dev/'
            }
        });
        watch(['dev/scss/style.scss', 'dev/scss/components/*.scss'], styles)
        watch(['dev/images/src'], images)
        watch(['dev/fonts/src/*.*'], fonts)
        watch(['dev/js/main.js', 'dev/js/components/*.js'], scripts)
        watch(['dev/html/partials/*'], pages)
        watch(['dev/*.html']).on('change', browserSync.reload)
    }


    //clean 'dist' folder before build
    function cleanapp() {
        return src('dist')
            .pipe(clean())
    }


    //build project function
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


    //export everything
    exports.styles = styles;
    exports.scripts = scripts;
    exports.watcher = watcher;
    exports.images = images;
    exports.fonts = fonts;
    exports.pages = pages;

    exports.build = series(cleanapp, compile);
    exports.default = parallel(styles, scripts, pages, watcher);