// @ts-check

const assert = require('assert');
const { join } = require('path');

/**
 * Class containing information about a local file
 */
class LocalFileLocation {
    /**
     * @param {string} path relative path to file on disk
     * @param {string} cwd current working directory
     */
    constructor(path, cwd) {
        assert(typeof path === 'string', '"path" must be of type "string"');
        assert(typeof cwd === 'string', '"cwd" must be of type "string"');
        /**
         * @type {string} path relative path to file on disk
         */
        this.relative = path;

        /**
         * @type {string} cwd current working directory
         */
        this.cwd = cwd;

        /**
         * @type {string} absolute absolute path to file on disk
         */
        this.absolute = join(cwd, path);
    }
}

module.exports = LocalFileLocation;
