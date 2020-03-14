const licenseChecker = require('license-checker');

module.exports = function (grunt) {
    grunt.registerMultiTask('license-checker', 'check the used packages for invalid licenses', function () {
        grunt.log.write('\n>> '.green);
        grunt.log.writeln('starting license check');

        const done = this.async();
        const taskOptions = this.options();

        const excludedLicenses = taskOptions.allowedLicenses.join(',');

        const options = {
            start: process.cwd(),
            json: true,
            exclude: excludedLicenses,
            production: true,
        };

        licenseChecker.init(options, (err, packages) => {
            if (err) {
                grunt.log.writeln('An unexpected error occured while performing the license check '.red);
                done(false);
                return;
            }
            const packageNames = Object.keys(packages);
            if (packageNames.length === 0) {
                grunt.log.writeln('all dependency licenses are allowed in the whitelist');
                done(true);
                return;
            }
            packageNames.forEach((key) => {
                grunt.log.write('Package: ');
                grunt.log.write(key.red);
                grunt.log.write(', is not allowed because of License: ');
                grunt.log.writeln(packages[key].licenses.yellow);
            });
            grunt.log.writeln();
            done(false);
        });
    });
};
