/*global describe, beforeEach, it*/
'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');

describe('nikita:app:custom-twigRender', function () {
	this.timeout(5000);
	before(function (done) {
		helpers.run(path.join(__dirname, '../app'))
			.inDir(path.join(os.tmpdir(), './temp-test'))
			.withOptions({ 'skipInstall': true })
			.withPrompt({
				template: "web-app",
				staticPageGenerator: "twigRender",
				private: true,
				name: "testrun" + (new Date()).getTime(),
				nikitaCssMixins: [],
				useBuildFolders: true,
				nikitaCssExtends: [],
				features: [],
				addons: []
			})
			.on('end', done);
	});

	it('creates files', function () {
		assert.file([
			'package.json',
			'Gruntfile.js',
			'grunt/aliases.js',
			'grunt/config/twigRender.js',
			'source/js/_main.js',
			'source/sass/styles.scss',
			'source/html/pages/index.twig'
		]);
	});
});

describe('nikita:app:custom-assemble', function () {
	this.timeout(5000);
	before(function (done) {
		helpers.run(path.join(__dirname, '../app'))
			.inDir(path.join(os.tmpdir(), './temp-test'))
			.withOptions({ 'skipInstall': true })
			.withPrompt({
				template: "web-app",
				staticPageGenerator: "assemble",
				private: true,
				name: "testrun" + (new Date()).getTime(),
				nikitaCssMixins: [],
				useBuildFolders: true,
				nikitaCssExtends: [],
				features: [],
				addons: []
			})
			.on('end', done);
	});

	it('creates files', function () {
		assert.file([
			'package.json',
			'Gruntfile.js',
			'grunt/aliases.js',
			'grunt/config/assemble.js',
			'source/js/_main.js',
			'source/sass/styles.scss',
			'source/assemble/pages/index.hbs',
		]);
	});
});

describe('nikita:app:web-app', function () {
	this.timeout(5000);
	before(function (done) {
		helpers.run(path.join(__dirname, '../app'))
			.inDir(path.join(os.tmpdir(), './temp-test'))
			.withOptions({ 'skipInstall': true })
			.withPrompt({
				template: "web-app",
				private: true,
				useBuildFolders: true,
				name: "testrun" + (new Date()).getTime()
			})
			.on('end', done);
	});

	it('creates files', function () {
		assert.file([
			'package.json',
			'Gruntfile.js',
			'grunt/aliases.js',
			'source/js/_main.js',
			'source/sass/styles.scss',
		]);
		
		if (process.env.TEMPLATE === "web-app") {
			this.timeout(5 * 60 * 1000);
			var spawnCommand = require('yeoman-generator/lib/actions/spawn_command');
			spawnCommand("npm", ["install"], {detached: false})
				.on('exit', function() {
					spawnCommand("grunt", ["dist"], {detached: false})
						.on('exit', function() {
							spawnCommand("grunt", ["dev"], {detached: false})
								.on('exit', done)
						});
				});
		}
	});
});

describe('nikita:app:symfony', function () {
	this.timeout(5000);
	before(function (done) {
		helpers.run(path.join(__dirname, '../app'))
			.inDir(path.join(os.tmpdir(), './temp-test'))
			.withOptions({ 'skipInstall': true })
			.withPrompt({
				template: "symfony",
				private: true,
				useBuildFolders: false,
				name: "testrun" + (new Date()).getTime()
			})
			.on('end', done);
	});

	it('creates files', function () {
		assert.file([
			'package.json',
			'Gruntfile.js',
			'grunt/aliases.js',
			'web/static/js/_main.js',
			'web/static/sass/styles.scss',
		]);
		
		if (process.env.TEMPLATE === "symfony") {
			this.timeout(5 * 60 * 1000);
			var spawnCommand = require('yeoman-generator/lib/actions/spawn_command');
			spawnCommand("npm", ["install"], {detached: false})
				.on('exit', function() {
					spawnCommand("grunt", ["dist"], {detached: false})
						.on('exit', function() {
							spawnCommand("grunt", ["dev"], {detached: false})
								.on('exit', done)
						});
				});
		}
	});
});

describe('nikita:app:wordpress', function () {
	this.timeout(5000);
	before(function (done) {
		helpers.run(path.join(__dirname, '../app'))
			.inDir(path.join(os.tmpdir(), './temp-test'))
			.withOptions({ 'skipInstall': true })
			.withPrompt({
				template: "wordpress",
				private: true,
				useBuildFolders: false,
				name: "testrun" + (new Date()).getTime()
			})
			.on('end', done);
	});

	it('creates files', function () {
		assert.file([
			'package.json',
			'Gruntfile.js',
			'grunt/aliases.js',
			'static/js/_main.js',
			'static/sass/styles.scss',
		]);

		if (process.env.TEMPLATE === "wordpress") {
			this.timeout(5 * 60 * 1000);
			var spawnCommand = require('yeoman-generator/lib/actions/spawn_command');
			spawnCommand("npm", ["install"], {detached: false})
				.on('exit', function() {
					spawnCommand("grunt", ["dist"], {detached: false})
						.on('exit', function() {
							spawnCommand("grunt", ["dev"], {detached: false})
								.on('exit', done)
						});
				});
		}
	});
});

describe('nikita:app:spring-boot', function () {
	this.timeout(5000);
	var timestamp = (new Date()).getTime();
	
	before(function (done) {
		helpers.run(path.join(__dirname, '../app'))
			.inDir(path.join(os.tmpdir(), './temp-test'))
			.withOptions({ 'skipInstall': true })
			.withPrompt({
				template: "spring-boot",
				private: true,
				javaGroupId: 'groupId',
				javaVersion: '1.8',
				springBootVersion: '1.4.2',
				name: "testrun" + timestamp
			})
			.on('end', done);
	});

	it('creates files', function (done) {
		assert.file([
			'package.json',
			'Gruntfile.js',
			'grunt/aliases.js',
			'src/main/java/groupId/testrun' + timestamp + '/Testrun' + timestamp + 'Application.java',
			'src/main/resources/static/sass/styles.scss',
			'src/main/resources/static/js/_main.js'
		]);
		
		if (process.env.TEMPLATE === "spring-boot") {
			this.timeout(5 * 60 * 1000);
			var spawnCommand = require('yeoman-generator/lib/actions/spawn_command');
			spawnCommand("npm", ["install"], {detached: false})
			.on('exit', function() {
				spawnCommand("grunt", ["dist"], {detached: false})
					.on('exit', function() {
						spawnCommand("grunt", ["dev"], {detached: false})
							.on('exit', done)
					});
			});
		}
	});
});
