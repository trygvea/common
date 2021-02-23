/**
 * @type {(value: unknown, message?: string) => asserts value}
 */
const assert = require('assert');
const { join } = require('path');

class RemoteFileLocation {
    /**
     * @param {string} filePathname pathname for file relative to package root eg. /folder/client.js
     * @param {string} packagePathname pathname for package root eg. /pkg/my-pack/1.0.0
     * @param {string} origin server origin eg. https://server.com
     */
    constructor(filePathname, packagePathname, origin) {
        assert(
            typeof filePathname === 'string',
            '"filePathname" must be of type "string"',
        );
        assert(
            typeof packagePathname === 'string',
            '"packagePathname" must be of type "string"',
        );
        assert(typeof origin === 'string', '"origin" must be of type "string"');

        /**
         * @type {string} pathname to package root
         */
        this.packagePathname = new URL(packagePathname, origin).pathname;

        /**
         * @type {string} pathname to file relative to package root
         */
        this.filePathname = new URL(filePathname, origin).pathname;

        /**
         * @type {URL} WHATWG URL object containing the full remote URL for the file
         */
        this.url = new URL(join(packagePathname, filePathname), origin);
    }
}

module.exports = RemoteFileLocation;
