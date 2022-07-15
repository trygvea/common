const { CustomError } = require('../');

class MissingConfigError extends CustomError {
    /**
     * @param {string} dir
     */
    constructor(dir) {
        super(`No package.json or eik.json file found in: '${dir}'`);
    }
}

module.exports = MissingConfigError;
