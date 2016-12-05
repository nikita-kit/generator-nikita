'use strict';

var path = require('path');
var helpers = require('yeoman-generator').test;
var fs = require('fs');

fs.readFile('.yo-rc.json', function(err, yoRcContents) {
	if (err) {
		console.error('Cannot run non-interactive-generator.js in folder without .yo-rc.json!');
		process.exit(1);
	}
	yoRcContents = JSON.parse(yoRcContents.toString());
	helpers.run(path.join(__dirname, '../app'))
		.withOptions({ 'skipInstall': true, 'force': true })
		.withPrompt(yoRcContents["generator-nikita"])
		.on('end', function() {
			process.exit(0);
		});
});


