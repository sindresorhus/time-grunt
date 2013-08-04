'use strict';
var chalk = require('chalk');
var ms = require('ms');
var table = require('text-table');

module.exports = function (grunt) {
	var startTime = Date.now();
	var prevTime = Date.now();
	var prevTaskName = '';
	var tableData = [];

	setInterval(function () {
		var name = grunt.task.current.nameArgs;

		if (prevTaskName && prevTaskName !== name) {
			tableData.push([prevTaskName, ms(Date.now() - prevTime)]);
			prevTime = Date.now();
		}

		prevTaskName = name;
	}, 20);

	process.on('exit', function () {
		if (prevTaskName) {
			tableData.push([prevTaskName, ms(Date.now() - prevTime)]);
		}

		tableData.push(['Total', ms(Date.now() - startTime)]);

		grunt.log.header('Elapsed time');
		grunt.log.writeln(table(tableData).replace(/Total .+/, chalk.bold('$&')));
	});
};
