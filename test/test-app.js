/*global describe, beforeEach, it*/
'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');

var defaultTimeout = 10000;
var buildTimeout = 5 * 60 * 1000;

describe('nikita:app:custom', function () {
	this.timeout(defaultTimeout);
	before(function (done) {
		helpers.run(path.join(__dirname, '../app'))
			.inDir(path.join(os.tmpdir(), './temp-test'))
			.withOptions({ 'skipInstall': true })
			.withPrompt({
				template: "web-app",
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

describe('nikita:app:web-app', function () {
	this.timeout(defaultTimeout);
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

	it('creates files', function (done) {
		assert.file([
			'package.json',
			'Gruntfile.js',
			'grunt/aliases.js',
			'source/js/_main.js',
			'source/sass/styles.scss',
		]);
		
		if (process.env.TEMPLATE === "web-app") {
			this.timeout(buildTimeout);
			var spawnCommand = require('yeoman-generator/lib/actions/spawn_command');
			spawnCommand("npm", ["install"], {detached: false})
				.on('exit', function() {
					spawnCommand("grunt", ["dist"], {detached: false})
						.on('exit', function() {
							spawnCommand("grunt", ["dev"], {detached: false})
								.on('exit', done)
						});
				});
		} else {
			done();
		}
	});
});

describe('nikita:app:web-app-react', function () {
	this.timeout(defaultTimeout);
	before(function (done) {
		helpers.run(path.join(__dirname, '../app'))
			.inDir(path.join(os.tmpdir(), './temp-test'))
			.withOptions({ 'skipInstall': true })
			.withPrompt({
				template: "web-app",
				private: true,
				useBuildFolders: true,
				jsFramework: 'react',
				name: "testrun" + (new Date()).getTime()
			})
			.on('end', done);
	});

	it('creates files', function (done) {
		assert.file([
			'package.json',
			'Gruntfile.js',
			'grunt/aliases.js',
			'source/js/_main.js',
			'source/js/App.js',
			'source/js/Store.js',
			'source/components/counter/Counter.js',
			'source/sass/styles.scss',
		]);

		if (process.env.TEMPLATE === "web-app") {
			this.timeout(buildTimeout);
			var spawnCommand = require('yeoman-generator/lib/actions/spawn_command');
			spawnCommand("npm", ["install"], {detached: false})
				.on('exit', function() {
					spawnCommand("grunt", ["dist"], {detached: false})
						.on('exit', function() {
							spawnCommand("grunt", ["dev"], {detached: false})
								.on('exit', done)
						});
				});
		} else {
			done();
		}
	});
});

describe('nikita:app:symfony', function () {
	this.timeout(defaultTimeout);
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

	it('creates files', function (done) {
		assert.file([
			'package.json',
			'Gruntfile.js',
			'grunt/aliases.js',
			'web/static/js/_main.js',
			'web/static/sass/styles.scss',
		]);
		
		if (process.env.TEMPLATE === "symfony") {
			this.timeout(buildTimeout);
			var spawnCommand = require('yeoman-generator/lib/actions/spawn_command');
			spawnCommand("npm", ["install"], {detached: false})
				.on('exit', function() {
					spawnCommand("grunt", ["dist"], {detached: false})
						.on('exit', function() {
							spawnCommand("grunt", ["dev"], {detached: false})
								.on('exit', done)
						});
				});
		} else {
			done();
		}
	});
});

describe('nikita:app:wordpress', function () {
	this.timeout(defaultTimeout);
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

	it('creates files', function (done) {
		assert.file([
			'package.json',
			'Gruntfile.js',
			'grunt/aliases.js',
			'static/js/_main.js',
			'static/sass/styles.scss',
		]);

		if (process.env.TEMPLATE === "wordpress") {
			this.timeout(buildTimeout);
			var spawnCommand = require('yeoman-generator/lib/actions/spawn_command');
			spawnCommand("npm", ["install"], {detached: false})
				.on('exit', function() {
					spawnCommand("grunt", ["dist"], {detached: false})
						.on('exit', function() {
							spawnCommand("grunt", ["dev"], {detached: false})
								.on('exit', done)
						});
				});
		} else {
			done();
		}
	});
});

describe('nikita:app:spring-boot', function () {
	this.timeout(defaultTimeout);
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
			this.timeout(buildTimeout);
			var spawnCommand = require('yeoman-generator/lib/actions/spawn_command');
			spawnCommand("npm", ["install"], {detached: false})
			.on('exit', function() {
				spawnCommand("grunt", ["dist"], {detached: false})
					.on('exit', function() {
						spawnCommand("grunt", ["dev"], {detached: false})
							.on('exit', done)
					});
			});
		} else {
			done();
		}
	});
});
