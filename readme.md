# time-grunt [![Build Status](https://travis-ci.org/sindresorhus/time-grunt.svg?branch=master)](https://travis-ci.org/sindresorhus/time-grunt)

> Display the elapsed execution time of [grunt](http://gruntjs.com) tasks

![](screenshot.png)


## Install

```
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


## Optional callback

If you want to collect the timing stats for your own use, pass in a callback:

```js
require('time-grunt')(grunt, function (stats, done) {
	// do whatever you want with the stats
	uploadReport(stats);

	// be sure to let grunt know when to exit
	done();
});
```


## Optional ignored tasks

If you want to exclude certain grunt tasks (e.g. watch) from appearing in the output, you may pass them in via an array:

```js
require('time-grunt')(grunt, undefined, ['watch']);
```


## Clean layout

Tasks that take less than 1% of the total time are hidden to reduce clutter.

Run grunt with `grunt --verbose` to see all tasks, including ignored ones.


## License

MIT © [Sindre Sorhus](http://sindresorhus.com)
