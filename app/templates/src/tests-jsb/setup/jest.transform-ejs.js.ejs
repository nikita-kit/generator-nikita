/*
 * Custom Jest transform implementation that compiles ejs templates
 */
const ejs = require('ejs');
const path = require('path');

module.exports = {
    process(src, filename) {
        const ejsOptions = {
            client: true,
            _with: false,
            localsName: 'data',
            filename: path.relative(process.cwd(), filename),
        };

        const template = ejs.compile(src, ejsOptions);
        return `module.exports = ${template.toString()}`;
    },
};
