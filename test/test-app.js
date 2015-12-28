/*global describe, beforeEach, it*/
'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');

describe('nikita:app:custom-libsass', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../app'))
      .inDir(path.join(os.tmpdir(), './temp-test'))
      .withOptions({ 'skipInstall': true })
      .withPrompt({
		template: "custom",
        sassCompiler: "libsass",
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
      'bower.json',
      'package.json',
      'source/sass/styles.scss'
    ]);
  });
});

describe('nikita:app:custom-compass', function () {
	before(function (done) {
		helpers.run(path.join(__dirname, '../app'))
			.inDir(path.join(os.tmpdir(), './temp-test'))
			.withOptions({ 'skipInstall': true })
			.withPrompt({
				template: "custom",
				sassCompiler: "compass",
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
			'bower.json',
			'package.json',
			'source/sass/styles.scss'
		]);
	});
});

describe('nikita:app:slim', function () {
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
			'bower.json',
			'package.json',
			'source/sass/styles.scss'
		]);
	});
});

describe('nikita:app:default', function () {
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
			'bower.json',
			'package.json',
			'source/sass/styles.scss'
		]);
	});
});
