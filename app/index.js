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
				desc: 'Will skip the installation of npm packages',
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

		var templatePrompts = [
			promptInput('name', 'Your project name', this.appname),
			promptConfirm('private', 'Is this project private?', true),
			promptList('template', 'Which configuration template do you want to use?', [
				{
					name: 'Web-App setup (old slim)',
					value: 'slim'
				},
				{
					name: 'Spring Boot setup',
					value: 'spring-boot'
				},
				{
					name: 'Kickstarter setup (old default)',
					value: 'default'
				},
			]),
			promptConfirm('custom', 'Customize this template?', false),
		];
		
		var handleSetup = function() {
			var prompts = [];
			
			if (that.config.get('askBuildFolders')) {
				prompts.push(promptConfirm('useBuildFolders', 'Do you want to use "build/source and dist" folder?', that.config.get('useBuildFolders', true)));
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
			for (var key in props)
			{
				if (props.hasOwnProperty(key))
				{
					that.config.set(key, props[key]);
				}
			}
			
			var templateSpecificPrompts = [];

			if (that.config.get('template') === 'default')
			{
				that.config.set('staticPageGenerator', 'assemble');
				that.config.set('features', [
					'webfonts',
					'browserReset',
					'svgBackgrounds',
					'svgSprite',
					'groupMediaQueries',
					'gitinfos'
				]);
				that.config.set('addons', [
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
			}
			else if (['slim', 'spring-boot'].indexOf(that.config.get('template')) !== -1)
			{
				that.config.set('staticPageGenerator', 'twigRender');
				that.config.set('features', [
					'webfonts',
					'svgBackgrounds',
					'gitinfos'
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
			}

			that.config.set('askBuildFolders', true);

			if (that.config.get('template') === 'spring-boot') {
				templateSpecificPrompts.push(promptInput('javaGroupId', 'java groupId'));
				templateSpecificPrompts.push(promptInput('javaVersion', 'java version', '1.8'));
				templateSpecificPrompts.push(promptInput('springBootVersion', 'spring boot version', '1.4.2'));
				that.config.set('sourceFolder', 'src/main/resources/static');
				that.config.set('useBuildFolders', false);
				that.config.set('cleanBuildFolders', false);
				that.config.set('askBuildFolders', false);
			}
			
			if (that.config.get('custom')) {
				[
					promptList('staticPageGenerator', 'Which Static-Page-Generator do you want to use?', [
						{
							name: 'twigRender, Static-Page-Generator featuring twig templates',
							value: 'twigRender'
						}, {
							name: 'assemble.io, Static-Page-Generator with handlebars templates',
							value: 'assemble'
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
							name: 'group css media queries (grunt-group-css-media-queries)',
							value: 'groupMediaQueries'
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
							name: 'Use local grunt binary',
							value: 'useLocalGrunt'
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
					promptCheckbox('addons', 'Which additive modules do you want to use?', [
						{
							name: 'Would you like to use a slider in your project',
							value: 'slider'
						}
					]),
					promptConfirm('formFramework', 'Do you want to use the nikita form framework?', true),
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

			// Standard Files & Folders
			this.template('.gitignore.ejs', '.gitignore');
			this.template('stylelint.config.js.ejs', 'stylelint.config.js');
			this.template('Gruntfile.js.ejs', 'Gruntfile.js');
			this.template('NIKITA-LICENSE.md.ejs', 'NIKITA-LICENSE.md');
			this.template('README.md.ejs', 'README.md');
			this.template('setup-dev-env.sh.ejs', 'setup-dev-env.sh');

			// grunt Config Files
			this.dest.mkdir('grunt');
			this.dest.mkdir('grunt/config');
			this.dest.mkdir('grunt/tasks');

			this.template('grunt/aliases.js.ejs', 'grunt/aliases.js');
			this.template('grunt/tasks/generate-tmp-styles-scss.js.ejs', 'grunt/tasks/generate-tmp-styles-scss.js');
			this.template('grunt/tasks/jest.js.ejs', 'grunt/tasks/jest.js');

			this.template('grunt/config/accessibility.js.ejs', 'grunt/config/accessibility.js');
			this.template('grunt/config/browserSync.js.ejs', 'grunt/config/browserSync.js');
			this.template('grunt/config/clean.js.ejs', 'grunt/config/clean.js');
			this.template('grunt/config/concurrent.js.ejs', 'grunt/config/concurrent.js');
			this.template('grunt/config/copy.js.ejs', 'grunt/config/copy.js');
			this.template('grunt/config/cssmin.js.ejs', 'grunt/config/cssmin.js');
			this.template('grunt/config/eslint.js.ejs', 'grunt/config/eslint.js');
			this.template('grunt/config/htmlhint.js.ejs', 'grunt/config/htmlhint.js');
			this.template('grunt/config/imagemin.js.ejs', 'grunt/config/imagemin.js');
			this.template('grunt/config/jest.js.ejs', 'grunt/config/jest.js');
			this.template('grunt/config/postcss.js.ejs', 'grunt/config/postcss.js');
			this.template('grunt/config/prettify.js.ejs', 'grunt/config/prettify.js');
			this.template('grunt/config/sass.js.ejs', 'grunt/config/sass.js');
			this.template('grunt/config/stylelint.js.ejs', 'grunt/config/stylelint.js');
			this.template('grunt/config/svgmin.js.ejs', 'grunt/config/svgmin.js');
			this.template('grunt/config/sync.js.ejs', 'grunt/config/sync.js');
			this.template('grunt/config/uglify.js.ejs', 'grunt/config/uglify.js');
			this.template('grunt/config/watch.js.ejs', 'grunt/config/watch.js');
			this.template('grunt/config/webpack.js.ejs', 'grunt/config/webpack.js');

			//Test Files
			this.dest.mkdir('tests');
			this.template('tests/jest.setup.js.ejs', 'tests/jest.setup.js');
			this.template('tests/jest.transform.js.ejs', 'tests/jest.transform.js');
			this.template('tests/App.test.js.ejs', 'tests/App.test.js');
			this.template('tests/Test.jsb.test.js.ejs', 'tests/Test.jsb.test.js');

			// Source Folder
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
			this.template('source/sass/_basics.scss.ejs', sourceFolder + '/sass/_basics.scss');

			// SASS Extra Files
			this.template('source/sass/blocks/_rwd-testing.scss.ejs', sourceFolder + '/sass/blocks/_rwd-testing.scss');
			this.template('source/sass/blocks/_header.scss.ejs', sourceFolder + '/sass/blocks/_header.scss');
			this.template('source/sass/blocks/_footer.scss.ejs', sourceFolder + '/sass/blocks/_footer.scss');
			this.template('source/sass/extends/.gitkeep', sourceFolder + '/sass/extends/.gitkeep');
			this.template('source/sass/extends/_buttons.scss.ejs', sourceFolder + '/sass/extends/_buttons.scss');

			// SASS Variables
			this.template('source/sass/variables/_color.scss.ejs', sourceFolder + '/sass/variables/_color.scss');
			this.template('source/sass/variables/_timing.scss.ejs', sourceFolder + '/sass/variables/_timing.scss');
			this.template('source/sass/variables/_typography.scss.ejs', sourceFolder + '/sass/variables/_typography.scss');

			// JS Files
			this.template('source/js/_main.js.ejs', sourceFolder + '/js/_main.js');
			this.template('source/js/app.js.ejs', sourceFolder + '/js/app.js');
			this.template('source/js/Test.jsb.js.ejs', sourceFolder + '/js/Test.jsb.js');

			// Assemble
			if (this.config.get('staticPageGenerator').indexOf('assemble') !== -1)
			{
				this.template('grunt/config/assemble.js.ejs', 'grunt/config/assemble.js');
				// Assemble Files
				this.template('source/assemble/pages/index.hbs.ejs', sourceFolder + '/assemble/pages/index.hbs');
				this.template('source/assemble/pages/rwd-testing.hbs.ejs', sourceFolder + '/assemble/pages/rwd-testing.hbs');
				this.template('source/assemble/layouts/lyt-default.hbs.ejs', sourceFolder + '/assemble/layouts/lyt-default.hbs');
				this.template('source/assemble/partials/header.hbs.ejs', sourceFolder + '/assemble/partials/header.hbs');
				this.template('source/assemble/partials/footer.hbs.ejs', sourceFolder + '/assemble/partials/footer.hbs');

				// Assemble Folders
				this.directory('source/assemble/data', sourceFolder + '/assemble/data');
				this.directory('source/assemble/helpers', sourceFolder + '/assemble/helpers');
				this.template('source/assemble/partials/.gitkeep', sourceFolder + '/assemble/partials/.gitkeep');
			}
			else
			{
				delete packageJsonData['devDependencies']['assemble'];
				delete packageJsonData['devDependencies']['grunt-assemble'];
				delete packageJsonData['devDependencies']['handlebars-helper-autolink'];
				delete packageJsonData['devDependencies']['handlebars-helpers'];
			}

			// twigRender
			if (this.config.get('staticPageGenerator').indexOf('twigRender') !== -1)
			{
				this.template('grunt/config/twigRender.js.ejs', 'grunt/config/twigRender.js');
				this.template('source/html/README.md.ejs', sourceFolder + '/html/README.md');
				this.template('source/html/data/.gitkeep', sourceFolder + '/html/data/.gitkeep');
				this.template('source/html/layouts/master.twig.ejs', sourceFolder + '/html/layouts/master.twig');
				this.template('source/html/macros/.gitkeep', sourceFolder + '/html/macros/.gitkeep');
				this.template('source/html/pages/index.twig.ejs', sourceFolder + '/html/pages/index.twig');
				this.template('source/html/pages/rwd-testing.twig.ejs', sourceFolder + '/html/pages/rwd-testing.twig');
				this.template('source/html/partials/header.twig.ejs', sourceFolder + '/html/partials/header.twig');
				this.template('source/html/partials/footer.twig.ejs', sourceFolder + '/html/partials/footer.twig');
			}
			else
			{
				delete packageJsonData['devDependencies']['grunt-twig-render'];
			}

			// Image README Files
			this.template('source/img/bgs/README.md.ejs', sourceFolder + '/img/bgs/README.md');
			this.template('source/img/dev/README.md.ejs', sourceFolder + '/img/dev/README.md');
			this.template('source/img/temp/README.md.ejs', sourceFolder + '/img/temp/README.md');

			if (this.config.get('features').indexOf('useLocalGrunt') === -1)
			{
				delete packageJsonData['devDependencies']['grunt-cli'];
			}

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

			// Optional SVG Sprite
			if (this.config.get('features').indexOf('svgSprite') === -1)
			{
				delete packageJsonData['devDependencies']['grunt-svgstore'];
			}
			else
			{
				this.template('grunt/config/svgstore.js.ejs', 'grunt/config/svgstore.js');
				this.template('source/img/icons/README.md.ejs', sourceFolder + '/img/icons/README.md');
			}

			// Optional CSS Splitting for IE9 and lower
			if (this.config.get('features').indexOf('cssSplit') === -1)
			{
				delete packageJsonData['devDependencies']['grunt-csssplit'];
			}
			else
			{
				this.template('grunt/config/csssplit.js.ejs', 'grunt/config/csssplit.js');
			}

			// Optional css media queries grouping
			if (this.config.get('features').indexOf('groupMediaQueries') === -1)
			{
				delete packageJsonData['devDependencies']['grunt-group-css-media-queries'];
			}
			else
			{
				this.template('grunt/config/group_css_media_queries.js.ejs', 'grunt/config/group_css_media_queries.js');
			}

			// Optional CSS Styleguide
			if (this.config.get('features').indexOf('cssStyleGuide') === -1)
			{
				delete packageJsonData['devDependencies']['grunt-styleguide'];
			}
			else
			{
				this.template('grunt/config/styleguide.js.ejs', 'grunt/config/styleguide.js');
				this.template('source/sass/blocks/styleguide.md.ejs', sourceFolder + '/sass/blocks/styleguide.md');
				this.directory('source/styleguide-template', sourceFolder + '/styleguide-template');
			}

			// Optional JS Documentation
			if (this.config.get('features').indexOf('jsDoc') === -1)
			{
				delete packageJsonData['devDependencies']['grunt-jsdoc'];
			}
			else
			{
				this.template('grunt/config/jsdoc.js.ejs', 'grunt/config/jsdoc.js');
			}

			// Optional Pagespeed Measuring
			if (this.config.get('features').indexOf('measurePagespeed') === -1)
			{
				delete packageJsonData['devDependencies']['grunt-pagespeed'];
			}
			else
			{
				this.template('grunt/config/pagespeed.js.ejs', 'grunt/config/pagespeed.js');
			}

			// Optional Performance Measuring
			if (this.config.get('features').indexOf('measurePerformance') === -1)
			{
				delete packageJsonData['devDependencies']['grunt-phantomas'];
			}
			else
			{
				this.template('grunt/config/phantomas.js.ejs', 'grunt/config/phantomas.js');
			}

			// Optional Screenshots Diffing
			if (this.config.get('features').indexOf('takeScreenshots') === -1)
			{
				delete packageJsonData['devDependencies']['grunt-photobox'];
			}
			else
			{
				this.template('grunt/config/photobox.js.ejs', 'grunt/config/photobox.js');
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

				if (this.config.get('staticPageGenerator').indexOf('assemble') !== -1)
				{
					this.template('source/assemble/partials/gitinfos.hbs.ejs', sourceFolder + '/assemble/partials/gitinfos.hbs');
				}
				if (this.config.get('staticPageGenerator').indexOf('twigRender') !== -1)
				{
					this.template('source/html/partials/gitinfos.twig.ejs', sourceFolder + '/html/partials/gitinfos.twig');
				}
			}

			// Optional Gitinfos
			if (this.config.get('addons').indexOf('slider') === -1)
			{
				delete packageJsonData['devDependencies']['swiper'];
			}
			else
			{
				if (this.config.get('staticPageGenerator').indexOf('assemble') !== -1)
				{
					this.template('source/assemble/partials/slider.hbs.ejs', sourceFolder + '/assemble/partials/slider.hbs');
				}
				if (this.config.get('staticPageGenerator').indexOf('twigRender') !== -1)
				{
					this.template('source/html/partials/slider.twig.ejs', sourceFolder + '/html/partials/slider.twig');
				}
				this.template('source/js/Slider.jsb.js.ejs', sourceFolder + '/js/Slider.jsb.js');
				this.template('source/sass/blocks/_slider.scss.ejs', sourceFolder + '/sass/blocks/_slider.scss');
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
				if (this.config.get('staticPageGenerator').indexOf('assemble') !== -1)
				{
					this.template('source/assemble/pages/forms.hbs.ejs', sourceFolder + '/assemble/pages/forms.hbs');
				}
				if (this.config.get('staticPageGenerator').indexOf('twigRender') !== -1)
				{
					this.template('source/html/pages/forms.twig.ejs', sourceFolder + '/html/pages/forms.twig');
				}

				this.template('source/sass/blocks/_forms.scss.ejs', sourceFolder + '/sass/blocks/_forms.scss');
				this.src.copy('source/img/bgs/form-select-arrow-down.svg', sourceFolder + '/img/bgs/form-select-arrow-down.svg');
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
