'use strict';
var chalk = require('chalk');
var ms = require('ms');
var table = require('text-table');

module.exports = function (grunt) {
	var startTime = process.hrtime();
	var prevTime = process.hrtime();
	var prevTaskName = '';
	var tableData = [];

  function toMillisecond(tuple) {
    return (tuple[0] * 1e9 + tuple[1]) / 1e6;
  }

	grunt.util.hooker.hook(grunt.log, 'header', function () {
		var name = grunt.task.current.nameArgs;
		var diff = process.hrtime(prevTime);

		// hide tasks taking less than 20ms
		if (prevTaskName && prevTaskName !== name && toMillisecond(diff) > 20) {
			tableData.push([prevTaskName, ms(toMillisecond(diff))]);
			prevTime = process.hrtime();
		}

		prevTaskName = name;
	});

	process.on('exit', function () {
		grunt.util.hooker.unhook(grunt.log, 'header');

		if (prevTaskName) {
			tableData.push([prevTaskName, ms(toMillisecond(process.hrtime(prevTime)))]);
		}

		tableData.push(['Total', ms(toMillisecond(process.hrtime(startTime)))]);

		grunt.log.header('Elapsed time');
		grunt.log.writeln(table(tableData).replace(/Total .+/, chalk.bold('$&')));
	});
};
