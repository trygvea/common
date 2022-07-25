// @ts-check

const EikConfig = require('./eik-config.js');
const configStore = require('./config-store.js');

/**
 * Sets up and returns an object containing a set of default values for the app context.
 * Default values are fetched from the app's eik.json or package.json file as well as from .eikrc, if present in the users home directory.
 *
 * @param {string} cwd The current working directory
 *
 * @returns {import("./eik-config.js")} EikConfig
 */
function getDefaults(cwd) {
    try {
        return configStore.findInDirectory(cwd);
    } catch (e) {
        if (e.constructor.name === 'MissingConfigError') {
            return new EikConfig(null, [], cwd);
        }
        throw e;
    }
}

module.exports = getDefaults;
