'use strict';
var chalk = require('chalk');
var ms = require('ms');
var table = require('text-table');
var hooker = require('hooker');

// crazy hack to work around stupid node-exit
var exit = function (exitCode) {
	clearInterval(interval);
	process.emit('timegruntexit', exitCode);
	exit = function () {};
};
var originalExit = process.exit;
var log = function (str) {write(str + '\n', 'utf8')};
var write = process.stdout.write.bind(process.stdout);
var interval = setInterval(function () {process.exit = exit}, 100);
//

module.exports = function (grunt) {
	if (grunt.option('help')) {
		return;
	}

	var BAR_CHAR = process.platform === 'win32' ? '■' : '▇';
	var now = new Date();
	var startTimePretty = now.toISOString().replace(/T/, ' ').replace(/\..+/, '') + ' UTC';
	var startTime = now.getTime();
	var prevTime = startTime;
	var prevTaskName = 'loading tasks';
	var headerOrig = grunt.log.header;
	var tableData = [];

	hooker.hook(grunt.log, 'header', function () {
		var name = grunt.task.current.nameArgs;
		var diff = Date.now() - prevTime;

		if (prevTaskName && prevTaskName !== name) {
			tableData.push([prevTaskName, diff]);
		}

		prevTime = Date.now();
		prevTaskName = name;
	});

	function formatTable(tableData) {
		var totalTime = Date.now() - startTime;

		var longestTaskName = tableData.reduce(function (acc, row) {
			var avg = row[1] / totalTime;
			if (avg < 0.01 && !grunt.option('verbose')) {
				return acc;
			}
			return Math.max(acc, row[0].length);
		}, 0);

		var maxColumns = process.stdout.columns || 80;
		var maxBarWidth;

		if (longestTaskName > maxColumns / 2) {
			maxBarWidth = (maxColumns - 20) / 2;
		} else {
			maxBarWidth = maxColumns - (longestTaskName + 20);
		}

		function shorten(taskName) {
			var nameLength = taskName.length;

			if (nameLength <= maxBarWidth) {
				return taskName;
			}

			var partLength = Math.floor((maxBarWidth - 3) / 2);
			var start = taskName.substr(0, partLength + 1);
			var end = taskName.substr(nameLength - partLength);
			return start.trim() + '...' + end.trim();
		}

		function createBar(percentage) {
			var rounded = Math.round(percentage * 100);

			if (rounded === 0) {
				return '0%';
			}

			var barLength = Math.ceil(maxBarWidth * percentage) + 1;
			var bar = new Array(barLength).join(BAR_CHAR);
			return bar + ' ' + rounded + '%';
		}

		var tableDataProcessed = tableData.map(function (row) {
			var avg = row[1] / totalTime;
			if (avg < 0.01 && !grunt.option('verbose')) {
				return;
			}
			return [shorten(row[0]), ms(row[1]), createBar(avg)];
		}).reduce(function (acc, row) {
			if (row) {
				acc.push(row);
				return acc;
			}
			return acc;
		}, []);

		tableDataProcessed.push([chalk.bold('Total', ms(totalTime))]);

		return table(tableDataProcessed, {
			align: [ 'l', 'r', 'l' ],
			stringLength: function (str) {
				return chalk.stripColor(str).length;
			}
		});
	}

	process.once('timegruntexit', function (exitCode) {
		clearInterval(interval);
		process.exit = originalExit;

		hooker.unhook(grunt.log, 'header');

		var diff = Date.now() - prevTime;
		if (prevTaskName) {
			tableData.push([prevTaskName, diff]);
		}

		// `grunt.log.header` should be unhooked above, but in some cases it's not
		log('\n\n' + chalk.underline('Execution Time') + chalk.gray(' (' + startTimePretty + ')'));
		log(formatTable(tableData));
		process.exit(exitCode);
	});
};
