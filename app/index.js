const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const compareVersions = require('compare-versions');

module.exports = class extends Generator {

    initializing() {
        this.pkg = require('../package.json');
        this.isFirstRun = !this.config.get('template');

        const generatedVersion = this.config.get('version');
        const selfVersion = this.pkg.version;

        if (generatedVersion && selfVersion && compareVersions(selfVersion, generatedVersion)) {
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
            this._promptInput('name', 'Your project name', this.appname.replace(/ /g, '-').toLowerCase()),
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
        this.config.set(answers);

        /* set defaults on first run only */
        if (this.isFirstRun) {
            this.config.set({
                rootFolder: '',
                features: [
                    'webfonts',
                    'svgBackgrounds',
                    'preCommitHook',
                ],
                nikitaCssMixins: ['respond-to'],
                nikitaCssExtends: ['cf'],
                addons: [],
            });

            if (this.config.get('template') === 'spring-boot') {
                this.config.set('rootFolder', 'src/main/resources/web');
            } else if (this.config.get('template') === 'symfony') {
                this.config.set('rootFolder', 'web');
            } else if (this.config.get('template') === 'wordpress') {
                this.config.set('rootFolder', 'web');
                this.config.set('addons', ['jQuery']);
            }
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

        return [];
    }

    _handleTemplateSpecificPrompts(answers) {
        this.config.set(answers);
    }

    _getCustomizePrompts() {
        let customPrompts = [];

        if (!this.config.get('custom')) {
            return [];
        }

        if (this.isFirstRun) {
            customPrompts.push(this._promptInput('rootFolder', 'Which root folder do you want to use?', '[project-root]'));
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

        let rootFolder = this.config.get('rootFolder').trim() || '';

        if (rootFolder === '[project-root]' || rootFolder === '.') {
            rootFolder = '';
        }

        /* add trailing slash to root folder if not empty */
        this.config.set('rootFolder', (rootFolder.endsWith('/') || rootFolder === '') ? rootFolder : `${rootFolder}/`);
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
        const rootFolder = this.config.get('rootFolder');

        // Standard Files
        this._copyTemplate('.gitignore.ejs', '.gitignore');
        this._copyTemplate('Gruntfile.js.ejs', 'Gruntfile.js');
        this._copyTemplate('NIKITA-LICENSE.md.ejs', 'NIKITA-LICENSE.md');
        this._copyTemplate('NIKITA-README.md.ejs', 'NIKITA-README.md');

        // grunt Files
        this._copyTemplate('grunt/aliases.js.ejs', 'grunt/aliases.js');
        this._copyTemplate('grunt/tasks/sass-globbing.js.ejs', 'grunt/tasks/sass-globbing.js');
        this._copyTemplate('grunt/tasks/jest.js.ejs', 'grunt/tasks/jest.js');

        this._copyTemplate('grunt/config/browserSync.js.ejs', 'grunt/config/browserSync.js');
        this._copyTemplate('grunt/config/clean.js.ejs', 'grunt/config/clean.js');
        this._copyTemplate('grunt/config/concurrent.js.ejs', 'grunt/config/concurrent.js');
        this._copyTemplate('grunt/config/eslint.js.ejs', 'grunt/config/eslint.js');
        this._copyTemplate('grunt/config/imagemin.js.ejs', 'grunt/config/imagemin.js');
        this._copyTemplate('grunt/config/jest.js.ejs', 'grunt/config/jest.js');
        this._copyTemplate('grunt/config/postcss.js.ejs', 'grunt/config/postcss.js');
        this._copyTemplate('grunt/config/prettify.js.ejs', 'grunt/config/prettify.js');
        this._copyTemplate('grunt/config/sass.js.ejs', 'grunt/config/sass.js');
        this._copyTemplate('grunt/config/sass-globbing.js.ejs', 'grunt/config/sass-globbing.js');
        this._copyTemplate('grunt/config/stylelint.js.ejs', 'grunt/config/stylelint.js');
        this._copyTemplate('grunt/config/svgmin.js.ejs', 'grunt/config/svgmin.js');
        this._copyTemplate('grunt/config/sync.js.ejs', 'grunt/config/sync.js');
        this._copyTemplate('grunt/config/twigRender.js.ejs', 'grunt/config/twigRender.js');
        this._copyTemplate('grunt/config/uglify.js.ejs', 'grunt/config/uglify.js');
        this._copyTemplate('grunt/config/watch.js.ejs', 'grunt/config/watch.js');
        this._copyTemplate('grunt/config/webpack.js.ejs', 'grunt/config/webpack.js');

        // Test Files
        if (isReact) {
            this._copyTemplate('src/tests-react/setup/jest.setup.js.ejs', `${rootFolder}src/tests/setup/jest.setup.js`);
            this._copyTemplate('src/tests-react/setup/jest.transform.js.ejs', `${rootFolder}src/tests/setup/jest.transform.js`);
            this._copyTemplate('src/tests-react/App.test.js.ejs', `${rootFolder}src/tests/App.test.js`);
        } else {
            this._copyTemplate('src/tests-jsb/setup/jest.setup.js.ejs', `${rootFolder}src/tests/setup/jest.setup.js`);
            this._copyTemplate('src/tests-jsb/setup/jest.transform.js.ejs', `${rootFolder}src/tests/setup/jest.transform.js`);
            this._copyTemplate('src/tests-jsb/setup/jest.transform-ejs.js.ejs', `${rootFolder}src/tests/setup/jest.transform-ejs.js`);
            this._copyTemplate('src/tests-jsb/App.test.js.ejs', `${rootFolder}src/tests/App.test.js`);
        }

        // images Folder
        this._copy('static/img/appicons', `${rootFolder}static/img/appicons`);
        this._copyTemplate('static/img/temp/README.md.ejs', `${rootFolder}static/img/temp/README.md`);

        // SCSS Basic Files
        this._copyTemplate('src/scss/styles.scss.ejs', `${rootFolder}src/scss/styles.scss`);
        this._copyTemplate('src/scss/_basics.scss.ejs', `${rootFolder}src/scss/_basics.scss`);

        // SCSS Extra Files
        this._copyTemplate('src/scss/blocks/_header.scss.ejs', `${rootFolder}src/scss/blocks/_header.scss`);
        this._copyTemplate('src/scss/blocks/_footer.scss.ejs', `${rootFolder}src/scss/blocks/_footer.scss`);
        this._copyTemplate('src/scss/extends/_buttons.scss.ejs', `${rootFolder}src/scss/extends/_buttons.scss`);

        // SCSS Variables
        this._copyTemplate('src/scss/variables/_color.scss.ejs', `${rootFolder}src/scss/variables/_color.scss`);
        this._copyTemplate('src/scss/variables/_timing.scss.ejs', `${rootFolder}src/scss/variables/_timing.scss`);
        this._copyTemplate('src/scss/variables/_typography.scss.ejs', `${rootFolder}src/scss/variables/_typography.scss`);

        // JS Files
        if (isReact) {
            this._copyTemplate('src/js-react/_main.js.ejs', `${rootFolder}src/js/_main.js`);
            this._copyTemplate('src/js-react/App.js.ejs', `${rootFolder}src/js/App.js`);
            this._copyTemplate('src/js-react/Store.js.ejs', `${rootFolder}src/js/Store.js`);
        } else {
            this._copyTemplate('src/js-jsb/_main.js.ejs', `${rootFolder}src/js/_main.js`);
            this._copyTemplate('src/js-jsb/app.js.ejs', `${rootFolder}src/js/app.js`);
        }

        // Sample Component Files
        if (isReact) {
            this._copyTemplate('src/components-react/sample/Sample.js.ejs', `${rootFolder}src/components/sample/Sample.js`);
            this._copyTemplate('src/components-react/sample/Sample.test.js.ejs', `${rootFolder}src/components/sample/Sample.test.js`);
            this._copyTemplate('src/components-react/sample/_sample.scss.ejs', `${rootFolder}src/components/sample/_sample.scss`);
            this._copyTemplate('src/components-react/counter/Counter.js.ejs', `${rootFolder}src/components/counter/Counter.js`);
            this._copyTemplate('src/components-react/counter/Counter.test.js.ejs', `${rootFolder}src/components/counter/Counter.test.js`);
            this._copyTemplate('src/components-react/counter/_counter.scss.ejs', `${rootFolder}src/components/counter/_counter.scss`);
        } else {
            this._copyTemplate('src/components-jsb/sample/Sample.jsb.js.ejs', `${rootFolder}src/components/sample/Sample.jsb.js`);
            this._copyTemplate('src/components-jsb/sample/SampleTemplate.ejs.ejs', `${rootFolder}src/components/sample/SampleTemplate.ejs`);
            this._copyTemplate('src/components-jsb/sample/Sample.jsb.test.js.ejs', `${rootFolder}src/components/sample/Sample.jsb.test.js`);
            this._copyTemplate('src/components-jsb/sample/_sample.scss.ejs', `${rootFolder}src/components/sample/_sample.scss`);
        }

        // twigRender
        this._copyTemplate('src/html/README.md.ejs', `${rootFolder}src/html/README.md`);
        this._copyTemplate('src/html/data/.gitkeep', `${rootFolder}src/html/data/.gitkeep`);
        this._copyTemplate('src/html/layouts/master.twig.ejs', `${rootFolder}src/html/layouts/master.twig`);
        this._copyTemplate('src/html/macros/.gitkeep', `${rootFolder}src/html/macros/.gitkeep`);
        this._copyTemplate('src/html/pages/index.twig.ejs', `${rootFolder}src/html/pages/index.twig`);
        this._copyTemplate('src/html/partials/header.twig.ejs', `${rootFolder}src/html/partials/header.twig`);
        this._copyTemplate('src/html/partials/footer.twig.ejs', `${rootFolder}src/html/partials/footer.twig`);
        if (!isReact) {
            this._copyTemplate('src/components-jsb/sample/sample.twig.ejs', `${rootFolder}src/components/sample/sample.twig`);
        }

        // Optional Browser Reset SCSS-Partial
        if (this.config.get('features').includes('browserReset')) {
            this._copyTemplate('src/scss/_reset.scss.ejs', `${rootFolder}src/scss/_reset.scss`);
        }

        // Optional Webfonts folder and SCSS-Partial
        if (this.config.get('features').includes('webfonts')) {
            this._copy('static/fonts', `${rootFolder}static/fonts`);
            this._copyTemplate('src/scss/_webfonts.scss.ejs', `${rootFolder}src/scss/_webfonts.scss`);
        }

        // Optional SVG Backgrounds
        if (this.config.get('features').includes('svgBackgrounds')) {
            this._copyTemplate('grunt/config/string-replace.js.ejs', 'grunt/config/string-replace.js');
            this._copyTemplate('grunt/config/svgcss.js.ejs', 'grunt/config/svgcss.js');
            this._copyTemplate('src/scss/mixins/_svg-background.scss.ejs', `${rootFolder}src/scss/mixins/_svg-background.scss`);
            this._copyTemplate('src/scss/bg-icons/README.md.ejs', `${rootFolder}src/scss/bg-icons/README.md`);
        } else {
            delete packageJsonData.devDependencies['grunt-svg-css'];
            delete packageJsonData.devDependencies['grunt-string-replace'];
        }

        // Optional Gitinfos
        if (!this.config.get('features').includes('gitinfos')) {
            delete packageJsonData.devDependencies['grunt-gitinfos'];
        } else {
            this._copyTemplate('grunt/config/gitinfo.js.ejs', 'grunt/config/gitinfo.js');
            this._copyTemplate('grunt/tasks/write-gitinfos.js.ejs', 'grunt/tasks/write-gitinfos.js');
            this._copyTemplate('src/html/partials/gitinfos.twig.ejs', `${rootFolder}src/html/partials/gitinfos.twig`);
        }

        // Optional pre-commit hook
        if (!this.config.get('features').includes('preCommitHook')) {
            delete packageJsonData.devDependencies['pre-commit'];
            delete packageJsonData['pre-commit'];
            delete packageJsonData['pre-commit.silent'];
        }

        // Optional Layering-Mixin
        if (this.config.get('nikitaCssMixins').includes('layering')) {
            this._copyTemplate('src/scss/variables/_z-layers.scss.ejs', `${rootFolder}src/scss/variables/_z-layers.scss`);
        }

        // Optional Respond-To-Mixin
        if (this.config.get('nikitaCssMixins').includes('respond-to')) {
            this._copyTemplate('src/scss/variables/_breakpoints.scss.ejs', `${rootFolder}src/scss/variables/_breakpoints.scss`);
        }

        // jsFramework
        if (isReact) {
            this.config.set('addons', []);

            delete packageJsonData.devDependencies['node-jsb'];
            delete packageJsonData.devDependencies['ejs-webpack-loader'];
            delete packageJsonData.devDependencies['import-glob'];
        } else {
            delete packageJsonData.devDependencies['babel-preset-react'];
            delete packageJsonData.devDependencies.classnames;
            delete packageJsonData.devDependencies.enzyme;
            delete packageJsonData.devDependencies['enzyme-adapter-react-16'];
            delete packageJsonData.devDependencies['eslint-plugin-react'];
            delete packageJsonData.devDependencies['prop-types'];
            delete packageJsonData.devDependencies.react;
            delete packageJsonData.devDependencies['react-dom'];
            delete packageJsonData.devDependencies['react-router-dom'];
            delete packageJsonData.devDependencies['react-waterfall'];
        }

        // Optional jQuery
        if (!this.config.get('addons').includes('jQuery') && !this.config.get('addons').includes('selectTwo')) {
            delete packageJsonData.devDependencies.jquery;
        }

        // Optional Slider
        if (!this.config.get('addons').includes('slider')) {
            delete packageJsonData.devDependencies.swiper;
        } else {
            this._copyTemplate('src/html/partials/slider.twig.ejs', `${rootFolder}src/html/partials/slider.twig`);
            this._copyTemplate('src/js/Slider.jsb.js.ejs', `${rootFolder}src/js/Slider.jsb.js`);
            this._copyTemplate('src/scss/blocks/_slider.scss.ejs', `${rootFolder}src/scss/blocks/_slider.scss`);
        }

        // Optional Select2
        if (!this.config.get('addons').includes('selectTwo')) {
            delete packageJsonData.devDependencies.select2;
        } else {
            this._copyTemplate('src/js/SelectTwo.jsb.js.ejs', `${rootFolder}src/js/SelectTwo.jsb.js`);
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
        this.log(chalk.yellow.bold('\nNikita Project Generator run finished!\n'));
    }
};
