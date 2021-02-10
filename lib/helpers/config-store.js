const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');
const homedir = require('os').homedir();

const EikConfig = require('../classes/eik-config');
const MissingConfigError = require('../classes/missing-config-error');
const MultipleConfigSourcesError = require('../classes/multiple-config-sources-error');
const InvalidConfigError = require('../classes/invalid-config-error');

function readJSONFromDisk(path) {
    let fileData;
    try {
        fileData = readFileSync(path);
    } catch (e) {
        return null;
    }
    return JSON.parse(fileData);
}

module.exports = {
    /**
     * Tries to find the configuration for eik in the provided directory.
     *
     * @param {string} configRootDir The base directory for the eik project.
     * @param {function} [loadJSONFromDisk] The function to use to load the file from disk.
     *
     * @returns {EikConfig}
     */
    findInDirectory(configRootDir, loadJSONFromDisk = readJSONFromDisk) {
        const pkgJSON = loadJSONFromDisk(join(configRootDir, 'package.json'));
        const eikJSON = loadJSONFromDisk(join(configRootDir, 'eik.json'));
        if (
            pkgJSON != null &&
            Object.prototype.hasOwnProperty.call(pkgJSON, 'eik') &&
            eikJSON != null
        ) {
            throw new MultipleConfigSourcesError();
        }
        let assets;
        if (pkgJSON) {
            const { name, version, eik } = pkgJSON;
            if (eik) {
                assets = { name, version, ...pkgJSON.eik };
            }
        }
        if (eikJSON) {
            assets = { ...assets, ...eikJSON };
        }
        if (assets == null) {
            throw new MissingConfigError(configRootDir);
        }
        const eikrc = loadJSONFromDisk(join(homedir, '.eikrc')) || {};
        const config = new EikConfig(assets, eikrc.tokens, configRootDir);
        try {
            config.validate();
        } catch(err) {
            throw new InvalidConfigError(`config.findInDirectory operation failed: ${err.message}`);
        }
        return config;
    },
    persistToDisk(config) {
        try {
            config.validate();
        } catch(err) {
            throw new InvalidConfigError(`config.persistToDisk operation failed: ${err.message}`);
        }
        const dest = join(config.cwd, 'eik.json');
        writeFileSync(dest, JSON.stringify(config, null, 2));
    },
};
