'use strict';
var chalk = require('chalk');
var ms = require('ms');
var path = require('path');
var table = require('text-table');

module.exports = function (grunt) {
	var startTime = Date.now();
	var prevTime = Date.now();
	var prevTaskName = 'loading tasks';
	var tableData = [];
	var headerOrig = grunt.log.header;

	grunt.util.hooker.hook(grunt.log, 'header', function () {
		var name = grunt.task.current.nameArgs;
		var diff = Date.now() - prevTime;

		// hide tasks taking less than 20ms
		if (prevTaskName && prevTaskName !== name && diff > 20) {
			tableData.push([prevTaskName, ms(diff)]);
			prevTime = Date.now();
		}

		prevTaskName = name;
	});

	var prevLoadTime, prevLoadName;
	grunt.util.hooker.hook(grunt, 'loadTasks', {
		pre: function (dir) {
			var packageName = path.basename(path.dirname(dir));
			prevLoadTime = Date.now();
			prevLoadName = 'Load Tasks: ' + packageName;
		},
		post: function() {
			var diff = Date.now() - prevLoadTime;
			// Only show tasks that took over 20ms to load.
			if (diff > 20) {
				tableData.push([prevLoadName, ms(diff)]);
			}
			prevLoadTime = Date.now();
		}
	});

	process.on('exit', function () {
		grunt.util.hooker.unhook(grunt.log, 'header');

		if (prevTaskName) {
			tableData.push([prevTaskName, ms(Date.now() - prevTime)]);
		}

		tableData.push(['Total', ms(Date.now() - startTime)]);

		// `grunt.log.header` should be unhooked above, but in some cases it's not
		headerOrig('Elapsed time');
		grunt.log.writeln(table(tableData).replace(/Total .+/, chalk.bold('$&')));
	});
};
