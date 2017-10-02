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
				template: "custom",
				staticPageGenerator: "twigRender",
				private: true,
				name: "testrun" + (new Date()).getTime(),
				nikitaCssMixins: [],
				useBuildFolders: true,
				nikitaCssExtends: [],
				features: []
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
				template: "custom",
				staticPageGenerator: "assemble",
				private: true,
				name: "testrun" + (new Date()).getTime(),
				nikitaCssMixins: [],
				useBuildFolders: true,
				nikitaCssExtends: [],
				features: []
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
				template: "slim",
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
	});
});

describe('nikita:app:web-app-no-build-folder', function () {
	this.timeout(5000);
	before(function (done) {
		helpers.run(path.join(__dirname, '../app'))
			.inDir(path.join(os.tmpdir(), './temp-test'))
			.withOptions({ 'skipInstall': true })
			.withPrompt({
				template: "slim",
				private: true,
				useBuildFolders: false,
				sourceFolder: "src/App/Resources/public",
				name: "testrun" + (new Date()).getTime()
			})
			.on('end', done);
	});

	it('creates files', function () {
		assert.file([
			'package.json',
			'Gruntfile.js',
			'grunt/aliases.js',
			'src/App/Resources/public/js/_main.js',
			'src/App/Resources/public/sass/styles.scss',
		]);
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

	it('creates files', function () {
		assert.file([
			'package.json',
			'Gruntfile.js',
			'grunt/aliases.js',
			'src/main/java/groupId/testrun' + timestamp + '/Testrun' + timestamp + 'Application.java',
			'src/main/resources/static/sass/styles.scss',
			'src/main/resources/static/js/_main.js'
		]);
	});
});
