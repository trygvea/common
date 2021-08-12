/**
 * @type {(value: unknown, message?: string) => asserts value}
 */
const assert = require('assert');
const { join, extname, isAbsolute } = require('path');
const mime = require('mime-types');

/**
 * Class containing information about a local file
 */
class LocalFileLocation {
    /**
     * @param {string} path path to file on disk relative to basePath
     * @param {string} basePath basePath to the file's location on disk
     */
    constructor(path, basePath) {
        assert(typeof path === 'string', '"path" must be of type "string"');
        assert(
            typeof basePath === 'string',
            '"basePath" must be of type "string"',
        );
        assert(!isAbsolute(path), '"path" must be a relative path');

        /**
         * @type {string} path to file on disk relative to this.basePath
         */
        this.relative = path;

        /**
         * @type {string} absolute path to root files location on disk
         */
        this.basePath = basePath;

        /**
         * @type {string} absolute path to file on disk,
         * this is a concatentation of this.basePath and this.relative
         */
        this.absolute = join(basePath, path);

        /**
         * @type {string} file extension with "." character included. (eg. ".json")
         */
        this.extension = extname(path);

        /**
         * @type {string} full content-type header value for file
         */
        this.contentType =
            mime.contentType(this.extension) || 'application/octet-stream';

        /**
         * @type {string} mime type of file
         */
        this.mimeType =
            mime.lookup(this.extension) || 'application/octet-stream';
    }
}

module.exports = LocalFileLocation;
