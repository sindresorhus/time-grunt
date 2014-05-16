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
		setTimeout(this.async(), 1200);
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

	grunt.registerTask('testsigint', function () {
		this.async();
		setTimeout(function() {
			process.emit('SIGINT');
		}, 21);
	});

	var maxColumns = process.stdout.columns || 80;
	var maxBarWidth = (maxColumns - 20) / 2;

	var nondotted = new Array(Math.ceil(maxBarWidth)).join('a');
	var dotted = new Array(Math.ceil(maxBarWidth) + 1).join('b');

	grunt.registerTask(nondotted, function () {
		setTimeout(this.async(), 22);
	});

	grunt.registerTask(dotted, function () {
		setTimeout(this.async(), 22);
	});

	grunt.registerTask('default', [
		'test',
		'test2',
		'This is a really long task name',
		'This is the longest but very quick task name',
		'This is a really long task name which is cropped in the middle'
	]);

	grunt.registerTask('sigint', [
		'test',
		'testsigint'
	]);

	grunt.registerTask('evenodd', [
		nondotted,
		dotted
	]);

	process.on('exit', function () {
		if (!match) {
			process.exit(1);
		}
	});
};
