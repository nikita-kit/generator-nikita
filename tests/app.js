
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
            'source/js/_main.js',
            'source/sass/styles.scss',
            'source/html/pages/index.twig',
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
            'source/js/_main.js',
            'source/js/app.js',
            'source/components/sample/Sample.jsb.js',
            'source/sass/styles.scss',
            'source/html/pages/index.twig',
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
            'source/js/_main.js',
            'source/js/App.js',
            'source/js/Store.js',
            'source/components/sample/Sample.js',
            'source/components/counter/Counter.js',
            'source/sass/styles.scss',
            'source/html/pages/index.twig',
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
            'web/static/js/_main.js',
            'web/static/sass/styles.scss',
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
            'static/js/_main.js',
            'static/sass/styles.scss',
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
            'src/main/resources/static/sass/styles.scss',
            'src/main/resources/static/js/_main.js',
        ]);

        if (process.env.TEMPLATE === 'spring-boot') {
            jest.setTimeout(buildTimeout);
            buildApp(done);
        } else {
            done();
        }
    });
});
