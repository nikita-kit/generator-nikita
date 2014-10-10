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

            this.dest.write('package.json', JSON.stringify(packageJsonData, null, 4));
            this.dest.write('bower.json', JSON.stringify(bowerJsonData, null, 4));

            this.template('source/sass/styles.scss.ejs', 'source/sass/styles.scss');
        },

        projectfiles: function ()
        {
            this.src.copy('editorconfig', '.editorconfig');
            this.src.copy('jshintrc', '.jshintrc');
        }
    },

    end: function ()
    {
        this.installDependencies();
    }
});

module.exports = NikitaGenerator;
