"use strict";

const gulp           = require('gulp');
const browserSync    = require('browser-sync');
const sass           = require('gulp-sass');
const postcss        = require('gulp-postcss');
const autoprefixer   = require('autoprefixer');
const cssnano        = require('cssnano');
const cp             = require('child_process');
const runSequence    = require('run-sequence').use(gulp);

let messages = {
    sass:  `<span style="color: grey">Running:</span> $ gulp sass at ${paths.SCSS[0]}`,
};

let paths = {
    'SCSS': [
        'scss/*.scss',
        'scss/**/*.scss'
    ],
    'CSS': 'build/css',
    'HMTL': './index.html' // just for explanation
};

let processors = [
    // https://github.com/ai/browserslist
    autoprefixer({browsers: ['defaults']}),
    // http://cssnano.co/usage/
    cssnano({
        // way better performance.
        discardDuplicates: false
    }),
];


/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('just-reload', () => {
    browserSync.reload();
});


/**
 * Wait for build, then launch the Server
 */
// https://www.browsersync.io/docs/options
gulp.task('browser-sync', ['sass'], () => {
    browserSync({
        server: {
            baseDir: './'
        },
        online: true // better perf
    });
});


/**
 * Compile files from scss into css
 */
gulp.task('sass', () => {
    browserSync.notify(messages.SASS);
    return gulp.src(paths.SCSS)
        .pipe(sass({
            onError: browserSync.notify
        }))
        .pipe(postcss(processors))
        .pipe(gulp.dest(paths.CSS))
        .pipe(browserSync.reload({stream:true}));
});

/**
 * Watch scss files for changes & recompile
 * Watch html files & BrowserSync
 */
gulp.task('watch', () => {
    gulp.watch(paths.SCSS,    ['sass']);
    gulp.watch(paths.HTML,    ['just-reload']);
});


/**
 * Default task, running just `gulp` will compile the sass,
 * launch BrowserSync & watch files.
 */
gulp.task('default', ['browser-sync', 'watch']);
