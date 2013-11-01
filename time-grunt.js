'use strict';
var chalk = require('chalk');
var ms = require('ms');
var table = require('text-table');
var os = require('os');

module.exports = function (grunt) {
	var MIN_MS = 20;
	var BAR_CHAR = os.type() === 'Windows_NT' ? '■' : '▇';

	var startTime = Date.now();
	var prevTime = Date.now();
	var prevTaskName = 'loading tasks';
	var tableData = [];
	var headerOrig = grunt.log.header;

	grunt.util.hooker.hook(grunt.log, 'header', function () {
		var name = grunt.task.current.nameArgs;
		var diff = Date.now() - prevTime;

		if (prevTaskName && prevTaskName !== name && diff > MIN_MS) {
			tableData.push([prevTaskName, diff]);
		}

		prevTime = Date.now();
		prevTaskName = name;
	});

	function formatTable(tableData) {
		var totalTime = Date.now() - startTime;

		var longestTaskName = tableData.reduce(function(acc, row){
			return Math.max(acc, row[0].length);
		}, 0);

		var maxBarWidth = (process.stdout.columns || 80) - (longestTaskName + 13);

		function createBar(percentage) {
			var rounded = Math.round(percentage * 100);

			if (rounded === 0) {
				return '0%';
			}

			var barLength = Math.ceil(maxBarWidth * percentage) + 1;
			var bar = new Array(barLength).join(BAR_CHAR);
			return bar + ' ' + rounded + '%';
		}

		var tableDataProcessed = tableData.map(function(row){
			var avg = row[1]/totalTime;
			return [row[0], ms(row[1]), createBar(avg)];
		});

		tableDataProcessed.push([chalk.bold('Total'), chalk.bold(ms(totalTime))]);

		return table(tableDataProcessed, {
			align: [ 'l', 'r', 'l' ],
			stringLength: function(str) { return chalk.stripColor(str).length; }
		});
	}

	process.on('exit', function () {
		grunt.util.hooker.unhook(grunt.log, 'header');

		var diff = Date.now() - prevTime;
		if (prevTaskName && diff > MIN_MS) {
			tableData.push([prevTaskName, diff]);
		}

		// `grunt.log.header` should be unhooked above, but in some cases it's not
		headerOrig('Elapsed time');
		grunt.log.writeln(formatTable(tableData));
	});
};
