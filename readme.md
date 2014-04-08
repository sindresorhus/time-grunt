# time-grunt [![Build Status](https://travis-ci.org/sindresorhus/time-grunt.svg?branch=master)](https://travis-ci.org/sindresorhus/time-grunt)

> Displays the execution time of [grunt](http://gruntjs.com) tasks

![screenshot](screenshot.png)


## Install

```bash
$ npm install --save-dev time-grunt
```


## Usage

```js
// Gruntfile.js
module.exports = function (grunt) {
	// require it at the top and pass in the grunt instance
	require('time-grunt')(grunt);

	grunt.initConfig();
}
```
You can also adjust the colors used for output - the color strings correspond
to the colors implemented in [chalk](https://www.npmjs.org/package/chalk).

```js
// Gruntfile.js with color adjustments
modules.exports = function(grunt) {
	//require it at the top and pass in the grunt instance and color entries
	require('time-grunt')(grunt, {
	        timestamp_color: 'yellow',
        	time_color: 'magenta',
        	bar_color: 'cyan',
        	total_color: 'red'
 	});

	grunt.initConfig();
}
```


## Clean layout

Tasks that take less than 1% of the total time are hidden to reduce clutter.

Run grunt with `grunt --verbose` to see all tasks.


## License

[MIT](http://opensource.org/licenses/MIT) © [Sindre Sorhus](http://sindresorhus.com)
