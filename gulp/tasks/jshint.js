"use strict";

var gulp         = require("gulp"),
    gutil        = require("gulp-util"),
    jshint       = require("gulp-jshint"),
    path         = require("path"),
    map          = require("map-stream"),
    handleErrors = require("../util/handleErrors"),
    errors       = [];

gulp.task("jshint", function(callback) {
    // Reset errors
    errors = [];
    gulp.src([ "**/*.{js,json}", "!node_modules/**" ])
        .pipe(jshint())
        .pipe(jshint.reporter("jshint-stylish"))
        .pipe(map(function(file, callback) {
            errors.push(file.jshint.success);
            callback(null, file);
        }))
        .on("end", function() {
            if(errors.filter(function(success){return !success;}).length) {
                gutil.beep();
            }

            callback();
        });
});
