/* eslint-disable no-await-in-loop */

/**
 * @type {(value: unknown, message?: string) => asserts value}
 */
const assert = require('assert');
const fs = require('fs');
const configStore = require('./config-store');

/**
 * Sets up asset routes for local development. Mounted paths match those on Eik server and values are read from projects eik.json file.
 *
 * @param {object} app - express js or fastify app instance
 * @param {string} rootEikDirectory - (optional) path to folder where eik configuration file can be found
 */
async function localAssets(app, rootEikDirectory = process.cwd()) {
    assert(
        app.decorateReply || app.name === 'app',
        'App must be an Express or Fastify app instance',
    );
    assert(
        typeof rootEikDirectory === 'string' && rootEikDirectory,
        'Path to folder for eik config must be provided and must be of type string',
    );
    // ensure eik.json only loaded 1x
    const eik = configStore.findInDirectory(rootEikDirectory);

    (await eik.mappings()).forEach((mapping) => {
        app.get(mapping.destination.url.pathname, (req, res) => {
            if (res.set) {
                // express
                res.set('Access-Control-Allow-Origin', '*');
                res.set('content-type', mapping.source.contentType);
                fs.createReadStream(mapping.source.absolute).pipe(res);
            } else if (res.type) {
                // fastify
                res.header('Access-Control-Allow-Origin', '*');
                res.type(mapping.source.contentType);
                res.send(fs.createReadStream(mapping.source.absolute));
            }
        });
    });
}
module.exports = localAssets;
