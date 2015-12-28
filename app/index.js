'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');

var NikitaGenerator = yeoman.generators.Base.extend({

	constructor: function ()
	{
		yeoman.generators.Base.apply(this, arguments);

		this.option('skip-install',
			{
				desc: 'Will skip the installation of npm and bower packages',
				type: 'boolean'
			});
	},

	initializing: function ()
	{
		this.pkg = require('../package.json');
	},
	
	prompting: function ()
	{
		var that = this;
		
		var done = this.async();
		
		// Have Yeoman greet the user.
		this.log(yosay(
			'Welcome to the Nikita Project Generator!'
		));
		
		var promptInput = function (name, question, defaultValue)
		{
			return {
				type: 'input',
				name: name,
				message: question,
				default: that.config.get(name, defaultValue)
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

		var templatePrompts = [
			promptInput('name', 'Your project name', this.appname),
			promptConfirm('private', 'Is this project private?', true),
			promptList('template', 'Which configuration template do you want to use?', [
				{
					name: 'Default setup',
					value: 'default'
				},
				{
					name: 'Slim setup',
					value: 'slim'
				},
				{
					name: 'Build a completely custom version on your own',
					value: 'custom'
				}
			])
		];
		
		var handleSetup = function() {
			that.prompt([
				promptConfirm('useBuildFolders', 'Do you want to use "build/source and dist" folder?', that.config.get('useBuildFolders', true))
			], function (props) {
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
						that.config.set('requirejsPathToBowerComponents', (Array(2 + that.config.get('sourceFolder').split("/", -1).length).join("../")) + 'bower_components/');

						done();
					});
				}
				else
				{
					that.config.set('cleanBuildFolders', true);
					that.config.set('requirejsPathToBowerComponents', '../../bower_components/');
					done();
				}
			});
		};

		that.prompt(templatePrompts, function (props)
		{
			for (var key in props)
			{
				if (props.hasOwnProperty(key))
				{
					that.config.set(key, props[key]);
				}
			}

			if (that.config.get('template') == 'default')
			{
				that.config.set('sassCompiler', 'libSass');
				that.config.set('features', [
					'webfonts',
					'browserReset',
					'svgBackgrounds',
					'svgSprite',
					'universalCss',
					'gitinfos'
				]);
				that.config.set('nikitaCssMixins', [
					'centering',
					'fixed-ratiobox',
					'font-smoothing',
					'layering',
					'respond-to',
					'triangle'
				]);

				that.config.set('nikitaCssExtends', [
					'a11y',
					'cf',
					'ellipsis',
					'hide-text',
					'ib'
				]);

				that.config.set('formFramework', true);
				that.config.set('useBuildFolders', true);

				handleSetup();
			}
			else if (that.config.get('template') == 'slim')
			{
				that.config.set('sassCompiler', 'libSass');
				that.config.set('features', [
					'webfonts',
					'svgBackgrounds',
					'gitinfos'
				]);
				that.config.set('nikitaCssMixins', [
					'respond-to'
				]);

				that.config.set('nikitaCssExtends', [
					'cf'
				]);

				that.config.set('formFramework', false);
				that.config.set('useBuildFolders', true);

				handleSetup();
			}
			else if (that.config.get('template') == 'custom')
			{
				var prompts = [
					promptList('sassCompiler', 'Which Sass Compiler do you want to use?', [
						{
							name: 'libSass, lightning fast but not all Sass features',
							value: 'libSass'
						}, {
							name: 'Compass + Sass, slower but with all latest Sass features, based on Ruby',
							value: 'compass'
						}
					]),
					promptCheckbox('features', 'Which features do you want to use?', [
						{
							name: 'Self hosted webfonts, a fonts-folder will be added to your project',
							value: 'webfonts'
						}, {
							name: 'Browser Reset Styles, a _reset.scss will be added to your project',
							value: 'browserReset'
						}, {
							name: 'Use background SVG files as base64 encoded dataURIs with placeholder extends (grunt-grunticon + grunt-string-replace + svg-background-mixin)',
							value: 'svgBackgrounds'
						}, {
							name: 'Use SVG Sprite to include icons with svg\'s <use> tag',
							value: 'svgSprite'
						}, {
							name: 'Split your main CSS-file into several small ones to support IE9 and lower (grunt-csssplit)',
							value: 'cssSplit'
						}, {
							name: 'Create a CSS Styleguide (grunt-styleguide)',
							value: 'cssStyleGuide'
						}, {
							name: 'Create a JS Documentation (grunt-jsdoc)',
							value: 'jsDoc'
						}, {
							name: 'Measure Pagespeed (grunt-pagespeed)',
							value: 'measurePagespeed'
						}, {
							name: 'Measure Frontend-Performance (grunt-phantomas)',
							value: 'measurePerformance'
						}, {
							name: 'Take screenshots to diff your changes (grunt-photobox)',
							value: 'takeScreenshots'
                        }, {
							name: "Add a universal css as fallback for old browsers",
							value: "universalCss"
						}, {
							name: 'Use local grunt and bower binaries',
							value: 'useLocalGruntAndBower'
						}, {
							name: 'Add Gitinfos to your distribution-task (grunt-gitinfos)',
							value: 'gitinfos'
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
					promptConfirm('formFramework', 'Do you want to use the nikita form framework?', true),
				];

				that.prompt(prompts, function (props)
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
			}
		});
	},
	
	writing: {
		app: function ()
		{
			var packageJsonData = this.src.readJSON('_package.json');
			var bowerJsonData = this.src.readJSON('_bower.json');
			
			packageJsonData['name'] = this.config.get('name');
			bowerJsonData['name'] = this.config.get('name');
			
			packageJsonData['private'] = this.config.get('private');
			
			// Standard Files & Folders
			this.template('.gitignore.ejs', '.gitignore');
			this.template('.scss-lint.yml.ejs', '.scss-lint.yml');
			this.template('Gemfile.ejs', 'Gemfile');
			this.template('Gruntfile.js.ejs', 'Gruntfile.js');
			this.template('NIKITA-LICENSE.md.ejs', 'NIKITA-LICENSE.md');
			this.template('README.md.ejs', 'README.md');
			this.template('setup-dev-env.sh.ejs', 'setup-dev-env.sh');

			var sourceFolder = 'source';

			if (!this.config.get('useBuildFolders'))
			{
				sourceFolder = this.config.get('sourceFolder');
			}
			
			// Basic Project Folders
			this.dest.mkdir(sourceFolder + '/img');
			this.dest.mkdir(sourceFolder + '/img/bgs');
			this.dest.mkdir(sourceFolder + '/img/icons');
			this.dest.mkdir(sourceFolder + '/sass/mixins');
			this.directory('source/img/appicons', sourceFolder + '/img/appicons');
			
			// SASS Basic Files
			this.template('source/sass/styles.scss.ejs', sourceFolder + '/sass/styles.scss');

			if (this.config.get('features').indexOf('universalCss') !== -1)
			{
				this.template('source/sass/universal.scss.ejs', sourceFolder + '/sass/universal.scss');
			}

			this.template('source/sass/_basics.scss.ejs', sourceFolder + '/sass/_basics.scss');
			
			// SASS Extra Files
			this.template('source/sass/blocks/_rwd-testing.scss.ejs', sourceFolder + '/sass/blocks/_rwd-testing.scss');
			this.template('source/sass/extends/.gitkeep', sourceFolder + '/sass/extends/.gitkeep');
			this.template('source/sass/extends/_buttons.scss.ejs', sourceFolder + '/sass/extends/_buttons.scss');
			
			// SASS Variables
			this.template('source/sass/variables/_color.scss.ejs', sourceFolder + '/sass/variables/_color.scss');
			this.template('source/sass/variables/_timing.scss.ejs', sourceFolder + '/sass/variables/_timing.scss');
			this.template('source/sass/variables/_typography.scss.ejs', sourceFolder + '/sass/variables/_typography.scss');
			
			// JS Files
			this.template('source/js/_requireconfig.js.ejs', sourceFolder + '/js/_requireconfig.js');
			this.template('source/js/app.js.ejs', sourceFolder + '/js/app.js');
			this.template('source/js/modernizr/cssCheckedTest.js.ejs', sourceFolder + '/js/modernizr/cssCheckedTest.js');
			this.template('source/js/modernizr/positionStickyTest.js.ejs', sourceFolder + '/js/modernizr/positionStickyTest.js');
			
			// Assemble Files
			this.template('source/assemble/pages/index.hbs.ejs', sourceFolder + '/assemble/pages/index.hbs');
			this.template('source/assemble/pages/rwd-testing.hbs.ejs', sourceFolder + '/assemble/pages/rwd-testing.hbs');
			this.template('source/assemble/layouts/lyt-default.hbs.ejs', sourceFolder + '/assemble/layouts/lyt-default.hbs');
			
			// Assemble Folders
			this.directory('source/assemble/data', sourceFolder + '/assemble/data');
			this.directory('source/assemble/helpers', sourceFolder + '/assemble/helpers');
			this.template('source/assemble/partials/.gitkeep', sourceFolder + '/assemble/partials/.gitkeep');

			// Image README Files
			this.template('source/img/bgs/README.md.ejs', sourceFolder + '/img/bgs/README.md');
			this.template('source/img/dev/README.md.ejs', sourceFolder + '/img/dev/README.md');
			this.template('source/img/temp/README.md.ejs', sourceFolder + '/img/temp/README.md');

			if (this.config.get('features').indexOf('useLocalGruntAndBower') == -1)
			{
				delete packageJsonData['devDependencies']['grunt-cli'];
				delete packageJsonData['devDependencies']['bower'];
			}

			// Libsass
			if (this.config.get('sassCompiler').indexOf('libSass') == -1)
			{
				delete packageJsonData['devDependencies']['grunt-sass'];
			}
			
			// Compass
			if (this.config.get('sassCompiler').indexOf('compass') == -1)
			{
				delete packageJsonData['devDependencies']['grunt-contrib-compass'];
			}
			
			// Optional Browser Reset SASS-Partial
			if (this.config.get('features').indexOf('browserReset') != -1)
			{
				this.template('source/sass/_reset.scss.ejs', sourceFolder + '/sass/_reset.scss');
			}
			
			// Optional Webfonts folder and SASS-Partial
			if (this.config.get('features').indexOf('webfonts') != -1)
			{
				this.directory('source/fonts', sourceFolder + '/fonts');
				this.template('source/sass/_webfonts.scss.ejs', sourceFolder + '/sass/_webfonts.scss');
			}
			
			// Optional SVG Backgrounds
			if (this.config.get('features').indexOf('svgBackgrounds') != -1)
			{
				this.template('source/sass/mixins/_svg-background.scss.ejs', sourceFolder + '/sass/mixins/_svg-background.scss');
			}
			else
			{
				delete packageJsonData['devDependencies']['grunt-svg-css'];
				delete packageJsonData['devDependencies']['grunt-string-replace'];
			}

			// Optional SVG Sprite
			if (this.config.get('features').indexOf('svgSprite') == -1)
			{
				delete packageJsonData['devDependencies']['grunt-svgstore'];
			}
			else
			{
				this.template('source/img/icons/README.md.ejs', sourceFolder + '/img/icons/README.md');
			}

			// Optional CSS Splitting for IE9 and lower
			if (this.config.get('features').indexOf('cssSplit') == -1)
			{
				delete packageJsonData['devDependencies']['grunt-csssplit'];
			}
			
			// Optional CSS Styleguide
			if (this.config.get('features').indexOf('cssStyleGuide') == -1)
			{
				delete packageJsonData['devDependencies']['grunt-styleguide'];
			}
			else
			{
				this.template('source/sass/blocks/styleguide.md.ejs', sourceFolder + '/sass/blocks/styleguide.md');
				this.directory('source/styleguide-template', sourceFolder + '/styleguide-template');
			}
			
			// Optional JS Documentation
			if (this.config.get('features').indexOf('jsDoc') == -1)
			{
				delete packageJsonData['devDependencies']['grunt-jsdoc'];
			}
			
			// Optional Pagespeed Measuring
			if (this.config.get('features').indexOf('measurePagespeed') == -1)
			{
				delete packageJsonData['devDependencies']['grunt-pagespeed'];
			}
			
			// Optional Performance Measuring
			if (this.config.get('features').indexOf('measurePerformance') == -1)
			{
				delete packageJsonData['devDependencies']['grunt-phantomas'];
			}
			
			// Optional Screenshots Diffing
			if (this.config.get('features').indexOf('takeScreenshots') == -1)
			{
				delete packageJsonData['devDependencies']['grunt-photobox'];
			}
			
			// Optional Gitinfos
			if (this.config.get('features').indexOf('gitinfos') == -1)
			{
				delete packageJsonData['devDependencies']['grunt-gitinfos'];
			}
			else
			{
				this.template('source/assemble/partials/gitinfos.hbs.ejs', sourceFolder + '/assemble/partials/gitinfos.hbs');
			}
			
			// Optional Layering-Mixin
			if (this.config.get('nikitaCssMixins').indexOf('layering') != -1)
			{
				this.template('source/sass/variables/_z-layers.scss.ejs', sourceFolder + '/sass/variables/_z-layers.scss');
			}
			
			// Optional Respond-To-Mixin
			if (this.config.get('nikitaCssMixins').indexOf('respond-to') != -1)
			{
				this.template('source/sass/variables/_breakpoints.scss.ejs', sourceFolder + '/sass/variables/_breakpoints.scss');
			}
			
			// Optional Form Framework
			if (this.config.get('formFramework'))
			{
				this.template('source/assemble/pages/forms.hbs.ejs', sourceFolder + '/assemble/pages/forms.hbs');
				this.template('source/sass/blocks/_forms.scss.ejs', sourceFolder + '/sass/blocks/_forms.scss');
				this.src.copy('source/img/bgs/form-select-arrow-down.svg', sourceFolder + '/img/bgs/form-select-arrow-down.svg');
			}
			
			this.dest.write('package.json', JSON.stringify(packageJsonData, null, 4));
			this.dest.write('bower.json', JSON.stringify(bowerJsonData, null, 4));
		},
		
		projectfiles: function ()
		{
		}
	},
	
	end: function ()
	{
		if (this.options['skip-install']) {
			this.log('\nRun ' +
			chalk.yellow.bold('npm install & bower install') +
			' to install your frontend dependencies.\n');
			return;
		}
		
		this.installDependencies();
	}
});

module.exports = NikitaGenerator;
