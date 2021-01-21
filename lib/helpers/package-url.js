const { join } = require('path');
const configStore = require('./config-store');

async function packageURL(key, { configRootDir = process.cwd() } = {}) {
    const eik = configStore.findInDirectory(configRootDir);
    const mappingList = (await eik.pathsAndFiles()).filter(
        ([, , originalDest]) => originalDest === key,
    );

    if (mappingList.length === 0) throw new Error('No files specified');

    const result = mappingList.map(
        ([destPath]) =>
            new URL(join(`pkg`, eik.name, eik.version, destPath), eik.server),
    );

    if (result.length === 1) return result[0];
    return result;
}
module.exports = packageURL;
