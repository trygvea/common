/* eslint-disable no-await-in-loop */

const assert = require('assert');
const { promisify } = require('util');
const { join, extname, dirname, basename } = require('path');
const fs = require('fs');
const configStore = require("../helpers/config-store")
const glob = promisify(require('glob'));

let eik;

/**
 * Sets up asset routes for local development. Mounted paths match those on Eik server and values are read from projects eik.json file.
 * 
 * @param {object} app - express js or fastify app instance
 * @param {string} rootEikDirectory - (optional) path to folder where eik configuration file can be found
 */
async function localAssets(
    app,
    rootEikDirectory = process.cwd(),
) {
    assert(app.decorateReply || app.name === 'app', 'App must be an Express or Fastify app instance');
    assert(typeof rootEikDirectory === 'string' && rootEikDirectory, 'Path to folder for eik config must be provided and must be of type string');
    // ensure eik.json only loaded 1x
    if (!eik) eik = configStore.findInDirectory(rootEikDirectory);
    for (const [pathname, file] of Object.entries(eik.files)) {
        const filePaths = await glob(file, { cwd: eik.cwd });
        for (const filePath of filePaths) {
            const ext = extname(filePath);
            const pathnameHasExt = !!extname(pathname);
            const value = pathnameHasExt
                ? join(`/pkg/${eik.name}/${eik.version}`, pathname)
                : join(
                      `/pkg/${eik.name}/${eik.version}`,
                      pathname,
                      basename(filePath),
                  );
            const fileOnDisk = join(eik.cwd, filePath);
            let contentType;
            switch (ext) {
                case '.js':
                    contentType = 'application/javascript';
                    break;
                case '.map':
                case '.json':
                    contentType = 'application/json';
                    break;
                case '.css':
                    contentType = 'text/css';
                    break;
                default:
                    contentType = 'application/octet-stream';
            }
            app.get(value, (req, res) => {
                if (res.set) {
                    // express
                    res.set('Access-Control-Allow-Origin', '*');
                    res.set('content-type', contentType);
                    fs.createReadStream(fileOnDisk).pipe(res);
                } else if (res.type) {
                    // fastify
                    res.header('Access-Control-Allow-Origin', '*');
                    res.type(contentType);
                    res.send(fs.createReadStream(fileOnDisk));
                }
            });
        }
    }
}
module.exports = localAssets;
