'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');

var NikitaGenerator = yeoman.generators.Base.extend({

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
            'Welcome to the Nikita Project generator!'
        ));

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

        var prompts = [
            {
                type: 'input',
                name: 'name',
                message: 'Your project name',
                default: that.config.get('name', this.appname)
            },
            promptConfirm('private', 'Is this project private?', true),
            promptConfirm('svgBackgrounds', 'Use svg-backgrounds?', true),
            promptCheckbox('features',  'Which features do you want to use?', [
                "cssStyleGuide",
                "jsDoc",
                "takeScreenshots",
                "measurePerformance"
            ]),
            promptCheckbox('nikitaCssMixins',  'Which nikita.css mixins do you want to use?', [
                "centering",
                "fixed-ratiobox",
                "font-smoothing",
                "layering",
                "px-to-rem",
                "respond-to",
                "triangle"
            ]),
            promptCheckbox('nikitaCssExtends',  'Which nikita.css extends do you want to use?', [
                "a11y",
                "cf",
                "ellipsis",
                "hide-text",
                "ib"
            ])
        ];

        this.prompt(prompts, function (props)
        {
            for (var key in props)
            {
                if (props.hasOwnProperty(key))
                {
                    that.config.set(key, props[key]);
                }
            }
            done();
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

            if (this.config.get('nikitaCssMixins').indexOf('respond-to') != -1)
            {
                this.template('source/sass/variables/_breakpoints.scss.ejs', 'source/sass/variables/_breakpoints.scss');
            }

            this.template('source/sass/styles.scss.ejs', 'source/sass/styles.scss');
            this.template('source/sass/universal.scss.ejs', 'source/sass/universal.scss');
            this.template('source/sass/_basics.scss.ejs', 'source/sass/_basics.scss');
            this.template('source/sass/_reset.scss.ejs', 'source/sass/_reset.scss');
            this.template('source/sass/_webfonts.scss.ejs', 'source/sass/_webfonts.scss');

            this.template('source/sass/variables/_color.scss.ejs', 'source/sass/variables/_color.scss');
            this.template('source/sass/variables/_timing.scss.ejs', 'source/sass/variables/_timing.scss');
            this.template('source/sass/variables/_typography.scss.ejs', 'source/sass/variables/_typography.scss');
            this.template('source/sass/variables/_z-layers.scss.ejs', 'source/sass/variables/_z-layers.scss');

            this.dest.mkdir('source/img');
            this.dest.mkdir('source/img/icons'); // svgstore
            this.dest.mkdir('source/fonts');
            this.dest.mkdir('source/sass/mixins');

            this.template('source/assemble/pages/index.hbs.ejs', 'source/assemble/pages/index.hbs');
            this.template('source/assemble/pages/rwd-testing.hbs.ejs', 'source/assemble/pages/rwd-testing.hbs');
            this.template('source/assemble/layouts/lyt-default.hbs.ejs', 'source/assemble/layouts/lyt-default.hbs');

            this.dest.mkdir('source/assemble/layouts');
            this.dest.mkdir('source/assemble/data');
            this.dest.mkdir('source/assemble/helpers');

            this.template('source/img/temp/README.md.ejs', 'source/img/temp/README.md');
            this.template('source/img/dev/README.md.ejs', 'source/img/dev/README.md');
            this.template('source/img/icons/README.md.ejs', 'source/img/icons/README.md');

            this.template('source/sass/blocks/_rwd-testing.scss.ejs', 'source/sass/blocks/_rwd-testing.scss');

            if (this.config.get('features').indexOf('cssStyleGuide') == -1)
            {
                delete packageJsonData['devDependencies']['grunt-styleguide'];
            }
            else
            {
                this.template('source/sass/blocks/styleguide.md.ejs', 'source/sass/blocks/styleguide.md');
                this.directory('source/styleguide-template', 'source/styleguide-template');
            }

            if (this.config.get('features').indexOf('jsDoc') == -1)
            {
                delete packageJsonData['devDependencies']['grunt-jsdoc'];
            }

            if (this.config.get('features').indexOf('measurePerformance') == -1)
            {
                delete packageJsonData['devDependencies']['grunt-phantomas'];
            }

            if (this.config.get('features').indexOf('takeScreenshots') == -1)
            {
                delete packageJsonData['devDependencies']['grunt-photobox'];
            }

            this.template('source/sass/extends/ui-components/_buttons.scss.ejs', 'source/sass/extends/ui-components/_buttons.scss');

            this.template('.gitignore.ejs', '.gitignore');
            this.template('.scss-lint.yml.ejs', '.scss-lint.yml');
            this.template('Gemfile.ejs', 'Gemfile');
            this.template('Gruntfile.js.ejs', 'Gruntfile.js');
            this.template('NIKITA-LICENSE.md.ejs', 'NIKITA-LICENSE.md');
            this.template('README.md.ejs', 'README.md');
            this.template('setup-dev-env.sh.ejs', 'setup-dev-env.sh');

            if (this.config.get('svgBackgrounds'))
            {
                this.template('source/img/bgs/README.md.ejs', 'source/img/bgs/README.md');
                this.src.copy('source/img/bgs/form-select-arrow-down.svg', 'source/img/bgs/form-select-arrow-down.svg');
                this.template('source/sass/mixins/_svg-background.scss.ejs', 'source/sass/mixins/_svg-background.scss');
                this.template('source/sass/blocks/_forms.scss.ejs', 'source/sass/blocks/_forms.scss');
                this.template('source/assemble/pages/forms.hbs.ejs', 'source/assemble/pages/forms.hbs');
                this.dest.mkdir('source/img/bgs'); // svg-background extend
            }
            else
            {
                delete packageJsonData['devDependencies']['grunt-grunticon'];
                delete packageJsonData['devDependencies']['grunt-string-replace'];
            }

            this.directory('source/img/appicons', 'source/img/appicons');

            this.dest.write('package.json', JSON.stringify(packageJsonData, null, 4));
            this.dest.write('bower.json', JSON.stringify(bowerJsonData, null, 4));
        },

        projectfiles: function ()
        {
        }
    },

    end: function ()
    {
        this.installDependencies();
    }
});

module.exports = NikitaGenerator;
