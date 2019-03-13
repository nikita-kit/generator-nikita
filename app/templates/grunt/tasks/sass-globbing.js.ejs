module.exports = function (grunt) {

    // task to generate styles.scss without sass-globbing
    grunt.registerMultiTask('sass-globbing', 'expand globbing file declarations', function () {

        const paths = grunt.config.get('paths');

        this.files.forEach((file) => {

            if (!grunt.file.exists(file.src[0])) {
                grunt.log.warn(`Source file "${file.src[0]}" not found.`);
                return;
            }

            let contents = grunt.file.read(file.src[0]);

            // get rid of ../../-prefix, since libsass does not support them in @import-statements+includePaths option
            contents = contents.replace(/"\.\.\/\.\.\//g, '"');

            const importMatches = contents.match(/^@import.+\*.*$/mg);

            if (importMatches) {
                importMatches.forEach((initialMatch) => {
                    // remove all " or '
                    let match = initialMatch.replace(/["']/g, '');

                    // remove the preceeding @import
                    match = match.replace(/^@import/g, '');

                    // lets get rid of the final ; and whitespaces
                    match = match.replace(/;$/g, '').trim();

                    // get all files, which match this pattern
                    const files = grunt.file.expand({
                        cwd: `${paths.src}/scss/`,
                        filter: 'isFile',
                    }, match);

                    const replaceContent = [];

                    files.forEach((matchedFile) => {
                        replaceContent.push(`@import "${matchedFile}";`);
                    });

                    contents = contents.replace(initialMatch, replaceContent.join('\n'));
                });
            }

            grunt.file.write(file.dest, contents);
            grunt.log.writeln(`File "${file.dest}" created.`);
        });
    });
};
