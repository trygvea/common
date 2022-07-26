const CustomError = require('./custom-error.js');

class NoFilesMatchedError extends CustomError {
    /**
     * @param {string} file
     */
    constructor(file) {
        const message = `No files found for path: '${file}'`;
        super(message);
    }
}

module.exports = NoFilesMatchedError;
