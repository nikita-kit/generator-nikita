const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const spawnCommand = require('yeoman-generator/lib/actions/spawn-command').spawnCommand;
const fs = require('fs');


const defaultTimeout = 10 * 1000;
const buildTimeout = 5 * 60 * 1000;

const buildApp = (done) => {
    spawnCommand('npm', ['install'], { detached: false }).on('exit', () => {
        spawnCommand('grunt', ['dist'], { detached: false }).on('exit', () => {
            spawnCommand('grunt', ['dev'], { detached: false }).on('exit', () => {
                spawnCommand('grunt', ['test'], { detached: false }).on('exit', done);
            });
        });
    });
};


describe('generator-nikita:app', () => {
    jest.setTimeout(defaultTimeout);

    beforeAll(() => helpers
        .run(path.join(__dirname, '../app'))
        .withOptions({ skipInstall: true })
        .withPrompts({
            template: 'web-app',
            name: `testrun${(new Date()).getTime()}`,
            features: ['docker'],
            jsFramework: 'jsb',
            libraries: ['modernJsBuild'],
            scssMixins: [
                'a11y-hide',
                'clearfix',
                'ellipsis',
                'fixed-ratiobox',
                'hide-text',
                'triangle',
            ],
        }));

    test('creates files', () => {
        assert.file([
            'package.json',
            'Gruntfile.js',
            'Makefile',
            'docker-compose.yml',
            'grunt/aliases.js',
            'grunt/config/twigRender.js',
            'src/js/_main.js',
            'src/scss/styles.scss',
            'src/scss/extends/_buttons.scss',
            'src/scss/mixins/_clearfix.scss',
            'src/html/pages/index.twig',
            'static/img/appicons/favicon.ico',
        ]);

        assert.noFile([
            'src/components/common/slider/Slider.jsb.js',
            'src/components/common/dialog/Dialog.jsb.js',
            'src/components/form-elements/select/Select.jsb.js',
        ]);
    });
});

describe('generator-nikita:web-app-jsb', () => {
    jest.setTimeout(defaultTimeout);
    let tempDir = null;

    beforeAll(() => helpers
        .run(path.join(__dirname, '../app'))
        .withOptions({ skipInstall: true })
        .inTmpDir((dir) => { tempDir = dir; })
        .withPrompts({
            template: 'web-app',
            name: `testrun${(new Date()).getTime()}`,
            features: ['svgBackgrounds'],
            jsFramework: 'jsb',
            scssMixins: [],
            libraries: [
                'lodash',
                'date-fns',
                'choices',
                'swiper',
                'a11y-dialog',
            ],
        }));

    test('creates files', (done) => {
        /* test svg icon processing */
        if (process.env.TEMPLATE === 'web-app') {
            fs.copyFileSync(
                path.join(__dirname, '../img/babel.svg'),
                path.join(tempDir, 'src/scss/bg-svg-icons/babel.svg'),
            );
        }

        assert.file([
            'package.json',
            'Gruntfile.js',
            'grunt/aliases.js',
            'grunt/config/twigRender.js',
            'src/js/_main.js',
            'src/js/App.js',
            'src/components/page-blocks/sample/Sample.jsb.js',
            'src/components/common/slider/Slider.jsb.js',
            'src/components/common/dialog/Dialog.jsb.js',
            'src/components/form-elements/select/Select.jsb.js',
            'src/scss/styles.scss',
            'src/scss/blocks/_page.scss',
            'src/html/pages/index.twig',
            'src/html/pages/forms.twig',
            'static/img/appicons/favicon.ico',
        ]);

        assert.noFile(['src/scss/mixins/_clearfix.scss']);

        assert.fileContent([
            ['src/components/page-blocks/sample/Sample.jsb.js', /lodash-es/],
            ['src/components/page-blocks/sample/Sample.jsb.js', /date-fns\/esm/],
        ]);

        if (process.env.TEMPLATE === 'web-app') {
            jest.setTimeout(buildTimeout);

            buildApp(() => {
                /* test svg icon processing */
                assert.file([
                    'src/scss/bg-svg-icons/babel.svg',
                    'tmp/svg-bgs/babel.svg',
                    'tmp/svg-scss/_svg-icon-map.scss',
                ]);

                assert.fileContent([['tmp/svg-scss/_svg-icon-map.scss', /babel:/]]);

                done();
            });
        } else {
            done();
        }
    });
});

