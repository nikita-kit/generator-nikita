module.exports = function (grunt) {

    const fs = require('fs');
    const path = require('path');
    const { DOMParser } = require('xmldom');

    // eslint-disable-next-line no-useless-escape
    const commentsReg = /<\!\-\-(.*(?=\-\->))\-\->/gmi;
    const newlineReg = /[\r\n]/gmi;
    const pxReg = /([\d.]+)\D*/;
    const singleQuoteReg = /'/gmi;
    const tabReg = /\t/gmi;
    const parenthesisOpenReg = /\(/gmi;
    const parenthesisCloseReg = /\)/gmi;
    const svgdatauri = 'data:image/svg+xml;charset=US-ASCII,';

    /**
     * Returns the correct linefeed.
     *
     * @method  getEOL
     * @param   {String}  eol  A shortname used to determine the linefeed to return.
     * @return  {String}
     */
    function getEOL(eol) {
        if (eol === 'lf') {
            return '\n';
        }
        if (eol === 'crlf') {
            return '\r\n';
        }
        if (eol === 'cr') {
            return '\r';
        }
        return grunt.util.linefeed;
    }

    /**
     * Returns base64 string of svg file.
     * @method  buildSVGDataURI
     * @param   {String}         data  Contents of svg file.
     */
    function buildSVGDataURI(data) {
        return svgdatauri + encodeURIComponent(data
            .toString('utf-8')
            .replace(newlineReg, '')
            .replace(tabReg, ' ')
            .replace(commentsReg, '')
            .replace(singleQuoteReg, '\\i'))
            .replace(parenthesisOpenReg, '%28')
            .replace(parenthesisCloseReg, '%29');
    }

    /**
     * Reads an SVG file and returns an object that contains the name, datauri,
     * prefix, prefixClass, width and height.
     *
     * @method  processSvgFile
     * @param   {[type]}        filepath  The location of the SVG file to process.
     * @param   {Object}        options   Options to augment the return object.
     * @return  {Object}
     */
    function processSvgFile(filepath, options) {
        const data = fs.readFileSync(filepath).toString() || '';
        const doc = new DOMParser().parseFromString(data, 'text/xml');
        const svgel = doc.getElementsByTagName('svg')[0];
        let width = svgel.getAttribute('width');
        let height = svgel.getAttribute('height');

        if (!width) {
            width = options.defaultWidth;
        }
        if (!height) {
            height = options.defaultHeight;
        }

        return {
            name: path.basename(filepath, '.svg'),
            datauri: buildSVGDataURI(data),
            width: width.replace(pxReg, '$1px'),
            height: height.replace(pxReg, '$1px'),
        };
    }

    /**
     * Creates a new file.
     *
     * @method  createFile
     * @param   {Object}    options      The options object from the grunt task.
     * @param   {Object}    data         The data used to populate the Handlebars template.
     * @param   {String}    destination  The location to save the file to.
     * @param   {Function}  callback     Call this function after the file has been created.
     */
    function createFile(options, data, destination, callback) {
        const eol = getEOL(options.eol);
        let file = `$${options.varName}: (${eol}`;

        data.icons.forEach((icon) => {
            file += `    ${icon.name}: url(${icon.datauri}),${eol}`;
        });

        file += ');';

        // Insert final newline if true
        if (options.insertfinalnewline) {
            file += eol;
        }

        // Write the destination file.
        grunt.log.write(`Creating ${destination.cyan} with ${data.icons.length} icons included...`);
        grunt.file.write(destination, file);
        grunt.log.ok();
        if (callback) {
            callback();
        }
    }

    grunt.registerMultiTask('svg2scss', 'Convert a folder of SVG files into a scss map of data-uris.', function () {
        const done = this.async();

        // Merge task-specific and/or target-specific options with these defaults.
        const options = this.options({
            eol: null,
            varName: 'svg-icon-map',
            defaultWidth: '400px',
            defaultHeight: '300px',
            insertfinalnewline: true,
        });

        // Iterate over all specified file groups.
        this.files.forEach((file) => {
            const results = {
                icons: [],
                cssfile: path.basename(file.dest),
            };
            file.src.filter((filepath) => {
                // Warn on and remove invalid source files (if nonull was set).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn(`Source file "${filepath}" not found.`);
                    return false;
                }
                return true;

            }).forEach((filepath) => {
                if (grunt.file.isFile(filepath)) {
                    results.icons.push(processSvgFile(filepath, options));
                }
            });

            createFile(options, results, path.join(file.dest), () => {
                done();
            });

        });

    });

};
