const CustomError = require('./custom-error');

class InvalidConfigError extends CustomError {
    /**
     * @param {string} msg
     */
    constructor(msg) {
        super(`Eik config object was invalid: '${msg}'`);
    }
}

module.exports = InvalidConfigError;
