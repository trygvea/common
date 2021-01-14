const { readFileSync } = require('fs');
const { join } = require('path');

const EikConfig = require('../classes/eik-config');

const homedir = require('os').homedir();

class ConfigStoreError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
class MissingConfigError extends ConfigStoreError {
    constructor(dir) {
        super(`No package.json or eik.json file found in: '${dir}'`);
    }
}
class MultipleConfigSourcesError extends ConfigStoreError {
    constructor() {
        super(
            `Eik configuration was defined in both in package.json and eik.json. You must specify one or the other.`,
        );
    }
}

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
     * Sets up and returns an object containing a set of default values for the app context.
     * Default values are fetched from the app's eik.json file as well as from .eikrc, if present in the users home directory.
     *
     * @param {string} dir The base directory for the eik project.
     *
     * @returns {{server:string,token:string,js:string|object,css:string|object,version:string,map:Array,name:string,out:string,cwd:string}}
     */
    findInDirectory(dir, loadJSONFromDisk = readJSONFromDisk) {
        const pkgJSON = loadJSONFromDisk(join(dir, 'package.json'));
        const eikJSON = loadJSONFromDisk(join(dir, 'eik.json'));
        if (
            pkgJSON != null &&
            pkgJSON.hasOwnProperty('eik') &&
            eikJSON != null
        ) {
            throw new MultipleConfigSourcesError();
        }
        let assets;
        if (pkgJSON) {
            const { name, version } = pkgJSON;
            assets = { name, version, ...pkgJSON.eik };
        }
        if (eikJSON) {
            assets = eikJSON;
        }
        if (assets == null) {
            throw new MissingConfigError(dir);
        }
        const eikrc = loadJSONFromDisk(join(homedir, '.eikrc')) || {};
        return new EikConfig(assets, eikrc.tokens, dir);
    },
};
