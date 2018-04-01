const gulp = require('gulp'),
    webserver = require('gulp-webserver'),
    watch = require('gulp-watch'),
    concat = require('gulp-concat'),
    livereload = require('gulp-livereload'),
//plumber = require('gulp-plumber'),
    sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
    webpack = require('gulp-webpack'),
    minifyHTML = require('gulp-minify-html'),
    uglify = require('gulp-uglify'),
    changed = require('gulp-changed'),
    cleanCSS = require('gulp-clean-css'),
    path = require('path'),
    replace = require('gulp-replace-task'),
    clean = require('gulp-clean'),
    stripDebug = require('gulp-strip-debug'),
    rev = require('gulp-rev'),
    revCollector = require('gulp-rev-collector'),
    runSequence = require('run-sequence'),
    //uncss = require('gulp-uncss'),
    htmlSnapshots = require('html-snapshots'),
    html = [
        'dev/upload-static/*.html',
        'dev/index.html',
        'dev/untitled/ls-iframe.html',
        'dev/app/**/**/*.html',
        'dev/app/_common/tmpl/*.html'
    ],
    vendor = [
        "bower_components/jquery/dist/jquery.min.js",
        "bower_components/angular/angular.js",
        "bower_components/ng-directive-lazy-image/release/lazy-image.min.js",
        'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
        'dev/assets/js/vendor/angular-locale_ru-ru.js',
        'bower_components/oclazyload/dist/ocLazyLoad.min.js',
        "bower_components/angular-cookies/angular-cookies.min.js",
        'bower_components/ng-file-upload/ng-file-upload-all.min.js',
        "bower_components/satellizer/satellizer.min.js",
        "bower_components/ngstorage/ngStorage.min.js",
        'bower_components/angular-ui-router/release/angular-ui-router.js',
        'bower_components/angular-recaptcha/release/angular-recaptcha.min.js',
        "bower_components/angular-rangeslider/angular.rangeSlider.js",/// вместо slimscroll и bootstrap-slider
        "dev/assets/js/vendor/ngMask.js",// изменил внутри, https://github.com/candreoliveira/ngMask/pull/104/files
        "dev/assets/js/vendor/mask.min.js",
        'bower_components/angular-animate/angular-animate.min.js',
        'bower_components/ngtouch/build/ngTouch.min.js',
        'bower_components/angular-sanitize/angular-sanitize.min.js',
        'bower_components/angular-ui-select/dist/select.min.js',
        //'bower_components/isteven-angular-multiselect/isteven-multi-select.js',
        'bower_components/ng-videosharing-embed/build/ng-videosharing-embed.min.js',
        'bower_components/angular-bootstrap-lightbox/dist/angular-bootstrap-lightbox.min.js',
        //'dev/assets/js/vendor/angular-bootstrap-lightbox-custom.js',
        'dev/assets/js/vendor/pagination.js',
        'bower_components/ng-img-crop-full-extended/compile/minified/ng-img-crop.js',
        'node_modules/angularjs-yandex-metrika/dist/metrika.js',
        'bower_components/fastclick/lib/fastclick.js',
        'dev/assets/js/vendor/angular-ui-event.js',
        "dev/assets/js/vendor/bootstrap.min.js",
        "bower_components/angulargrid/angulargrid.min.js",
        "bower_components/ngToast/dist/ngToast.min.js",
        "bower_components/angular-dynamic-number/release/dynamic-number.min.js",

        // polyfills
        'dev/assets/js/polyfills/hand-made.js',// hand-made фишки и расширения общего функционала
        'dev/assets/js/polyfills/window.URL.js',

    ],

    allAssets = [
        'dev/robots.txt',
        'dev/upload-static/*.*','!dev/upload-static/*.html',
        //'dev/assets/css/screen.css',
        'dev/assets/css/angular-custom.min.css',
        'dev/assets/fonts/*.*',
        'dev/assets/ico/*.*',
        'dev/assets/img/*.*',
        'dev/assets/_img/*.*',
        'dev/assets/video/*.*',
        'dev/assets/js/deferred/*.js',
        'dev/assets/js/onload/*.js'
    ],

    app_sass = ['dev/assets/scss/*.scss'],
    tinyAssets = [
    'bower_components/tinymce-dist/skins/lightgray/*.*',
    'bower_components/tinymce-dist/skins/lightgray/**/*.*'
    ],
    ckEditorAssets = [
        'dev/assets/js/deferred/angular-ckeditor/**/**/**/**/**/*.*'
    ]
    ;

