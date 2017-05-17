/* eslint-env es6, eslint-disable no-var, prefer-arrow-callback */
/*eslint strict: [2, "never"]*/

const gulp = require("gulp");
const eslint = require("gulp-eslint");

const filePath = {
    src: "./src/*.js",
    test: "./test/*.js"
};

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

    function karmaCompleted(karmaResult) {
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