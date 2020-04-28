module.exports = function (grunt) {
    grunt.registerMultiTask('jest', 'Run tests with Jest.', function () {

        const done = this.async();
        const taskOptions = this.options();
        const options = {
            config: JSON.stringify(taskOptions),
            watch: !!grunt.option('watch'),
            ci: !!grunt.option('ci'),
        };

        require('@jest/core').runCLI(options, [process.cwd()]).then(({ results }) => {
            if (taskOptions.collectCoverage) {
                grunt.log.write('\n>> '.green);
                grunt.log.write('View ');
                grunt.log.write(`${taskOptions.coverageDirectory}/lcov-report/index.html`.cyan);
                grunt.log.write(' in a browser for a more detailed overview.\n');
            }

            const testsSucceeded = !(results.numFailedTests || results.numFailedTestSuites);

            done(testsSucceeded);
        });
    });
};