/*var result = htmlSnapshots.run({
    input: "array",
    source: ['user/2/about'],//"/path/to/robots.txt",
    //hostname: "http://localhost:8000/",
    outputDir: "./snapshots",
    outputDirClean: true,
    selector: "#dynamic-content"
});*/
var fs = require("fs");
var util = require("util");
var assert = require("assert");

gulp.task('htmlSnapshots',()=>{
    const fetch = require('node-fetch');
    const baseUrl = 'http://constart.ru/';//beta.constart.ru
    const baseServerUrl = 'http://service.constart.ru/';//http://service.constart.ru/ http://beta.constart.ru:81/
    const urlsChunk = ['','users','projects','help'];
    const urls = urlsChunk.map(url=>baseUrl + url);

    fetch(`${baseServerUrl}project/list`)
        .then(res => res.json())
        .then(body => {
            const projectIds = body.map(l=>`${baseUrl}${l.id}/project/1/about`).slice(0,2);
            _htmlSnapshots(projectIds)
        });
    function _htmlSnapshots(arr) {

        const _arr = urls.concat(arr);
        htmlSnapshots.run({
            input: "array",
            source: _arr,
            outputDir: path.join(__dirname, "./view"),
            //outputDirClean: true,
            //selector: ".wrapper",
            //phantomjsOptions: "--remote-debugger-port=9000",
            snapshotScript: {
                script: "customFilter",
                module: path.join(__dirname, "htmlSnapshotsFilter.js")
            },
            timeout: 15000,
            phantomjsOptions: [
                "--ssl-protocol=any",
                "--ignore-ssl-errors=true",
                "--load-images=false"
            ]
        }, function(err, completed) {

            console.log("completed: ",completed);
            //console.log(util.inspect(completed));

            // throw if there was an error
            //assert.ifError(err);
        });
    }

});

var rename = require("gulp-rename");
var postcss      = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var processors = [
    autoprefixer({browsers: ['last 5 version']})
];
gulp.task('minify-css', function() {
    return gulp.src('dev/assets/css/screen.css')
        /*.pipe(uncss({
            html: html
        }))*/
        .pipe(postcss(processors))// 40кб экономия
        .pipe(cleanCSS({debug: true}, function(details) {
            console.log(`${details.name} :  ${details.stats.minifiedSize},
             saved ${Math.floor(100*(details.stats.originalSize-details.stats.minifiedSize)/details.stats.originalSize)}%`);
        }))
        .pipe(gulp.dest('production/assets/css/'));
});
gulp.task('air-minify-css', function() {
    return gulp.src('dev/assets/css/screen-air.css')
        .pipe(postcss(processors))
        .pipe(cleanCSS({debug: true}, function(details) {}))
        .pipe(rename("screen.css"))
        .pipe(gulp.dest('production/assets/css/'));
});



//http://www.sdblog.ru/archives/borimsya-s-keshirovaniem-stranits-s-pomoshhyu-gulp/
// меняю ревизии активам
gulp.task('rev', function() {
    return gulp.src([
        'production/app/index.js',
        'production/app/vendors.js',
        'production/assets/css/screen.css',
        'production/assets/css/angular-custom.min.css'])
    .pipe(rev())
    //  сохраняем собранный файл но уже с измененым именем
        // чтобы не ломались пути к ассетам из screen.css
    .pipe(gulp.dest('production/assets/css/'))
    //  сохраняем новое имя файла
    .pipe(rev.manifest())
    // расположения файла манифеста
    .pipe(gulp.dest('manifests/'));
});

