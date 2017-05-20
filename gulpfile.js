/* eslint-env es6, eslint-disable no-var, prefer-arrow-callback */
/*eslint strict: [2, "never"]*/

const gulp = require("gulp");
const eslint = require("gulp-eslint");
const ui5preload = require("gulp-ui5-preload");
const uglify = require("gulp-uglify");
const concat = require("gulp-concat");
const clean = require("gulp-clean");
const rename = require("gulp-rename");
const header = require("gulp-header");
const streamify = require("gulp-streamify");
const sequence = require("run-sequence");
const pkg = require("./package.json");

const libNS = "ui5lab.striptoastr";

const filePath = {
    src: "./src/" + libNS.replace(".", "/") + "/*",
    test: "./test/*.js",
    dist: "./dist/",
    dest: "./dist/" + libNS.replace(".", "/")
};

const banner = ["/**",
    " * <%= pkg.name %> - <%= pkg.description %>",
    " * @version v<%= pkg.version %>",
    " * @link <%= pkg.homepage %>",
    " * @license <%= pkg.license %>",
    " */",
    ""
].join("\n");

/**
 * lint code
 * @return {Stream}
 */
gulp.task("lint", () => {
    gulp.src([filePath.src])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

/**
 * Run specs once and exit
 * To start servers and run midway specs as well:
 * @return {Stream}
 */
gulp.task("test", ["lint"], (done) => {
    startTests(true /*singleRun*/ , done);
});

/**
 * Run specs and wait.
 * Watch for file changes and re-run tests on each change
 */
gulp.task("tdd", (done) => {
    startTests(false /*singleRun*/ , done);
});

/**
 * Start the tests using karma.
 * @param  {boolean} singleRun - True means run once and end (CI), or keep running (dev)
 * @param  {Function} done - Callback to fire when karma is done
 * @return {undefined}
 */
function startTests(singleRun, done) {
    var Server = require("karma").Server;

    const karmaCompleted = (karmaResult) => {
        console.log("Karma completed");

        if (karmaResult === 1) {
            done("karma: tests failed with code " + karmaResult);
        } else {
            done();
        }
    }

    new Server({
        configFile: __dirname + "/karma.conf.js",
        singleRun: !!singleRun
    }, karmaCompleted).start();
}

/**
 * clean dest folder
 */
gulp.task("clean", () => {
    return gulp.src(filePath.dist, {
        read: false
    }).pipe(clean());
});

/**
 * create script dbg files
 */
gulp.task("scripts-dbg", ["lint", "clean"], () => {
    return gulp.src(filePath.src)
        .pipe(header(banner, { pkg: pkg }))
        .pipe(rename({ suffix: "-dbg" }))
        .pipe(gulp.dest(filePath.dest))
        .on("error", (err) => {
            console.error("Error in scripts-dbg task", err.toString());
        });
});

/**
 * create minified scripts
 */
gulp.task("scripts-min", ["lint", "clean"], () => {
    const options = {
        preserveComments: "license"
    };
    return gulp.src(filePath.src)
        .pipe(header(banner, { pkg: pkg }))
        .pipe(streamify(uglify(options)))
        .pipe(gulp.dest(filePath.dest))
        .pipe(concat("library-all.js"))
        .pipe(gulp.dest(filePath.dest));
});

/**
 * create ui5 library preload json file
 */
gulp.task("buildlibrary", ["lint", "clean", "scripts-min", "scripts-dbg"], () => {
    return gulp.src([filePath.dest + "/**/!(*-dbg.js|*-all.js)"])
        .pipe(ui5preload({ base: "dist/ui5lab/striptoastr", namespace: libNS, isLibrary: true }))
        .pipe(gulp.dest(filePath.dest));
});

/**
 * build task
 */
gulp.task("build", (cb) => {
    sequence(["lint", "test"], "buildlibrary", cb);
});