# time-grunt [![Build Status](https://travis-ci.org/sindresorhus/time-grunt.svg?branch=master)](https://travis-ci.org/sindresorhus/time-grunt)

> Display the elapsed execution time of [grunt](http://gruntjs.com) tasks

![screenshot](screenshot.png)


## Usage

```sh
$ npm install --save-dev time-grunt
```

```js
// Gruntfile.js
module.exports = function (grunt) {
	// require it at the top and pass in the grunt instance
	require('time-grunt')(grunt);

	grunt.initConfig();
}
```
or with options
```js
// Gruntfile.js
module.exports = function (grunt) {
	// require it at the top and pass in the grunt instance
	require('time-grunt')(grunt, {
		colors: {
			progressBar: 'red'
		}
	});

	grunt.initConfig();
}
```

## Options [optional]

+ **colors:** - If you want to change color of elements use this property. Allows colors: **progressBar** - default blue, **totalTime** - default magenta, **executionTime** - default gray

## Clean layout

Tasks that take less than 1% of the total time are hidden to reduce clutter.

Run grunt with `grunt --verbose` to see all tasks.


## License

MIT © [Sindre Sorhus](http://sindresorhus.com)