gulp.task('rev_collector', function() {
    // расположения файла манифеста и файла index.html
    gulp.src(['manifests/*.json', 'production/index.html'])
        // чтобы не ломались пути к ассетам из screen.css
        .pipe(revCollector({
            replaceReved: true,
            dirReplacements: {
                'app/': 'assets/css/',
                'assets/css/': 'assets/css/'
            }
        }))
        //  сохраняем html
        .pipe(gulp.dest('production'));// с перезаписью,{overwrite:true}
});
/*gulp.task('_rev', ['rev'],function () {
    return gulp.start('rev_collector');
});*/

/*gulp.task('base64', function () {
    return gulp.src('./css/!*.css')
        .pipe(base64({
            baseDir: 'public',
            extensions: ['svg', 'png', /\.jpg#datauri$/i],
            exclude:    [/\.server\.(com|net)\/dynamic\//, '--live.jpg'],
            maxImageSize: 8*1024, // bytes
            debug: true
        }))
        .pipe(concat('main.css'))
        .pipe(gulp.dest('./public/css'));
});*/

gulp.task('webpack-prod', function () {
    var p = [{
        match: /("TYPE","air")/g,// на всякий случай если забуду поменять
        replacement: function () {
            return '"TYPE","all"'
        }},{
        match: /http:\/\/beta\.constart\.ru:81\//g,
        replacement: function () {
            return 'http://service.constart.ru/'
        }}];
    return gulp.src("./dev/app/index.module.js")
        .pipe(webpack(require('./webpack-prod')))
        .pipe(stripDebug())
        .pipe(replace({ patterns: p }))
        .pipe(gulp.dest('production/app'));
});
gulp.task('webpack-test', function () {
    var p = [{
        match: /("TYPE","air")/g,// на всякий случай если забуду поменять
        replacement: function () {
            return '"TYPE","all"'
        }}];
    return gulp.src("./dev/app/index.module.js")
        .pipe(webpack(require('./webpack-prod')))
        .pipe(replace({ patterns: p }))
        .pipe(gulp.dest('production/app'));
});
gulp.task('air-webpack-prod', function () {
    var p = [{
        match: /http:\/\/beta\.constart\.ru:81\//,// запросы беку
        replacement: function () {
            return 'http://service.constart.ru/'
        }},{
        match: /("TYPE","all")/,
        replacement: function () {
            return '"TYPE","air"'
        }}];
    return gulp.src("./dev/app/index.module.js")
        .pipe(webpack(require('./webpack-prod')))
        .pipe(stripDebug())
        .pipe(replace({ patterns: p }))
        .pipe(gulp.dest('production/app'));
});
gulp.task('air-webpack-test', function () {
    var p = [{
        match: /("TYPE","all")/g,
        replacement: function () {
            return '"TYPE","air"'
        }}];
    return gulp.src("./dev/app/index.module.js")
        .pipe(webpack(require('./webpack-prod')))
        .pipe(replace({ patterns: p }))
        .pipe(gulp.dest('production/app'));
});


gulp.task('html', function () {
    // изза особенности минификатора  вручную прописываю пробел
    var p = [{
        match: /(num-thousand-sep="")/g,
        replacement: function () {
            return 'num-thousand-sep=" "'
        }}];

    return gulp.src(html, {base: 'dev'})
        .pipe(minifyHTML({empty: true}))
        .pipe(replace({ patterns: p }))
        .pipe(gulp.dest('production/'));
});

gulp.task('watch-html-dev', function () {
    return gulp.src(html, {base: 'dev'})
        .pipe(changed('production/'))
        .pipe(livereload());
});



