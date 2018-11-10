const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const compareVersions = require('compare-versions');

module.exports = class extends Generator {

    initializing() {
        this.pkg = require('../package.json');

        const generatedVersion = this.config.get('version');
        const selfVersion = this.pkg.version;

        if (generatedVersion && selfVersion && compareVersions(selfVersion, generatedVersion) === -1) {
            this.env.error(
                `${chalk.red.bold('Error:')} Your generator-nikita is too old (Version ${chalk.yellow(selfVersion)})!\n` +
                `This nikita kickstarter was generated with version ${chalk.yellow(generatedVersion)}, so update\n` +
                `generator-nikita to newest version with ${chalk.green('npm install -g generator-nikita')}.`,
            );
        }

        if (selfVersion) {
            this.config.set('version', selfVersion);
        }
    }

    /*
     * PROMPTING
     */

    /* eslint-disable no-underscore-dangle */
    prompting() {

        const version = this.pkg.version || '';

        this.log(yosay(`Welcome to the Nikita Project Generator ${version}!`));

        return this.prompt(this._getMainPrompts())
            .then((answers) => this._handleMainPrompts(answers))
            .then(() => this.prompt(this._getTemplateSpecificPrompts()))
            .then((answers) => this._handleTemplateSpecificPrompts(answers))
            .then(() => this.prompt(this._getCustomizePrompts()))
            .then((answers) => this._handleCustomizePrompts(answers))
            .then(() => this.prompt(this._getCustomLibrariesPrompts()))
            .then((answers) => this._handleCustomLibrariesPrompts(answers))
            .catch((error) => this.log(error));
    }

    _getMainPrompts() {
        return [
            this._promptInput('name', 'Your project name', this.appname),
            this._promptList('template', 'Which configuration template do you want to use?', [
                {
                    name: 'Web-App setup',
                    value: 'web-app',
                },
                {
                    name: 'Symfony setup',
                    value: 'symfony',
                },
                {
                    name: 'Wordpress setup',
                    value: 'wordpress',
                },
                {
                    name: 'Spring Boot setup',
                    value: 'spring-boot',
                },
            ]),
            this._promptConfirm('custom', 'Customize this template?', true),
        ];
    }

    _handleMainPrompts(answers) {
        const isFirstRun = !this.config.get('template');
        this.config.set(answers);

        /* set defaults on first run only */
        if (isFirstRun) {
            this.config.set({
                askBuildFolders: true,
                features: [
                    'webfonts',
                    'svgBackgrounds',
                    'gitinfos',
                    'preCommitHook',
                ],
                nikitaCssMixins: ['respond-to'],
                nikitaCssExtends: ['cf'],
                addons: [],
            });

            if (this.config.get('template') === 'wordpress') {
                this.config.set('addons', ['jQuery']);
            }
        }

        if (this.config.get('template') === 'spring-boot') {
            this.config.set('sourceFolder', 'src/main/resources/static');
            this.config.set('useBuildFolders', false);
            this.config.set('askBuildFolders', false);
        } else if (this.config.get('template') === 'symfony') {
            this.config.set('sourceFolder', 'web/static');
            this.config.set('useBuildFolders', false);
            this.config.set('askBuildFolders', false);
        } else if (this.config.get('template') === 'wordpress') {
            this.config.set('sourceFolder', 'static');
            this.config.set('useBuildFolders', false);
            this.config.set('askBuildFolders', false);
        }
    }

    _getTemplateSpecificPrompts() {
        if (this.config.get('template') === 'spring-boot') {
            return [
                this._promptInput('javaGroupId', 'java groupId'),
                this._promptInput('javaVersion', 'java version', '1.8'),
                this._promptInput('springBootVersion', 'spring boot version', '1.4.2'),
            ];
        }
        if (this.config.get('askBuildFolders') && this.config.get('custom')) {
            return [this._promptConfirm('useBuildFolders', 'Do you want to use source+build+dist folders or one custom source folder?', true)];
        }

        return [];
    }

    _handleTemplateSpecificPrompts(answers) {
        this.config.set(answers);

        if (!this.config.get('useBuildFolders')) {
            this.config.set('askBuildFolders', false);
            this.config.set('cleanBuildFolders', false);
        } else {
            this.config.set('cleanBuildFolders', true);
        }
    }

    _getCustomizePrompts() {
        let customPrompts = [];

        if (!this.config.get('custom')) {
            return [];
        }

        if (!this.config.get('useBuildFolders')) {
            customPrompts.push(this._promptInput('sourceFolder', 'Which source folder do you want to use?', 'source'));
        }

        customPrompts = customPrompts.concat([
            this._promptCheckbox('features', 'Which features do you want to use?', [
                {
                    name: 'Self hosted webfonts, a fonts-folder will be added to your project',
                    value: 'webfonts',
                }, {
                    name: 'Browser Reset Styles, a _reset.scss will be added to your project',
                    value: 'browserReset',
                }, {
                    name: 'Use background SVG files as base64 encoded dataURIs with placeholder extends',
                    value: 'svgBackgrounds',
                }, {
                    name: 'Add Gitinfos to your distribution-task (grunt-gitinfos)',
                    value: 'gitinfos',
                }, {
                    name: 'Add a git pre-commit hook to lint your code automatically',
                    value: 'preCommitHook',
                },
            ]),
            this._promptList('jsFramework', 'Which JavaScript Framework do you want to use?', [
                {
                    name: 'JSB, BehaviourToolkit featuring module initializing and event bus',
                    value: 'jsb',
                }, {
                    name: 'React.js, the famous view framework with addons like react-router and react-waterfall',
                    value: 'react',
                },
            ]),
            this._promptCheckbox('nikitaCssMixins', 'Which nikita.css mixins do you want to use?', [
                {
                    name: 'Centering: Horizontally and/or vertically centering elements with the translate-method (IE9+)',
                    value: 'centering',
                }, {
                    name: 'Fixed-Ratiobox: Use intrinsic ratio to force child elements like images, videos or frames to fluidly scale at a given ratio',
                    value: 'fixed-ratiobox',
                }, {
                    name: 'Font-Smoothing: Turn font-smoothing on/off for a better font-rendering on OS X',
                    value: 'font-smoothing',
                }, {
                    name: 'Layering: A function for managing z-index layers within a Sass map',
                    value: 'layering',
                }, {
                    name: 'Respond-To: Easy managing your media queries',
                    value: 'respond-to',
                }, {
                    name: 'Triangle: Easy generating arrow-like triangles with the border-method',
                    value: 'triangle',
                },
            ]),
            this._promptCheckbox('nikitaCssExtends', 'Which nikita.css extends do you want to use?', [
                {
                    name: 'a11y: Hide elements in sake of accessibility',
                    value: 'a11y',
                }, {
                    name: 'cf: Micro clearfix',
                    value: 'cf',
                }, {
                    name: 'ellipsis: Ellipsis to point out text',
                    value: 'ellipsis',
                }, {
                    name: 'hide-text: Hide text on elements in sake of accessibility',
                    value: 'hide-text',
                }, {
                    name: 'ib: Use the inline-block method as an alternative to float elements',
                    value: 'ib',
                },
            ]),
        ]);

        return customPrompts;
    }

    _handleCustomizePrompts(answers) {
        this.config.set(answers);

        /* remove sourceFolder trailing slash */
        this.config.set('sourceFolder', (this.config.get('sourceFolder') || '').replace(/\/$/, ''));
    }

    _getCustomLibrariesPrompts() {

        if (this.config.get('jsFramework') === 'react') {
            return [];
        }

        return [
            this._promptCheckbox('addons', 'Which JS modules do you want to use?', [
                {
                    name: 'jQuery library',
                    value: 'jQuery',
                },
                {
                    name: 'iDangerous Swiper for sliders',
                    value: 'slider',
                },
                {
                    name: 'select2 for styled select inputs',
                    value: 'selectTwo',
                },
            ]),
        ];
    }

    _handleCustomLibrariesPrompts(answers) {
        this.config.set(answers);
    }

    /*
     * PROMPT HELPERS
     */

    _promptInput(name, question, defaultValue) {
        return {
            type: 'input',
            name,
            message: question,
            default: this.config.get(name) || defaultValue,
            validate(value) {
                if (value && value.length > 0) {
                    return true;
                }

                return `Error! Please provide: ${name}`;
            },
        };
    }

    _promptConfirm(name, question, defaultValue) {
        return {
            type: 'confirm',
            name,
            message: question,
            default: this.config.get(name) || defaultValue,
        };
    }

    _promptCheckbox(name, question, choices, defaultChoices) {
        return {
            type: 'checkbox',
            name,
            message: question,
            choices,
            default: this.config.get(name) || defaultChoices,
        };
    }

    _promptList(name, question, choices, defaultChoices) {
        return {
            type: 'list',
            name,
            message: question,
            choices,
            default: this.config.get(name) || defaultChoices,
        };
    }

    /*
     * WRITING
     */

    writing() {
        const packageJsonData = this.fs.readJSON(this.templatePath('_package.json'));
        packageJsonData.name = this.config.get('name');

        const isReact = (this.config.get('jsFramework') === 'react');
        const sourceFolder = (this.config.get('useBuildFolders')) ? 'source' : this.config.get('sourceFolder');

        // Standard Files & Folders
        this._copyTemplate('.gitignore.ejs', '.gitignore');
        this._copyTemplate('Gruntfile.js.ejs', 'Gruntfile.js');
        this._copyTemplate('NIKITA-LICENSE.md.ejs', 'NIKITA-LICENSE.md');
        this._copyTemplate('NIKITA-README.md.ejs', 'NIKITA-README.md');

        // grunt Config Files
        this._copyTemplate('grunt/aliases.js.ejs', 'grunt/aliases.js');
        this._copyTemplate('grunt/tasks/sass-globbing.js.ejs', 'grunt/tasks/sass-globbing.js');
        this._copyTemplate('grunt/tasks/jest.js.ejs', 'grunt/tasks/jest.js');

        this._copyTemplate('grunt/config/browserSync.js.ejs', 'grunt/config/browserSync.js');
        this._copyTemplate('grunt/config/clean.js.ejs', 'grunt/config/clean.js');
        this._copyTemplate('grunt/config/concurrent.js.ejs', 'grunt/config/concurrent.js');
        this._copyTemplate('grunt/config/copy.js.ejs', 'grunt/config/copy.js');
        this._copyTemplate('grunt/config/eslint.js.ejs', 'grunt/config/eslint.js');
        this._copyTemplate('grunt/config/htmlhint.js.ejs', 'grunt/config/htmlhint.js');
        this._copyTemplate('grunt/config/imagemin.js.ejs', 'grunt/config/imagemin.js');
        this._copyTemplate('grunt/config/jest.js.ejs', 'grunt/config/jest.js');
        this._copyTemplate('grunt/config/postcss.js.ejs', 'grunt/config/postcss.js');
        this._copyTemplate('grunt/config/prettify.js.ejs', 'grunt/config/prettify.js');
        this._copyTemplate('grunt/config/sass.js.ejs', 'grunt/config/sass.js');
        this._copyTemplate('grunt/config/sass-globbing.js.ejs', 'grunt/config/sass-globbing.js');
        this._copyTemplate('grunt/config/stylelint.js.ejs', 'grunt/config/stylelint.js');
        this._copyTemplate('grunt/config/svgmin.js.ejs', 'grunt/config/svgmin.js');
        this._copyTemplate('grunt/config/sync.js.ejs', 'grunt/config/sync.js');
        this._copyTemplate('grunt/config/uglify.js.ejs', 'grunt/config/uglify.js');
        this._copyTemplate('grunt/config/watch.js.ejs', 'grunt/config/watch.js');
        this._copyTemplate('grunt/config/webpack.js.ejs', 'grunt/config/webpack.js');

        // Test Files
        if (isReact) {
            this._copyTemplate('source/tests-react/jest.setup.js.ejs', `${sourceFolder}/tests/jest.setup.js`);
            this._copyTemplate('source/tests-react/jest.transform.js.ejs', `${sourceFolder}/tests/jest.transform.js`);
            this._copyTemplate('source/tests-react/App.test.js.ejs', `${sourceFolder}/tests/App.test.js`);
        } else {
            this._copyTemplate('source/tests-jsb/jest.setup.js.ejs', `${sourceFolder}/tests/jest.setup.js`);
            this._copyTemplate('source/tests-jsb/jest.transform.js.ejs', `${sourceFolder}/tests/jest.transform.js`);
            this._copyTemplate('source/tests-jsb/jest.transform-ejs.js.ejs', `${sourceFolder}/tests/jest.transform-ejs.js`);
            this._copyTemplate('source/tests-jsb/App.test.js.ejs', `${sourceFolder}/tests/App.test.js`);
        }

        // Basic Project Folders
        this._copy('source/img/appicons', `${sourceFolder}/img/appicons`);

        // SASS Basic Files
        this._copyTemplate('source/sass/styles.scss.ejs', `${sourceFolder}/sass/styles.scss`);
        this._copyTemplate('source/sass/_basics.scss.ejs', `${sourceFolder}/sass/_basics.scss`);

        // SASS Extra Files
        this._copyTemplate('source/sass/blocks/_header.scss.ejs', `${sourceFolder}/sass/blocks/_header.scss`);
        this._copyTemplate('source/sass/blocks/_footer.scss.ejs', `${sourceFolder}/sass/blocks/_footer.scss`);
        this._copyTemplate('source/sass/extends/.gitkeep', `${sourceFolder}/sass/extends/.gitkeep`);
        this._copyTemplate('source/sass/extends/_buttons.scss.ejs', `${sourceFolder}/sass/extends/_buttons.scss`);

        // SASS Variables
        this._copyTemplate('source/sass/variables/_color.scss.ejs', `${sourceFolder}/sass/variables/_color.scss`);
        this._copyTemplate('source/sass/variables/_timing.scss.ejs', `${sourceFolder}/sass/variables/_timing.scss`);
        this._copyTemplate('source/sass/variables/_typography.scss.ejs', `${sourceFolder}/sass/variables/_typography.scss`);

        // JS Files
        if (isReact) {
            this._copyTemplate('source/js-react/_main.js.ejs', `${sourceFolder}/js/_main.js`);
            this._copyTemplate('source/js-react/App.js.ejs', `${sourceFolder}/js/App.js`);
            this._copyTemplate('source/js-react/Store.js.ejs', `${sourceFolder}/js/Store.js`);
        } else {
            this._copyTemplate('source/js-jsb/_main.js.ejs', `${sourceFolder}/js/_main.js`);
            this._copyTemplate('source/js-jsb/app.js.ejs', `${sourceFolder}/js/app.js`);
        }

        // Sample Component Files
        if (isReact) {
            this._copyTemplate('source/components-react/sample/Sample.js.ejs', `${sourceFolder}/components/sample/Sample.js`);
            this._copyTemplate('source/components-react/sample/Sample.test.js.ejs', `${sourceFolder}/components/sample/Sample.test.js`);
            this._copyTemplate('source/components-react/sample/_sample.scss.ejs', `${sourceFolder}/components/sample/_sample.scss`);
            this._copyTemplate('source/components-react/counter/Counter.js.ejs', `${sourceFolder}/components/counter/Counter.js`);
            this._copyTemplate('source/components-react/counter/Counter.test.js.ejs', `${sourceFolder}/components/counter/Counter.test.js`);
            this._copyTemplate('source/components-react/counter/_counter.scss.ejs', `${sourceFolder}/components/counter/_counter.scss`);
        } else {
            this._copyTemplate('source/components-jsb/sample/Sample.jsb.js.ejs', `${sourceFolder}/components/sample/Sample.jsb.js`);
            this._copyTemplate('source/components-jsb/sample/SampleTemplate.ejs.ejs', `${sourceFolder}/components/sample/SampleTemplate.ejs`);
            this._copyTemplate('source/components-jsb/sample/Sample.jsb.test.js.ejs', `${sourceFolder}/components/sample/Sample.jsb.test.js`);
            this._copyTemplate('source/components-jsb/sample/_sample.scss.ejs', `${sourceFolder}/components/sample/_sample.scss`);
        }

        // twigRender
        this._copyTemplate('grunt/config/twigRender.js.ejs', 'grunt/config/twigRender.js');
        this._copyTemplate('source/html/README.md.ejs', `${sourceFolder}/html/README.md`);
        this._copyTemplate('source/html/data/.gitkeep', `${sourceFolder}/html/data/.gitkeep`);
        this._copyTemplate('source/html/layouts/master.twig.ejs', `${sourceFolder}/html/layouts/master.twig`);
        this._copyTemplate('source/html/macros/.gitkeep', `${sourceFolder}/html/macros/.gitkeep`);
        this._copyTemplate('source/html/pages/index.twig.ejs', `${sourceFolder}/html/pages/index.twig`);
        this._copyTemplate('source/html/partials/header.twig.ejs', `${sourceFolder}/html/partials/header.twig`);
        this._copyTemplate('source/html/partials/footer.twig.ejs', `${sourceFolder}/html/partials/footer.twig`);
        if (!isReact) {
            this._copyTemplate('source/components-jsb/sample/sample.twig.ejs', `${sourceFolder}/components/sample/sample.twig`);
        }

        // Image README Files
        this._copyTemplate('source/img/bgs/README.md.ejs', `${sourceFolder}/img/bgs/README.md`);
        this._copyTemplate('source/img/dev/README.md.ejs', `${sourceFolder}/img/dev/README.md`);
        this._copyTemplate('source/img/temp/README.md.ejs', `${sourceFolder}/img/temp/README.md`);

        // Optional Browser Reset SASS-Partial
        if (this.config.get('features').indexOf('browserReset') !== -1) {
            this._copyTemplate('source/sass/_reset.scss.ejs', `${sourceFolder}/sass/_reset.scss`);
        }

        // Optional Webfonts folder and SASS-Partial
        if (this.config.get('features').indexOf('webfonts') !== -1) {
            this._copy('source/fonts', `${sourceFolder}/fonts`);
            this._copyTemplate('source/sass/_webfonts.scss.ejs', `${sourceFolder}/sass/_webfonts.scss`);
        }

        // Optional SVG Backgrounds
        if (this.config.get('features').indexOf('svgBackgrounds') !== -1) {
            this._copyTemplate('grunt/config/string-replace.js.ejs', 'grunt/config/string-replace.js');
            this._copyTemplate('grunt/config/svgcss.js.ejs', 'grunt/config/svgcss.js');
            this._copyTemplate('source/sass/mixins/_svg-background.scss.ejs', `${sourceFolder}/sass/mixins/_svg-background.scss`);
        } else {
            delete packageJsonData.devDependencies['grunt-svg-css'];
            delete packageJsonData.devDependencies['grunt-string-replace'];
        }

        // Optional Gitinfos
        if (this.config.get('features').indexOf('gitinfos') === -1) {
            delete packageJsonData.devDependencies['grunt-gitinfos'];
        } else {
            this._copyTemplate('grunt/config/gitinfo.js.ejs', 'grunt/config/gitinfo.js');
            this._copyTemplate('grunt/tasks/write-gitinfos.js.ejs', 'grunt/tasks/write-gitinfos.js');
            this._copyTemplate('source/html/partials/gitinfos.twig.ejs', `${sourceFolder}/html/partials/gitinfos.twig`);
        }

        // Optional pre-commit hook
        if (this.config.get('features').indexOf('preCommitHook') === -1) {
            delete packageJsonData.devDependencies['pre-commit'];
            delete packageJsonData['pre-commit'];
            delete packageJsonData['pre-commit.silent'];
        }

        // Optional Layering-Mixin
        if (this.config.get('nikitaCssMixins').indexOf('layering') !== -1) {
            this._copyTemplate('source/sass/variables/_z-layers.scss.ejs', `${sourceFolder}/sass/variables/_z-layers.scss`);
        }

        // Optional Respond-To-Mixin
        if (this.config.get('nikitaCssMixins').indexOf('respond-to') !== -1) {
            this._copyTemplate('source/sass/variables/_breakpoints.scss.ejs', `${sourceFolder}/sass/variables/_breakpoints.scss`);
        }

        // jsFramework
        if (isReact) {
            this.config.set('addons', []);

            delete packageJsonData.devDependencies['node-jsb'];
            delete packageJsonData.devDependencies['ejs-compiled-loader'];
        } else {
            delete packageJsonData.devDependencies['babel-eslint'];
            delete packageJsonData.devDependencies['babel-preset-react'];
            delete packageJsonData.devDependencies.classnames;
            delete packageJsonData.devDependencies.enzyme;
            delete packageJsonData.devDependencies['enzyme-adapter-react-16.3'];
            delete packageJsonData.devDependencies['eslint-plugin-react'];
            delete packageJsonData.devDependencies['prop-types'];
            delete packageJsonData.devDependencies.react;
            delete packageJsonData.devDependencies['react-dom'];
            delete packageJsonData.devDependencies['react-router-dom'];
            delete packageJsonData.devDependencies['react-waterfall'];
        }

        // Optional jQuery
        if ((this.config.get('addons').indexOf('jQuery') === -1) && (this.config.get('addons').indexOf('selectTwo') === -1)) {
            delete packageJsonData.devDependencies.jquery;
        }

        // Optional Slider
        if (this.config.get('addons').indexOf('slider') === -1) {
            delete packageJsonData.devDependencies.swiper;
        } else {
            this._copyTemplate('source/html/partials/slider.twig.ejs', `${sourceFolder}/html/partials/slider.twig`);
            this._copyTemplate('source/js/Slider.jsb.js.ejs', `${sourceFolder}/js/Slider.jsb.js`);
            this._copyTemplate('source/sass/blocks/_slider.scss.ejs', `${sourceFolder}/sass/blocks/_slider.scss`);
        }

        // Optional Select2
        if (this.config.get('addons').indexOf('selectTwo') === -1) {
            delete packageJsonData.devDependencies.select2;
        } else {
            this._copyTemplate('source/js/SelectTwo.jsb.js.ejs', `${sourceFolder}/js/SelectTwo.jsb.js`);
        }

        if (this.config.get('template') === 'spring-boot') {
            const javaName = this.config.get('name')
                .replace(/-/g, ' ')
                .toLowerCase()
                .replace(/\b[a-z]/g, (letter) => letter.toUpperCase())
                .replace(/ /g, '');

            const javaNameWithLowercaseFirstLetter = javaName.substr(0, 1).toLowerCase() + javaName.substr(1);
            const springRootJavaFolder = `src/main/java/${this.config.get('javaGroupId').replace(/\./g, '/')}/${javaNameWithLowercaseFirstLetter}`;

            this.config.set('javaName', javaName);
            this.config.set('javaNameWithLowercaseFirstLetter', javaNameWithLowercaseFirstLetter);

            this._copyTemplate('spring-boot/pom.xml.ejs', 'pom.xml');
            this._copyTemplate('spring-boot/Application.java.ejs', `${springRootJavaFolder}/${javaName}Application.java`);
        }

        this.fs.write(this.destinationPath('package.json'), JSON.stringify(packageJsonData, null, 4));
    }

    _copyTemplate(template, destination) {
        this.fs.copyTpl(
            this.templatePath(template),
            this.destinationPath(destination),
            { config: this.config },
        );
    }

    _copy(template, destination) {
        this.fs.copy(
            this.templatePath(template),
            this.destinationPath(destination),
            {
                globOptions: {
                    dot: true,
                },
            },
        );
    }
    /* eslint-enable no-underscore-dangle */

    /*
     * ENDING
     */

    install() {
        this.installDependencies({
            npm: true,
            bower: false,
        });
    }

    end() {
        this.log('ADIOS AMIGO');
    }
};
