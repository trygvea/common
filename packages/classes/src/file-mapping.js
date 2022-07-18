/* eslint-disable no-unused-vars */

/**
 * @type {(value: unknown, message?: string) => asserts value}
 */
const assert = require('assert');
const LocalFileLocation = require('./local-file-location.js');
const RemoteFileLocation = require('./remote-file-location.js');

/**
 * Class containing a local file system source location and remote server destination location for a file.
 */
class FileMapping {
    /**
     * @param {LocalFileLocation} source
     * @param {RemoteFileLocation} destination
     */
    constructor(source, destination) {
        assert(
            source instanceof LocalFileLocation,
            '"source" must be an instance of LocalFileLocation',
        );
        assert(
            destination instanceof RemoteFileLocation,
            '"destination" must be an instance of RemoteFileLocation',
        );

        /**
         * @type {LocalFileLocation} source
         */
        this.source = source;

        /**
         * @type {RemoteFileLocation} destination
         */
        this.destination = destination;
    }
}

module.exports = FileMapping;