gulp.task('moveAssets', function () {

    /* не удалять!!!!!!!!!!!!!!!!!
    есть смысл открыть когда что то изменю*/
    /*gulp.src(ckEditorAssets, {base: 'dev/assets/js/deferred/angular-ckeditor'})
        .pipe(gulp.dest('production/assets/js/deferred/angular-ckeditor'));*/
    /*пока не использую
    gulp.src(tinyAssets, {base: 'bower_components/tinymce-dist'})
        .pipe(gulp.dest('production/assets/js/deferred'));*/
    return gulp.src(allAssets, {base: 'dev'})
        .pipe(gulp.dest('production'));
});

/*gulp.task('sourceJs', function () {
    return gulp.src(vendor)
        .pipe(sourcemaps.init())
        .pipe(concat('vendors.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('production/app'));
});*/
gulp.task('concatVenJs', function () {
    return gulp.src(vendor)
        .pipe(concat('vendors.js'))
        .pipe(uglify({preserveComments: 'function'}))
        .pipe(gulp.dest('production/app'));
});

gulp.task('concatVenJs-dev', function () {
    return gulp.src(vendor)
        .pipe(sourcemaps.init())
        .pipe(concat('vendors.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dev/app'));
});

gulp.task('watch', function () {
    gulp.watch([html], ['watch-html-dev']);
    livereload.listen();
});

gulp.task('air-google-tag', function () {
    var p = [{
        match: /(GTM-W4K6NK6)/g,
        replacement: function () {
            return 'GTM-KFFTQHZ'
        }}];
    return gulp.src("production/index.html")
        .pipe(replace({ patterns: p }))
        .pipe(gulp.dest('production'));
});

gulp.task('sass', function () {
    gulp.src('dev/assets/scss/screen.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        // .pipe(concat('screen.css'))
        .pipe(gulp.dest('production/assets/css'))
});
gulp.task('sass-dev', function () {
    gulp.src('dev/assets/scss/screen.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dev/assets/css/'))
        .pipe(livereload());
});
gulp.task('clean-prod', function () {
    return gulp.src('production/app', {read: false})
        .pipe(clean());
});
/*
* для прода необходимо:
*
* замена baseUrl, iframeUrl
*
* */
gulp.task('install', function () {
    runSequence('clean-prod',['html', 'concatVenJs', 'moveAssets'],['minify-css', 'webpack-prod'],'rev','rev_collector');// 'sass',
});
/*
 * для тест прода необходимо:
 *
 * замена iframeUrl
 *
 * */
gulp.task('install-test', function () {
    runSequence('clean-prod',['html', 'concatVenJs', 'moveAssets'],['minify-css', 'webpack-test'],'rev','rev_collector');
});
/*
* для одвф необходимо:
* замена css файла
* замена ('TYPE','all') на ('TYPE', 'air')
* замена id google tag
* */
gulp.task('air-install-test', function () {
    // todo в moveAssets в первый раз надо открыть ассеты тини редактора
    runSequence('clean-prod',['html', 'concatVenJs', 'moveAssets'],
        ['air-minify-css', 'air-webpack-test','air-google-tag'],'rev','rev_collector');
});
gulp.task('air-install-prod', function () {
    // todo в moveAssets в первый раз надо открыть ассеты тини редактора
    runSequence('clean-prod',['html', 'concatVenJs', 'moveAssets'],
        ['air-minify-css', 'air-webpack-prod','air-google-tag'],'rev','rev_collector');
});

/*gulp.task('_install', function() {
    return runSequence('webpack-prod', 'rev', 'rev_collector');
});*/

/*gulp.task('_install-test',['_install-test'],function () {//'clean-prod','html', 'concatVenJs', 'moveAssets', 'minify-css',
    gulp.start('rev', 'rev_collector')
});*/

gulp.task('webserver', function () {
    gulp.src('production')
        .pipe(webserver({
            fallback: 'index.html',
            livereload: true,
            proxies: [{source: '/production', target: 'http://localhost:8080/'}]
        }));
});

