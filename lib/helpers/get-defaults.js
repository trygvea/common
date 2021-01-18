'use strict';

const configStore = require('./config-store');
const EikConfig = require('../classes/eik-config');
/**
 * Sets up and returns an object containing a set of default values for the app context.
 * Default values are fetched from the app's eik.json or package.json file as well as from .eikrc, if present in the users home directory.
 *
 * @param {string} cwd The current working directory
 *
 * @returns {{server:string,token:string,js:string|object,css:string|object,version:string,map:Array,name:string,out:string,cwd:string}}
 */
module.exports = function getDefaults(cwd) {
    try {
        return configStore.findInDirectory(cwd);
    } catch (e) {
        if (e.constructor.name === 'MissingConfigError') {
            return new EikConfig({}, [], cwd);
        }
        throw e;
    }
};
