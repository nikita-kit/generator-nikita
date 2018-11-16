const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const spawnCommand = require('yeoman-generator/lib/actions/spawn-command').spawnCommand;

const defaultTimeout = 10 * 1000;
const buildTimeout = 5 * 60 * 1000;

const buildApp = (done) => {
    spawnCommand('npm', ['install'], { detached: false }).on('exit', () => {
        spawnCommand('grunt', ['dist'], { detached: false }).on('exit', () => {
            spawnCommand('grunt', ['dev'], { detached: false }).on('exit', done);
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
            useBuildFolders: true,
            features: [],
            jsFramework: 'jsb',
            nikitaCssMixins: [],
            nikitaCssExtends: [],
            addons: [],
        }));

    test('creates files', () => {
        assert.file([
            'package.json',
            'Gruntfile.js',
            'grunt/aliases.js',
            'grunt/config/twigRender.js',
            'src/js/_main.js',
            'src/scss/styles.scss',
            'src/html/pages/index.twig',
        ]);
    });
});

describe('generator-nikita:web-app-jsb', () => {
    jest.setTimeout(defaultTimeout);

    beforeAll(() => helpers
        .run(path.join(__dirname, '../app'))
        .withOptions({ skipInstall: true })
        .withPrompts({
            template: 'web-app',
            name: `testrun${(new Date()).getTime()}`,
            useBuildFolders: true,
            features: [],
            jsFramework: 'jsb',
            nikitaCssMixins: [],
            nikitaCssExtends: [],
            addons: [],
        }));

    test('creates files', (done) => {
        assert.file([
            'package.json',
            'Gruntfile.js',
            'grunt/aliases.js',
            'grunt/config/twigRender.js',
            'src/js/_main.js',
            'src/js/app.js',
            'src/components/sample/Sample.jsb.js',
            'src/scss/styles.scss',
            'src/html/pages/index.twig',
        ]);

        if (process.env.TEMPLATE === 'web-app') {
            jest.setTimeout(buildTimeout);
            buildApp(done);
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
            useBuildFolders: true,
            features: [],
            jsFramework: 'react',
            nikitaCssMixins: [],
            nikitaCssExtends: [],
            addons: [],
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
            'src/components/sample/Sample.js',
            'src/components/counter/Counter.js',
            'src/scss/styles.scss',
            'src/html/pages/index.twig',
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
            'web/src/js/_main.js',
            'web/src/scss/styles.scss',
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
        ]);

        if (process.env.TEMPLATE === 'spring-boot') {
            jest.setTimeout(buildTimeout);
            buildApp(done);
        } else {
            done();
        }
    });
});
