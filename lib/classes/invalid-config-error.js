// @ts-check

const CustomError = require('./custom-error');

module.exports = class InvalidConfigError extends CustomError {
    /**
     * @param {string} msg 
     */
    constructor(msg) {
        super(`Eik config object was invalid: '${msg}'`);
    }
};
