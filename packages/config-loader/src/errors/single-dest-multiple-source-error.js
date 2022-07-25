const CustomError = require('./custom-error');

class SingleDestMultipleSourcesError extends CustomError {
    /**
     * @param {string} destFilePath
     */
    constructor(destFilePath) {
        super(
            `Cannot specify a single file destination for multiple source files. See '${destFilePath}'`,
        );
    }
}

module.exports = SingleDestMultipleSourcesError;
