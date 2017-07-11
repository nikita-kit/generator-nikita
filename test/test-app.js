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
			'source/sass/styles.scss',
			'source/assemble/pages/index.hbs'
		]);
	});
});

describe('nikita:app:slim', function () {
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
			'source/sass/styles.scss'
		]);
	});
});

describe('nikita:app:default', function () {
	this.timeout(5000);
	before(function (done) {
		helpers.run(path.join(__dirname, '../app'))
			.inDir(path.join(os.tmpdir(), './temp-test'))
			.withOptions({ 'skipInstall': true })
			.withPrompt({
				template: "default",
				private: true,
				useBuildFolders: true,
				name: "testrun" + (new Date()).getTime()
			})
			.on('end', done);
	});

	it('creates files', function () {
		assert.file([
			'package.json',
			'source/sass/styles.scss'
		]);
	});
});

describe('nikita:app:slim-no-build-folder', function () {
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
			'src/App/Resources/public/sass/styles.scss'
		]);
	});
});
