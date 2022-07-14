const CustomError = require('./custom-error');

module.exports = class SingleDestMultipleSourcesError extends CustomError {
    /**
     * @param {string} destFilePath
     */
    constructor(destFilePath) {
        super(
            `Cannot specify a single file destination for multiple source files. See '${destFilePath}'`,
        );
    }
};
