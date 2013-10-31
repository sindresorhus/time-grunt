'use strict';
var chalk = require('chalk');
var ms = require('ms');
var table = require('text-table');

module.exports = function (grunt) {
    var MIN_MS = 20; // make this an option?
    var MAX_BAR_WIDTH = Math.floor((process.stdout.columns || 80) * 0.4);

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

        var tableDataProcessed = tableData.map(function(row){
            var avg = row[1]/totalTime;
            var barLength = Math.round(MAX_BAR_WIDTH*avg);
            var bar = barLength > 1 ? new Array(barLength).join('▒') + ' ' : '';
            var visual = bar + Math.round(avg * 100) + '%';
            return [row[0], ms(row[1]), visual];
        });

        tableDataProcessed.push([chalk.bold('Total'), chalk.bold(ms(totalTime))]);

        return table(tableDataProcessed, {
            align: [ 'l', 'r', 'l' ],
            stringLength: function(str) { return chalk.stripColor(str).length; }
        })
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
