'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var compareVersions = require('compare-versions');

var NikitaGenerator = yeoman.generators.Base.extend({

	constructor: function ()
	{
		yeoman.generators.Base.apply(this, arguments);

		this.option('skip-install',
			{
				desc: 'Will skip the installation of npm packages',
				type: 'boolean'
			});
	},

	initializing: function ()
	{
		this.pkg = require('../package.json');

		var generatedVersion = this.config.get('version');
		var selfVersion = this.pkg.version;

		if (generatedVersion && selfVersion && compareVersions(selfVersion, generatedVersion) === -1) {
			this.env.error(
				chalk.red.bold('Error:') + ' Your generator-nikita is too old (Version ' + chalk.yellow(selfVersion) + ')!\n' +
				'This nikita kickstarter was generated with version ' + chalk.yellow(generatedVersion) + ', so update\n' +
				'generator-nikita to newest version with ' + chalk.green('npm install -g generator-nikita') + '.'
			);
		}

		if (selfVersion) {
			this.config.set('version', selfVersion);
		}
	},

	prompting: function ()
	{
		var that = this;
		var done = this.async();
		var version = this.pkg.version || '';

		// Have Yeoman greet the user.
		this.log(yosay(
			'Welcome to the Nikita Project Generator '+version+'!'
		));
		
		var promptInput = function (name, question, defaultValue)
		{
			return {
				type: 'input',
				name: name,
				message: question,
				default: that.config.get(name, defaultValue),
				validate: function(value) {
					if (value && value.length > 0) {
						return true;
					}
					
					return "Error! Please provide: " + name;
				}
			};
		};
		
		var promptConfirm = function (name, question, defaultValue)
		{
			return {
				type: 'confirm',
				name: name,
				message: question,
				default: that.config.get(name, defaultValue)
			};
		};
		
		var promptCheckbox = function(name, question, choices, defaultChoices)
		{
			return {
				type: 'checkbox',
				name: name,
				message: question,
				choices: choices,
				default: that.config.get(name, defaultChoices || choices)
			};
		};
		
		var promptList = function(name, question, choices, defaultChoices)
		{
			return {
				type: 'list',
				name: name,
				message: question,
				choices: choices,
				default: that.config.get(name, defaultChoices || choices)
			};
		};

		if (that.config.get('template') === 'slim' || that.config.get('template') === 'default') {
			that.config.set('template', 'web-app');
		}

		var templatePrompts = [
			promptInput('name', 'Your project name', this.appname),
			promptConfirm('private', 'Is this project private?', true),
			promptList('template', 'Which configuration template do you want to use?', [
				{
					name: 'Web-App setup',
					value: 'web-app'
				},
				{
					name: 'Symfony setup',
					value: 'symfony'
				},
				{
					name: 'Wordpress setup',
					value: 'wordpress'
				},
				{
					name: 'Spring Boot setup',
					value: 'spring-boot'
				},
			]),
			promptConfirm('custom', 'Customize this template?', false),
		];
		
		var handleSetup = function() {
			var prompts = [];
			
			if (that.config.get('askBuildFolders')) {
				prompts.push(promptConfirm('useBuildFolders', 'Do you want to use source+build+dist folders or one custom source folder?', that.config.get('useBuildFolders', true)));
			}
			that.prompt(prompts, function (props) {
				for (var key in props) {
					if (props.hasOwnProperty(key)) {
						that.config.set(key, props[key]);
					}
				}

				if (!that.config.get('svgBackgrounds') && that.config.get('formFramework'))
				{
					console.info('You need the SVG backgrounds feature to enable the nikita form framework. Activating this option now.');
					that.config.set('svgBackgrounds', true);
				}

				var hasExtend = function (extend) {
					return that.config.get('nikitaCssExtends') && that.config.get('nikitaCssExtends').indexOf(extend) !== -1 ? true : false;
				}

				if ((!hasExtend('a11y') || !hasExtend('cf') || !hasExtend('ellipsis')) && that.config.get('formFramework'))
				{
					console.info('You need the nikita.css mixins to enable the nikita form framework. Activating this option now.');
					that.config.set('nikitaCssExtends', ['a11y', 'cf', 'ellipsis', 'hide-text', 'ib']);
				}

				var hasMixin = function (mixin) {
					return that.config.get('nikitaCssMixins') && that.config.get('nikitaCssMixins').indexOf(mixin) !== -1 ? true : false;
				}

				if ((!hasMixin('respond-to')) && that.config.get('formFramework'))
				{
					console.info('You need the nikita.css mixins to enable the nikita form framework. Activating this option now.');
					that.config.set('nikitaCssMixins', ['centering', 'fixed-ratiobox', 'font-smoothing', 'layering', 'respond-to', 'triangle']);
				}

				if (!that.config.get('useBuildFolders'))
				{
					that.config.set('cleanBuildFolders', false);

					that.prompt(promptInput('sourceFolder', 'Which source folder do you want to use?', 'source'), function(props)
					{
						for (var key in props)
						{
							if (props.hasOwnProperty(key))
							{
								that.config.set(key, props[key]);
							}
						}
						
						/* remove trailing slash */
						that.config.set('sourceFolder', (that.config.get('sourceFolder') || "").replace(/\/$/, ""));
						done();
					});
				}
				else
				{
					that.config.set('cleanBuildFolders', true);
					done();
				}
			});
		};

		that.prompt(templatePrompts, function (props)
		{
			var isInitialRun = !that.config.get('template');
			var templateSpecificPrompts = [];

			for (var key in props)
			{
				if (props.hasOwnProperty(key))
				{
					that.config.set(key, props[key]);
				}
			}

			/* set defaults on first run only */
			if (isInitialRun)
			{
				that.config.set('features', [
					'webfonts',
					'svgBackgrounds',
					'gitinfos',
					'preCommitHook'
				]);
				that.config.set('addons', [
				]);
				that.config.set('nikitaCssMixins', [
					'respond-to'
				]);

				that.config.set('nikitaCssExtends', [
					'cf'
				]);

				that.config.set('formFramework', false);
				that.config.set('askBuildFolders', true);

				if (that.config.get('template') === 'wordpress') {
					that.config.set('addons', [
						'jQuery'
					]);
				}
			}

			if (that.config.get('template') === 'spring-boot') {
				templateSpecificPrompts.push(promptInput('javaGroupId', 'java groupId'));
				templateSpecificPrompts.push(promptInput('javaVersion', 'java version', '1.8'));
				templateSpecificPrompts.push(promptInput('springBootVersion', 'spring boot version', '1.4.2'));
				that.config.set('sourceFolder', 'src/main/resources/static');
				that.config.set('useBuildFolders', false);
				that.config.set('askBuildFolders', false);
			}
			else if (that.config.get('template') === 'symfony') {
				that.config.set('sourceFolder', 'web/static');
				that.config.set('useBuildFolders', false);
				that.config.set('askBuildFolders', false);
			}
			else if (that.config.get('template') === 'wordpress') {
				that.config.set('sourceFolder', 'static');
				that.config.set('useBuildFolders', false);
				that.config.set('askBuildFolders', false);
			}

			if (that.config.get('custom')) {
				[
					promptCheckbox('features', 'Which features do you want to use?', [
						{
							name: 'Self hosted webfonts, a fonts-folder will be added to your project',
							value: 'webfonts'
						}, {
							name: 'Browser Reset Styles, a _reset.scss will be added to your project',
							value: 'browserReset'
						}, {
							name: 'Use background SVG files as base64 encoded dataURIs with placeholder extends',
							value: 'svgBackgrounds'
						}, {
							name: 'Add Gitinfos to your distribution-task (grunt-gitinfos)',
							value: 'gitinfos'
						}, {
							name: 'Add a git pre-commit hook to lint your code automatically',
							value: 'preCommitHook'
						}
					]),
					promptList('jsFramework', 'Which JavaScript Framework do you want to use?', [
						{
							name: 'JSB, BehaviourToolkit featuring module initializing and event bus',
							value: 'jsb'
						}, {
							name: 'React.js, the famous view framework with addons like react-router and react-waterfall',
							value: 'react'
						}
					]),
					promptCheckbox('nikitaCssMixins', 'Which nikita.css mixins do you want to use?', [
						{
							name: 'Centering: Horizontally and/or vertically centering elements with the translate-method (IE9+)',
							value: 'centering'
						}, {
							name: 'Fixed-Ratiobox: Use intrinsic ratio to force child elements like images, videos or frames to fluidly scale at a given ratio',
							value: 'fixed-ratiobox'
						}, {
							name: 'Font-Smoothing: Turn font-smoothing on/off for a better font-rendering on OS X',
							value: 'font-smoothing'
						}, {
							name: 'Layering: A function for managing z-index layers within a Sass map',
							value: 'layering'
						}, {
							name: 'Respond-To: Easy managing your media queries',
							value: 'respond-to'
						}, {
							name: 'Triangle: Easy generating arrow-like triangles with the border-method',
							value: 'triangle'
						}
					]),
					promptCheckbox('nikitaCssExtends', 'Which nikita.css extends do you want to use?', [
						{
							name: 'a11y: Hide elements in sake of accessibility',
							value: 'a11y'
						}, {
							name: 'cf: Micro clearfix',
							value: 'cf'
						}, {
							name: 'ellipsis: Ellipsis to point out text',
							value: 'ellipsis'
						}, {
							name: 'hide-text: Hide text on elements in sake of accessibility',
							value: 'hide-text'
						}, {
							name: 'ib: Use the inline-block method as an alternative to float elements',
							value: 'ib'
						}
					]),
					promptCheckbox('addons', 'Which JS modules do you want to use?', [
						{
							name: 'jQuery library',
							value: 'jQuery'
						},
						{
							name: 'iDangerous Swiper for sliders',
							value: 'slider'
						},
						{
							name: 'select2 for styled select inputs',
							value: 'selectTwo'
						}
					]),
					promptConfirm('formFramework', 'Do you want to use the nikita form framework?'),
				].forEach(function (prompt) {
					templateSpecificPrompts.push(prompt);
				});
			}
			
			if (templateSpecificPrompts.length > 0) {
				that.prompt(templateSpecificPrompts, function (props)
				{
					for (var key in props)
					{
						if (props.hasOwnProperty(key))
						{
							that.config.set(key, props[key]);
						}
					}

					handleSetup();
				});
			} else {
				handleSetup();
			}
		});
	},
	
	writing: {
		app: function ()
		{
			var packageJsonData = this.src.readJSON('_package.json');

			packageJsonData['name'] = this.config.get('name');
			packageJsonData['private'] = this.config.get('private');

			var isReact = (this.config.get('jsFramework') === 'react');

			// Standard Files & Folders
			this.template('.gitignore.ejs', '.gitignore');
			this.template('Gruntfile.js.ejs', 'Gruntfile.js');
			this.template('NIKITA-LICENSE.md.ejs', 'NIKITA-LICENSE.md');
			this.template('NIKITA-README.md.ejs', 'NIKITA-README.md');

			// grunt Config Files
			this.dest.mkdir('grunt');
			this.dest.mkdir('grunt/config');
			this.dest.mkdir('grunt/tasks');

			this.template('grunt/aliases.js.ejs', 'grunt/aliases.js');
			this.template('grunt/tasks/sass-globbing.js.ejs', 'grunt/tasks/sass-globbing.js');
			this.template('grunt/tasks/jest.js.ejs', 'grunt/tasks/jest.js');

			this.template('grunt/config/accessibility.js.ejs', 'grunt/config/accessibility.js');
			this.template('grunt/config/browserSync.js.ejs', 'grunt/config/browserSync.js');
			this.template('grunt/config/clean.js.ejs', 'grunt/config/clean.js');
			this.template('grunt/config/concurrent.js.ejs', 'grunt/config/concurrent.js');
			this.template('grunt/config/copy.js.ejs', 'grunt/config/copy.js');
			this.template('grunt/config/eslint.js.ejs', 'grunt/config/eslint.js');
			this.template('grunt/config/htmlhint.js.ejs', 'grunt/config/htmlhint.js');
			this.template('grunt/config/imagemin.js.ejs', 'grunt/config/imagemin.js');
			this.template('grunt/config/jest.js.ejs', 'grunt/config/jest.js');
			this.template('grunt/config/postcss.js.ejs', 'grunt/config/postcss.js');
			this.template('grunt/config/prettify.js.ejs', 'grunt/config/prettify.js');
			this.template('grunt/config/sass.js.ejs', 'grunt/config/sass.js');
			this.template('grunt/config/sass-globbing.js.ejs', 'grunt/config/sass-globbing.js');
			this.template('grunt/config/stylelint.js.ejs', 'grunt/config/stylelint.js');
			this.template('grunt/config/svgmin.js.ejs', 'grunt/config/svgmin.js');
			this.template('grunt/config/sync.js.ejs', 'grunt/config/sync.js');
			this.template('grunt/config/uglify.js.ejs', 'grunt/config/uglify.js');
			this.template('grunt/config/watch.js.ejs', 'grunt/config/watch.js');
			this.template('grunt/config/webpack.js.ejs', 'grunt/config/webpack.js');

			// Source Folder
			var sourceFolder = 'source';

			if (!this.config.get('useBuildFolders'))
			{
				sourceFolder = this.config.get('sourceFolder');
			}

			//Test Files
			this.dest.mkdir(sourceFolder + '/tests');
			if (isReact) {
				this.template('source/tests-react/jest.setup.js.ejs', sourceFolder + '/tests/jest.setup.js');
				this.template('source/tests-react/jest.transform.js.ejs', sourceFolder + '/tests/jest.transform.js');
				this.template('source/tests-react/App.test.js.ejs', sourceFolder + '/tests/App.test.js');
			} else {
				this.template('source/tests-jsb/jest.setup.js.ejs', sourceFolder + '/tests/jest.setup.js');
				this.template('source/tests-jsb/jest.transform.js.ejs', sourceFolder + '/tests/jest.transform.js');
				this.template('source/tests-jsb/jest.transform-ejs.js.ejs', sourceFolder + '/tests/jest.transform-ejs.js');
				this.template('source/tests-jsb/App.test.js.ejs', sourceFolder + '/tests/App.test.js');
			}

			// Basic Project Folders
			this.dest.mkdir(sourceFolder + '/img');
			this.dest.mkdir(sourceFolder + '/img/bgs');
			this.dest.mkdir(sourceFolder + '/sass/mixins');
			this.directory('source/img/appicons', sourceFolder + '/img/appicons');

			// SASS Basic Files
			this.template('source/sass/styles.scss.ejs', sourceFolder + '/sass/styles.scss');
			this.template('source/sass/_basics.scss.ejs', sourceFolder + '/sass/_basics.scss');

			// SASS Extra Files
			this.template('source/sass/blocks/_header.scss.ejs', sourceFolder + '/sass/blocks/_header.scss');
			this.template('source/sass/blocks/_footer.scss.ejs', sourceFolder + '/sass/blocks/_footer.scss');
			this.template('source/sass/extends/.gitkeep', sourceFolder + '/sass/extends/.gitkeep');
			this.template('source/sass/extends/_buttons.scss.ejs', sourceFolder + '/sass/extends/_buttons.scss');

			// SASS Variables
			this.template('source/sass/variables/_color.scss.ejs', sourceFolder + '/sass/variables/_color.scss');
			this.template('source/sass/variables/_timing.scss.ejs', sourceFolder + '/sass/variables/_timing.scss');
			this.template('source/sass/variables/_typography.scss.ejs', sourceFolder + '/sass/variables/_typography.scss');

			// JS Files
			if (isReact) {
				this.template('source/js-react/_main.js.ejs', sourceFolder + '/js/_main.js');
				this.template('source/js-react/App.js.ejs', sourceFolder + '/js/App.js');
				this.template('source/js-react/Store.js.ejs', sourceFolder + '/js/Store.js');
			} else {
				this.template('source/js-jsb/_main.js.ejs', sourceFolder + '/js/_main.js');
				this.template('source/js-jsb/app.js.ejs', sourceFolder + '/js/app.js');
			}

			// Sample Component Files
			if (isReact) {
				this.template('source/components-react/sample/Sample.js.ejs', sourceFolder + '/components/sample/Sample.js');
				this.template('source/components-react/sample/Sample.test.js.ejs', sourceFolder + '/components/sample/Sample.test.js');
				this.template('source/components-react/sample/_sample.scss.ejs', sourceFolder + '/components/sample/_sample.scss');
				this.template('source/components-react/counter/Counter.js.ejs', sourceFolder + '/components/counter/Counter.js');
				this.template('source/components-react/counter/Counter.test.js.ejs', sourceFolder + '/components/counter/Counter.test.js');
				this.template('source/components-react/counter/_counter.scss.ejs', sourceFolder + '/components/counter/_counter.scss');
            } else {
				this.template('source/components-jsb/sample/Sample.jsb.js.ejs', sourceFolder + '/components/sample/Sample.jsb.js');
				this.template('source/components-jsb/sample/SampleTemplate.ejs.ejs', sourceFolder + '/components/sample/SampleTemplate.ejs');
				this.template('source/components-jsb/sample/Sample.jsb.test.js.ejs', sourceFolder + '/components/sample/Sample.jsb.test.js');
				this.template('source/components-jsb/sample/_sample.scss.ejs', sourceFolder + '/components/sample/_sample.scss');
			}

			// twigRender
			this.template('grunt/config/twigRender.js.ejs', 'grunt/config/twigRender.js');
			this.template('source/html/README.md.ejs', sourceFolder + '/html/README.md');
			this.template('source/html/data/.gitkeep', sourceFolder + '/html/data/.gitkeep');
			this.template('source/html/layouts/master.twig.ejs', sourceFolder + '/html/layouts/master.twig');
			this.template('source/html/macros/.gitkeep', sourceFolder + '/html/macros/.gitkeep');
			this.template('source/html/pages/index.twig.ejs', sourceFolder + '/html/pages/index.twig');
			this.template('source/html/partials/header.twig.ejs', sourceFolder + '/html/partials/header.twig');
			this.template('source/html/partials/footer.twig.ejs', sourceFolder + '/html/partials/footer.twig');
			if (!isReact) {
				this.template('source/components-jsb/sample/sample.twig.ejs', sourceFolder + '/components/sample/sample.twig');
			}

			// Image README Files
			this.template('source/img/bgs/README.md.ejs', sourceFolder + '/img/bgs/README.md');
			this.template('source/img/dev/README.md.ejs', sourceFolder + '/img/dev/README.md');
			this.template('source/img/temp/README.md.ejs', sourceFolder + '/img/temp/README.md');

			// Optional Browser Reset SASS-Partial
			if (this.config.get('features').indexOf('browserReset') !== -1)
			{
				this.template('source/sass/_reset.scss.ejs', sourceFolder + '/sass/_reset.scss');
			}

			// Optional Webfonts folder and SASS-Partial
			if (this.config.get('features').indexOf('webfonts') !== -1)
			{
				this.directory('source/fonts', sourceFolder + '/fonts');
				this.template('source/sass/_webfonts.scss.ejs', sourceFolder + '/sass/_webfonts.scss');
			}

			// Optional SVG Backgrounds
			if (this.config.get('features').indexOf('svgBackgrounds') !== -1)
			{
				this.template('grunt/config/string-replace.js.ejs', 'grunt/config/string-replace.js');
				this.template('grunt/config/svgcss.js.ejs', 'grunt/config/svgcss.js');
				this.template('source/sass/mixins/_svg-background.scss.ejs', sourceFolder + '/sass/mixins/_svg-background.scss');
			}
			else
			{
				delete packageJsonData['devDependencies']['grunt-svg-css'];
				delete packageJsonData['devDependencies']['grunt-string-replace'];
			}

			// Optional Gitinfos
			if (this.config.get('features').indexOf('gitinfos') === -1)
			{
				delete packageJsonData['devDependencies']['grunt-gitinfos'];
			}
			else
			{
				this.template('grunt/config/gitinfo.js.ejs', 'grunt/config/gitinfo.js');
				this.template('grunt/tasks/write-gitinfos.js.ejs', 'grunt/tasks/write-gitinfos.js');
				this.template('source/html/partials/gitinfos.twig.ejs', sourceFolder + '/html/partials/gitinfos.twig');
			}

			// Optional pre-commit hook
			if (this.config.get('features').indexOf('preCommitHook') === -1)
			{
				delete packageJsonData['devDependencies']['pre-commit'];
				delete packageJsonData['pre-commit'];
				delete packageJsonData['pre-commit.silent'];
			}

			// Optional Layering-Mixin
			if (this.config.get('nikitaCssMixins').indexOf('layering') !== -1)
			{
				this.template('source/sass/variables/_z-layers.scss.ejs', sourceFolder + '/sass/variables/_z-layers.scss');
			}

			// Optional Respond-To-Mixin
			if (this.config.get('nikitaCssMixins').indexOf('respond-to') !== -1)
			{
				this.template('source/sass/variables/_breakpoints.scss.ejs', sourceFolder + '/sass/variables/_breakpoints.scss');
			}

			// Optional Form Framework
			if (this.config.get('formFramework'))
			{
				this.template('source/html/pages/forms.twig.ejs', sourceFolder + '/html/pages/forms.twig');
				this.template('source/sass/blocks/_forms.scss.ejs', sourceFolder + '/sass/blocks/_forms.scss');
				this.src.copy('source/img/bgs/form-select-arrow-down.svg', sourceFolder + '/img/bgs/form-select-arrow-down.svg');
			}

			// jsFramework
			if (isReact) {
				this.config.set('addons', []);

				delete packageJsonData['devDependencies']['node-jsb'];
				delete packageJsonData['devDependencies']['ejs-compiled-loader'];
			} else {
				delete packageJsonData['devDependencies']['babel-eslint'];
				delete packageJsonData['devDependencies']['babel-preset-react'];
				delete packageJsonData['devDependencies']['classnames'];
				delete packageJsonData['devDependencies']['enzyme'];
				delete packageJsonData['devDependencies']['enzyme-adapter-react-16.3'];
				delete packageJsonData['devDependencies']['eslint-plugin-react'];
				delete packageJsonData['devDependencies']['prop-types'];
				delete packageJsonData['devDependencies']['react'];
				delete packageJsonData['devDependencies']['react-dom'];
				delete packageJsonData['devDependencies']['react-router-dom'];
				delete packageJsonData['devDependencies']['react-waterfall'];
			}

			// Optional jQuery
			if ((this.config.get('addons').indexOf('jQuery') === -1) && (this.config.get('addons').indexOf('selectTwo') === -1))
			{
				delete packageJsonData['devDependencies']['jquery'];
			}

			// Optional Slider
			if (this.config.get('addons').indexOf('slider') === -1)
			{
				delete packageJsonData['devDependencies']['swiper'];
			}
			else
			{
				this.template('source/html/partials/slider.twig.ejs', sourceFolder + '/html/partials/slider.twig');
				this.template('source/js/Slider.jsb.js.ejs', sourceFolder + '/js/Slider.jsb.js');
				this.template('source/sass/blocks/_slider.scss.ejs', sourceFolder + '/sass/blocks/_slider.scss');
			}

			// Optional Select2
			if (this.config.get('addons').indexOf('selectTwo') === -1)
			{
				delete packageJsonData['devDependencies']['select2'];
			}
			else
			{
				this.template('source/js/SelectTwo.jsb.js.ejs', sourceFolder + '/js/SelectTwo.jsb.js');
			}
			
			if (this.config.get('template') === 'spring-boot') {
				var javaName = this.config.get("name").replace(/-/g, " ").toLowerCase().replace(/\b[a-z]/g, function(letter) {
					return letter.toUpperCase();
				}).replace(/ /g, "");
				this.config.set('javaName', javaName);
				var javaNameWithLowercaseFirstLetter = javaName.substr(0, 1).toLowerCase() + javaName.substr(1);
				this.config.set('javaNameWithLowercaseFirstLetter', javaNameWithLowercaseFirstLetter);
				var springRootJavaFolder = "src/main/java/" + this.config.get('javaGroupId').replace(/\./g, "/") + "/" + javaNameWithLowercaseFirstLetter;

				this.template('spring-boot/pom.xml.ejs', 'pom.xml');
				this.dest.mkdir(springRootJavaFolder);
				this.template('spring-boot/Application.java.ejs', springRootJavaFolder + "/" + this.config.get("javaName") + "Application.java");
			}
			
			this.dest.write('package.json', JSON.stringify(packageJsonData, null, 4));
		},
		
		projectfiles: function ()
		{
		}
	},
	
	end: function ()
	{
		if (this.options['skip-install']) {
			this.log('\nRun ' +
			chalk.yellow.bold('npm install') +
			' to install your frontend dependencies.\n');
			return;
		}

		this.npmInstall();
	}
});

module.exports = NikitaGenerator;
