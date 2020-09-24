/* eslint-disable no-await-in-loop */

const assert = require('assert');
const { promisify } = require('util');
const { join, extname, dirname, basename } = require('path');
const fs = require('fs');
const glob = promisify(require('glob'));

let eik;

/**
 * Sets up asset routes for local development. Mounted paths match those on Eik server and values are read from projects eik.json file.
 * 
 * @param {object} app - express js or fastify app instance
 * @param {string} eikJSONPath - (optional) path to eik.json file
 */
async function localAssets(
    app,
    eikJSONPath = join(process.cwd(), './eik.json'),
) {
    assert(app.decorateReply || app.name === 'app', 'App must be an Express or Fastify app instance');
    assert(typeof eikJSONPath === 'string' && eikJSONPath, 'Path to eik.json must be provided and must be of type string');
    // ensure eik.json only loaded 1x
    if (!eik) eik = JSON.parse(fs.readFileSync(eikJSONPath));
    for (const [pathname, file] of Object.entries(eik.files)) {
        const filePaths = await glob(file, { cwd: dirname(eikJSONPath) });
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
            const fileOnDisk = join(dirname(eikJSONPath), filePath);
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
                    res.set('content-type', contentType);
                    fs.createReadStream(fileOnDisk).pipe(res);
                } else if (res.type) {
                    // fastify
                    res.type(contentType);
                    res.send(fs.createReadStream(fileOnDisk));
                }
            });
        }
    }
}
module.exports = localAssets;