describe('generator-nikita:web-app-react', () => {
    jest.setTimeout(defaultTimeout);

    beforeAll(() => helpers
        .run(path.join(__dirname, '../app'))
        .withOptions({ skipInstall: true })
        .withPrompts({
            template: 'web-app',
            name: `testrun${(new Date()).getTime()}`,
            custom: true,
            features: [],
            jsFramework: 'react',
            libraries: [
                'lodash',
                'date-fns',
                'swiper',
                'react-select',
                'react-a11y-dialog',
            ],
            scssMixins: [],
        }));

    test('creates files', (done) => {
        assert.file([
            'package.json',
            'Gruntfile.js',
            'grunt/aliases.js',
            'grunt/config/twigRender.js',
            'src/js/_main.js',
            'src/js/App.js',
            'src/js/Store.js',
            'src/components/pages/sample/Sample.js',
            'src/components/pages/counter/Counter.js',
            'src/components/common/slider/Slider.js',
            'src/components/common/dialog/Dialog.js',
            'src/components/form-elements/select/Select.js',
            'src/scss/styles.scss',
            'src/scss/blocks/_page.scss',
            'src/html/pages/index.twig',
            'static/img/appicons/favicon.ico',
        ]);

        assert.noFile(['src/html/pages/forms.twig']);

        assert.fileContent([
            ['src/components/pages/sample/Sample.js', /lodash-es/],
            ['src/components/pages/sample/Sample.js', /date-fns\/esm/],
        ]);

        if (process.env.TEMPLATE === 'web-app') {
            jest.setTimeout(buildTimeout);
            buildApp(done);
        } else {
            done();
        }
    });
});

describe('generator-nikita:symfony', () => {
    jest.setTimeout(defaultTimeout);

    beforeAll(() => helpers
        .run(path.join(__dirname, '../app'))
        .withOptions({ skipInstall: true })
        .withPrompts({
            template: 'symfony',
            name: `testrun${(new Date()).getTime()}`,
            custom: false,
        }));

    test('creates files', (done) => {
        assert.file([
            'package.json',
            'Gruntfile.js',
            'grunt/aliases.js',
            'public/src/js/_main.js',
            'public/src/scss/styles.scss',
            'public/static/img/appicons/favicon.ico',
        ]);

        if (process.env.TEMPLATE === 'symfony') {
            jest.setTimeout(buildTimeout);
            buildApp(done);
        } else {
            done();
        }
    });
});

describe('generator-nikita:wordpress', () => {
    jest.setTimeout(defaultTimeout);

    beforeAll(() => helpers
        .run(path.join(__dirname, '../app'))
        .withOptions({ skipInstall: true })
        .withPrompts({
            template: 'wordpress',
            name: `testrun${(new Date()).getTime()}`,
            custom: false,
        }));

    test('creates files', (done) => {
        assert.file([
            'package.json',
            'Gruntfile.js',
            'grunt/aliases.js',
            'web/src/js/_main.js',
            'web/src/scss/styles.scss',
            'web/static/img/appicons/favicon.ico',
        ]);

        if (process.env.TEMPLATE === 'wordpress') {
            jest.setTimeout(buildTimeout);
            buildApp(done);
        } else {
            done();
        }
    });
});

describe('generator-nikita:spring-boot', () => {
    jest.setTimeout(defaultTimeout);
    const timestamp = (new Date()).getTime();

    beforeAll(() => helpers
        .run(path.join(__dirname, '../app'))
        .withOptions({ skipInstall: true })
        .withPrompts({
            template: 'spring-boot',
            name: `testrun${timestamp}`,
            custom: false,
            javaGroupId: 'groupId',
            javaVersion: '1.8',
            springBootVersion: '1.4.2',
        }));

    test('creates files', (done) => {
        assert.file([
            'package.json',
            'Gruntfile.js',
            'grunt/aliases.js',
            `src/main/java/groupId/testrun${timestamp}/Testrun${timestamp}Application.java`,
            'src/main/resources/web/src/scss/styles.scss',
            'src/main/resources/web/src/js/_main.js',
            'src/main/resources/web/static/img/appicons/favicon.ico',
        ]);

        if (process.env.TEMPLATE === 'spring-boot') {
            jest.setTimeout(buildTimeout);
            buildApp(done);
        } else {
            done();
        }
    });
});
