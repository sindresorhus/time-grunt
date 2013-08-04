'use strict';
var assert = require('assert');

module.exports = function (grunt) {
	require('./time-grunt')(grunt);

	grunt.registerTask('test', function () {
		setTimeout(this.async(), 1000);
	});

	grunt.registerTask('test2', function () {
		setTimeout(this.async(), 500);
	});

	grunt.registerTask('test3', function () {
		setTimeout(this.async(), 100);
	});

	grunt.registerTask('default', ['test', 'test2', 'test3']);


	// tests
	var match = false;

	grunt.util.hooker.hook(grunt.log, 'writeln', function (str) {
		if (/Total  /.test(str)) {
			match = true;
		}
	});

	process.on('exit', function () {
		if (!match) {
			process.exit(1);
		}
	});
};
