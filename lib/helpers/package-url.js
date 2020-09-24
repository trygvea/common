const { join, dirname } = require('path');
const fs = require('fs');
const fmap = require('../utils/files');

let eik;

async function packageURL(
    key,
    {
        eikJSONPath = join(process.cwd(), './eik.json'),
    } = {},
) {
    if (!eik) eik = JSON.parse(fs.readFileSync(eikJSONPath));
    const files = await fmap({ [key]: eik.files[key] }, '/', { cwd: dirname(eikJSONPath) });

    if (!files.size)
        throw new Error('Pattern did not match any files on filesystem');

    const isGlobPattern = eik.files[key].includes('*');
    if (!isGlobPattern && files.has(eik.files[key]))
        throw new Error('Specified file not found on disk');
    
    const result = [];

    for (const file of Array.from(files.values())) {
        result.push(new URL(join(`pkg`, eik.name, eik.version, file), eik.server));
    }

    if (result.length === 1) return result[0];
    return result;
}
module.exports = packageURL;
