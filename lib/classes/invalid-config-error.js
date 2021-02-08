const CustomError = require('./custom-error');

module.exports = class InvalidConfigError extends CustomError {
    constructor(msg) {
        super(`Eik config object was invalid: '${msg}'`);
    }
};
