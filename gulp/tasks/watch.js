"use strict";

var gulp   = require("gulp"),
    path   = require("path"),
    config = require("../config");

gulp.task("watch", function() {
    gulp.watch(
        [ "**/*.{js,json}", "!node_modules/**" ],
        { cwd: config.root },
        [ "jshint" ]
    );
});
