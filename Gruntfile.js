'use strict';
var assert = require('assert');

module.exports = function (grunt) {

	// tests
	var match = false;

	grunt.util.hooker.hook(process.stdout, 'write', function (str) {
		if (/Total/.test(str)) {
			match = true;
		}
	});


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

	grunt.registerTask('This is the longest but very quick task name', function () {
		setTimeout(this.async(), 1);
	});

	grunt.registerTask('This is a really long task name which is cropped in the middle', function () {
		setTimeout(this.async(), 21);
	});

	grunt.registerTask('default', [
		'test',
		'test2',
		'This is a really long task name',
		'This is the longest but very quick task name',
		'This is a really long task name which is cropped in the middle'
	]);


	process.on('exit', function () {
		if (!match) {
			process.exit(1);
		}
	});
};
