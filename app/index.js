const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const glob = require('glob');
const compareVersions = require('compare-versions');

module.exports = class extends Generator {

    initializing() {
        this.pkg = require('../package.json');
        this.isFirstRun = !this.config.get('template') || typeof this.config.get('rootFolder') === 'undefined';

        const generatedVersion = this.config.get('version');
        const selfVersion = this.pkg.version;

        if (generatedVersion && selfVersion && compareVersions(selfVersion, generatedVersion) === 1) {
            this.env.error(
                `${chalk.red.bold('Error:')} Your generator-nikita is too old (Version ${chalk.yellow(selfVersion)})!\n`
                + `This nikita kickstarter was generated with version ${chalk.yellow(generatedVersion)}, so update\n`
                + `generator-nikita to newest version with ${chalk.green('npm install -g generator-nikita')}.`,
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
            .then(answers => this._handleMainPrompts(answers))
            .then(() => this.prompt(this._getTemplateSpecificPrompts()))
            .then(answers => this._handleTemplateSpecificPrompts(answers))
            .then(() => this.prompt(this._getCustomizePrompts()))
            .then(answers => this._handleCustomizePrompts(answers))
            .then(() => this.prompt(this._getCustomLibrariesPrompts()))
            .then(answers => this._handleCustomLibrariesPrompts(answers))
            .catch(error => this.log(error));
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
                jsFramework: 'jsb',
                scssMixins: [
                    'a11y-hide',
                    'clearfix',
                    'ellipsis',
                    'fixed-ratiobox',
                    'hide-text',
                    'triangle',
                ],
                libraries: [],
            });

            if (this.config.get('template') === 'spring-boot') {
                this.config.set('rootFolder', 'src/main/resources/web');
            } else if (this.config.get('template') === 'symfony') {
                this.config.set('rootFolder', 'public');
            } else if (this.config.get('template') === 'wordpress') {
                this.config.set('rootFolder', 'web');
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
                    name: `${chalk.bold('pre-commit hook:')} to lint your code automatically`,
                    value: 'preCommitHook',
                }, {
                    name: `${chalk.bold('docker:')} adds basic docker setup (docker-compose.yml, Makefile)`,
                    value: 'docker',
                }, {
                    name: `${chalk.bold('gitlab-ci:')} adds basic gitlab-ci setup (.gitlab-ci.yml)`,
                    value: 'gitlab',
                }, {
                    name: `${chalk.bold('modern JS build:')} adds separated JS build for modern browsers`,
                    value: 'modernJsBuild',
                }, {
                    name: `${chalk.bold('webfonts:')} adds font-folder an scss processing (_webfonts.scss)`,
                    value: 'webfonts',
                }, {
                    name: `${chalk.bold('svg2scss:')} use SVGs as base64 encoded dataURIs in SCSS`,
                    value: 'svgBackgrounds',
                }, {
                    name: `${chalk.bold('git infos:')} adds git infos to generated html files as comment`,
                    value: 'gitinfos',
                },
            ]),
            this._promptList('jsFramework', 'Which JavaScript Framework do you want to use?', [
                {
                    name: `${chalk.bold('JSB:')} BehaviourToolkit featuring module initializing and event bus`,
                    value: 'jsb',
                }, {
                    name: `${chalk.bold('React.js:')} view framework including addons react-router and react-waterfall`,
                    value: 'react',
                },
            ]),
            this._promptCheckbox('scssMixins', 'Which nikita mixins do you want to use?', [
                {
                    name: `${chalk.bold('a11y-hide:')} hide elements in sake of accessibility`,
                    value: 'a11y-hide',
                }, {
                    name: `${chalk.bold('clearfix:')} micro clearfix`,
                    value: 'clearfix',
                }, {
                    name: `${chalk.bold('ellipsis:')} to point out text`,
                    value: 'ellipsis',
                }, {
                    name: `${chalk.bold('fixed-ratiobox:')} intrinsic ratio to force child elements to fluidly scale at a given ratio`,
                    value: 'fixed-ratiobox',
                }, {
                    name: `${chalk.bold('hide-text:')} hide text on elements in sake of accessibility`,
                    value: 'hide-text',
                }, {
                    name: `${chalk.bold('triangle:')} arrow-like triangles with the border-method`,
                    value: 'triangle',
                },
            ]),
        ]);

        return customPrompts;
    }

    _handleCustomizePrompts(answers) {
        this.config.set(answers);

        let rootFolder = (this.config.get('rootFolder') || '').trim();

        if (rootFolder === '[project-root]' || rootFolder === '.') {
            rootFolder = '';
        }

        /* add trailing slash to root folder if not empty */
        this.config.set('rootFolder', (rootFolder.endsWith('/') || rootFolder === '') ? rootFolder : `${rootFolder}/`);
    }

    _getCustomLibrariesPrompts() {

        const options = [
            {
                name: `${chalk.bold('lodash:')} JavaScript utility library`,
                value: 'lodash',
            },
            {
                name: `${chalk.bold('date-fns:')} date utility library`,
                value: 'date-fns',
            },
        ];

        if (this.config.get('jsFramework') === 'react') {
            options.push(
                {
                    name: `${chalk.bold('Swiper:')} modular slider`,
                    value: 'swiper',
                },
                {
                    name: `${chalk.bold('react-select:')} styling select inputs`,
                    value: 'react-select',
                },
                {
                    name: `${chalk.bold('react-a11y-dialog:')} lightweight and accessible modal dialog`,
                    value: 'react-a11y-dialog',
                },
            );
        } else {
            options.push(
                {
                    name: `${chalk.bold('Swiper:')} modular slider`,
                    value: 'swiper',
                },
                {
                    name: `${chalk.bold('choices:')} styling select inputs`,
                    value: 'choices',
                },
                {
                    name: `${chalk.bold('a11y-dialog:')} lightweight and accessible modal dialog`,
                    value: 'a11y-dialog',
                },
            );
        }

        return [this._promptCheckbox('libraries', 'Which common libraries do you want to add?', options)];
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
        this._copyTemplate('.eslintrc.js.ejs', '.eslintrc.js');
        this._copyTemplate('.stylelintrc.js.ejs', '.stylelintrc.js');
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
        this._copyTemplate('grunt/config/htmlmin.js.ejs', 'grunt/config/htmlmin.js');
        this._copyTemplate('grunt/config/imagemin.js.ejs', 'grunt/config/imagemin.js');
        this._copyTemplate('grunt/config/jest.js.ejs', 'grunt/config/jest.js');
        this._copyTemplate('grunt/config/postcss.js.ejs', 'grunt/config/postcss.js');
        this._copyTemplate('grunt/config/realFavicon.js.ejs', 'grunt/config/realFavicon.js');
        this._copyTemplate('grunt/config/sass.js.ejs', 'grunt/config/sass.js');
        this._copyTemplate('grunt/config/sass-globbing.js.ejs', 'grunt/config/sass-globbing.js');
        this._copyTemplate('grunt/config/stylelint.js.ejs', 'grunt/config/stylelint.js');
        this._copyTemplate('grunt/config/twigRender.js.ejs', 'grunt/config/twigRender.js');
        this._copyTemplate('grunt/config/watch.js.ejs', 'grunt/config/watch.js');
        this._copyTemplate('grunt/config/webpack.js.ejs', 'grunt/config/webpack.js');

        // Test Files
        if (isReact) {
            this._copyTemplateDir('src/tests-react/', `${rootFolder}src/tests/`);
        } else {
            this._copyTemplateDir('src/tests-jsb/', `${rootFolder}src/tests/`);
        }

        // images Folder
        this._copy('static/img/appicons', `${rootFolder}static/img/appicons`);
        this._copyTemplate('static/img/temp/README.md.ejs', `${rootFolder}static/img/temp/README.md`);

        // SCSS Basic Files
        this._copyTemplate('src/scss/styles.scss.ejs', `${rootFolder}src/scss/styles.scss`);
        this._copyTemplate('src/scss/_basics.scss.ejs', `${rootFolder}src/scss/_basics.scss`);
        this._copyTemplate('src/scss/_foundation.scss.ejs', `${rootFolder}src/scss/_foundation.scss`);
        this._copyTemplate('src/scss/blocks/_page.scss.ejs', `${rootFolder}src/scss/blocks/_page.scss`);

        // SCSS extends/mixins Files
        this._copyTemplateDir('src/scss/extends/', `${rootFolder}src/scss/extends/`);
        this.config.get('scssMixins').forEach((mixin) => {
            this._copyTemplate(`src/scss/mixins/_${mixin}.scss.ejs`, `${rootFolder}src/scss/mixins/_${mixin}.scss`);
        });

        // SCSS Variables
        this._copyTemplateDir('src/scss/variables/', `${rootFolder}src/scss/variables/`);

        // JS Files
        if (isReact) {
            this._copyTemplateDir('src/js-react/', `${rootFolder}src/js/`);
        } else {
            this._copyTemplateDir('src/js-jsb/', `${rootFolder}src/js/`);
        }

        // Boilerplate Component Files
        if (isReact) {
            this._copyTemplateDir('src/components-react/header/', `${rootFolder}src/components/header/`);
            this._copyTemplateDir('src/components-react/footer/', `${rootFolder}src/components/footer/`);
            this._copyTemplateDir('src/components-react/pages/', `${rootFolder}src/components/pages/`);
            this._copyTemplateDir('src/components-react/common/button/', `${rootFolder}src/components/common/button/`);
            this._copyTemplateDir('src/components-react/form-elements/input/', `${rootFolder}src/components/form-elements/input/`);
            this._copyTemplateDir('src/components-react/form-elements/textarea/', `${rootFolder}src/components/form-elements/textarea/`);
            this._copyTemplateDir('src/components-react/form-elements/checkbox/', `${rootFolder}src/components/form-elements/checkbox/`);
        } else {
            this._copyTemplateDir('src/components-jsb/header/', `${rootFolder}src/components/header/`);
            this._copyTemplateDir('src/components-jsb/footer/', `${rootFolder}src/components/footer/`);
            this._copyTemplateDir('src/components-jsb/common/button/', `${rootFolder}src/components/common/button/`);
            this._copyTemplateDir('src/components-jsb/form-elements/input/', `${rootFolder}src/components/form-elements/input/`);
            this._copyTemplateDir('src/components-jsb/form-elements/textarea/', `${rootFolder}src/components/form-elements/textarea/`);
            this._copyTemplateDir('src/components-jsb/form-elements/checkbox/', `${rootFolder}src/components/form-elements/checkbox/`);
            this._copyTemplateDir('src/components-jsb/page-blocks/sample/', `${rootFolder}src/components/page-blocks/sample/`);
        }

        // Twig files
        this._copyTemplate('src/html/README.md.ejs', `${rootFolder}src/html/README.md`);
        this._copy('src/html/data/', `${rootFolder}src/html/data/`);
        this._copyTemplateDir('src/html/layouts/', `${rootFolder}src/html/layouts/`);
        this._copy('src/html/macros/', `${rootFolder}src/html/macros/`);
        this._copyTemplate('src/html/partials/appicons.twig.ejs', `${rootFolder}src/html/partials/appicons.twig`);
        if (isReact) {
            this._copyTemplate('src/html/pages/index.twig.ejs', `${rootFolder}src/html/pages/index.twig`);
        } else {
            this._copyTemplateDir('src/html/pages/', `${rootFolder}src/html/pages/`);
        }

        // Optional Webfonts folder and SCSS-Partial
        if (this.config.get('features').includes('webfonts')) {
            this._copy('static/fonts', `${rootFolder}static/fonts`);
            this._copyTemplate('src/scss/_webfonts.scss.ejs', `${rootFolder}src/scss/_webfonts.scss`);
        }

        // Optional SVG Backgrounds
        if (this.config.get('features').includes('svgBackgrounds')) {
            this._copyTemplate('grunt/config/svg2scss.js.ejs', 'grunt/config/svg2scss.js');
            this._copyTemplate('grunt/tasks/svg2scss.js.ejs', 'grunt/tasks/svg2scss.js');
            this._copyTemplate('src/scss/mixins/_svg-background.scss.ejs', `${rootFolder}src/scss/mixins/_svg-background.scss`);
            this._copy('src/scss/bg-svg-icons/', `${rootFolder}src/scss/bg-svg-icons/`);
        } else {
            delete packageJsonData.devDependencies.xmldom;
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

        // Optional Docker setup
        if (this.config.get('features').includes('docker')) {
            this._copyTemplate('docker-compose.yml.ejs', 'docker-compose.yml');
            this._copyTemplate('Makefile.ejs', 'Makefile');
            this._copy('.docker/user', '.docker/user');

            if (!this.fs.exists(this.destinationPath('.docker/common.env'))) {
                this._copyTemplate('.docker/common.env', '.docker/common.env');
            }
        }

        // Optional Gitlab setup
        if (this.config.get('features').includes('gitlab')) {
            this._copyTemplate('.gitlab-ci.yml.ejs', '.gitlab-ci.yml');
        }

        // jsFramework
        if (isReact) {
            delete packageJsonData.dependencies['node-jsb'];
            delete packageJsonData.devDependencies['import-glob'];
            delete packageJsonData.devDependencies['ejs-webpack-loader'];
            delete packageJsonData.devDependencies['eslint-config-nikita'];
        } else {
            delete packageJsonData.devDependencies['babel-preset-react'];
            delete packageJsonData.devDependencies.enzyme;
            delete packageJsonData.devDependencies['enzyme-adapter-react-16'];
            delete packageJsonData.devDependencies['eslint-config-nikita-react'];
            delete packageJsonData.devDependencies['eslint-plugin-jsx-a11y'];
            delete packageJsonData.devDependencies['eslint-plugin-react'];
            delete packageJsonData.dependencies.classnames;
            delete packageJsonData.dependencies['prop-types'];
            delete packageJsonData.dependencies.react;
            delete packageJsonData.dependencies['react-dom'];
            delete packageJsonData.dependencies['react-media'];
            delete packageJsonData.dependencies['react-router-dom'];
            delete packageJsonData.dependencies['react-waterfall'];
        }

        // Optional Framework specific Libraries
        if (isReact) {
            delete packageJsonData.dependencies['choices.js'];
            delete packageJsonData.dependencies['custom-event-polyfill'];
            delete packageJsonData.dependencies['a11y-dialog'];

            // Optional Swiper Slider
            if (this.config.get('libraries').includes('swiper')) {
                this._copyTemplateDir('src/components-react/common/slider/', `${rootFolder}src/components/common/slider/`);
            } else {
                delete packageJsonData.dependencies.swiper;
            }

            // Optional react-select
            if (this.config.get('libraries').includes('react-select')) {
                this._copyTemplateDir('src/components-react/form-elements/select/', `${rootFolder}src/components/form-elements/select/`);
            } else {
                delete packageJsonData.dependencies['react-select'];
            }

            // Optional A11y Dialog
            if (this.config.get('libraries').includes('react-a11y-dialog')) {
                this._copyTemplateDir('src/components-react/common/dialog/', `${rootFolder}src/components/common/dialog/`);
            } else {
                delete packageJsonData.dependencies['react-a11y-dialog'];
            }
        } else {
            delete packageJsonData.dependencies['react-select'];
            delete packageJsonData.dependencies['react-a11y-dialog'];

            // Optional Swiper Slider
            if (this.config.get('libraries').includes('swiper')) {
                this._copyTemplateDir('src/components-jsb/common/slider/', `${rootFolder}src/components/common/slider/`);
            } else {
                delete packageJsonData.dependencies.swiper;
            }

            // Optional Choices
            if (this.config.get('libraries').includes('choices')) {
                this._copyTemplateDir('src/components-jsb/form-elements/select/', `${rootFolder}src/components/form-elements/select/`);
            } else {
                delete packageJsonData.dependencies['choices.js'];
                delete packageJsonData.dependencies['custom-event-polyfill'];
            }

            // Optional A11y Dialog
            if (this.config.get('libraries').includes('a11y-dialog')) {
                this._copyTemplateDir('src/components-jsb/common/dialog/', `${rootFolder}src/components/common/dialog/`);
            } else {
                delete packageJsonData.dependencies['a11y-dialog'];
            }
        }

        // Optional lodash
        if (!this.config.get('libraries').includes('lodash')) {
            delete packageJsonData.dependencies['lodash-es'];
        }

        // Optional date-fns
        if (!this.config.get('libraries').includes('date-fns')) {
            delete packageJsonData.dependencies['date-fns'];
        }

        // Spring Boot Template
        if (this.config.get('template') === 'spring-boot') {
            const javaName = this.config.get('name')
                .replace(/-/g, ' ')
                .toLowerCase()
                .replace(/\b[a-z]/g, letter => letter.toUpperCase())
                .replace(/ /g, '');

            const javaNameWithLowercaseFirstLetter = javaName.substr(0, 1).toLowerCase() + javaName.substr(1);
            const springRootJavaFolder = `src/main/java/${this.config.get('javaGroupId').replace(/\./g, '/')}/${javaNameWithLowercaseFirstLetter}`;

            this.config.set('javaName', javaName);
            this.config.set('javaNameWithLowercaseFirstLetter', javaNameWithLowercaseFirstLetter);

            this._copyTemplate('spring-boot/pom.xml.ejs', 'pom.xml');
            this._copyTemplate('spring-boot/Application.java.ejs', `${springRootJavaFolder}/${javaName}Application.java`);
        }

        this.fs.write(this.destinationPath('package.json'), `${JSON.stringify(packageJsonData, null, 4)}\n`);

        if (!this.fs.exists(this.destinationPath('.env'))) {
            this.fs.write(this.destinationPath('.env'), '');
        }
    }

    _copyTemplate(template, destination) {
        this.fs.copyTpl(
            this.templatePath(template),
            this.destinationPath(destination),
            { config: this.config },
        );
    }

    _copyTemplateDir(dir, destination) {
        const files = glob.sync('**/*.ejs', {
            cwd: `${this.templatePath()}/${dir}`,
        });

        if (files.length === 0) {
            throw new Error(`Error: no template files found in directory: ${dir}`);
        }

        files.forEach((file) => {
            this._copyTemplate(dir + file, destination + file.slice(0, -4));
        });
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
        if (this.options['skip-install']) {
            this.log(chalk.yellow('\nSkipping npm install command.'));
        } else if (this.config.get('features').includes('docker')) {
            this.log(chalk.yellow('\nRunning npm install in docker node-cli container...\n'));
            this.spawnCommandSync('docker-compose', ['run', '--no-deps', '--rm', 'node-cli', 'npm', 'install']);
        } else {
            this.log(chalk.yellow('\nRunning npm install...\n'));
            this.npmInstall();
        }
    }

    end() {
        this.log(`${chalk.yellow.bold('\nNote: ')}Foundation JS dependencies are not installed because the use of it's JS components is not recommended due to the heavy script size!\n`);
        this.log(chalk.yellow.bold('Nikita Project Generator run finished!\n'));
    }
};
