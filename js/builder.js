/*jslint node: true, nomen: true */
/*global __dirname */

module.exports = (function exports() {
    'use strict';

    var fs = require('fs'),
        suppose = require('suppose'),
        escapeRegexp = require('escape-regexp'),
        yoPath = require('path').resolve(__dirname + '/../node_modules/yo/cli.js');

    /**
     *
     * @param args passed to yo (i.e., ['jquery'])
     * @param questions (array of objects containing name and value)
     * @param errorCallback
     * @param endCallback
     * @param debugWriteStream stream.Writable object (optional)
     */
    exports.build = function builder(args, questions, errorCallback, endCallback, debugWriteStream) {
        var q,
            el,
            s = suppose(yoPath, args);

        if (debugWriteStream) {
            s.debug(debugWriteStream);
        }

        for (q in questions) {
            if (questions.hasOwnProperty(q)) {
                el = questions[q];
                s.on(new RegExp(escapeRegexp(el.name + ':'))).respond(el.value + '\n');
            }
        }

        s.error(errorCallback);
        s.end(endCallback);
    };

    return exports;
}());
