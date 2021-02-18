// @ts-check

/**
 * @type {(value: unknown, message?: string) => asserts value}
 */
const assert = require('assert');
const { join, extname } = require('path');
const mime = require('mime-types');

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

        /**
         * @type {string} extension file extension with . character. eg. .json
         */
        this.extension = extname(path);

        /**
         * @type {string} contentType full content-type header for file
         */
        this.contentType =
            mime.contentType(this.extension) || 'application/octet-stream';

        /**
         * @type {string} mimeType mime type of file
         */
        this.mimeType =
            mime.lookup(this.extension) || 'application/octet-stream';
    }
}

module.exports = LocalFileLocation;
