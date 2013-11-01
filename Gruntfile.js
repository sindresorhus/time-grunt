'use strict';
var assert = require('assert');

module.exports = function (grunt) {
	require('./time-grunt')(grunt);

	grunt.registerTask('test', function () {
		setTimeout(this.async(), 1000);
	});

	grunt.registerTask('test2', function () {
		setTimeout(this.async(), 900);
	});

	grunt.registerTask('This is a really long task name', function () {
		setTimeout(this.async(), 21);
	});

	grunt.registerTask('default', ['test', 'test2', 'This is a really long task name']);


	// tests
	var match = false;

	grunt.util.hooker.hook(grunt.log, 'writeln', function (str) {
		if (/Total/.test(str)) {
			match = true;
		}
	});

	process.on('exit', function () {
		if (!match) {
			process.exit(1);
		}
	});
};
