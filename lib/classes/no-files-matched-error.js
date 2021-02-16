// @ts-check

const CustomError = require('./custom-error');

module.exports = class NoFilesMatchedError extends CustomError {
    /**
     * @param {string} file 
     */
    constructor(file) {
        const message = `No files found for path: '${file}'`;
        super(message);
    }
};
