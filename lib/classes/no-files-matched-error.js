const CustomError = require('./custom-error');

module.exports = class NoFilesMatchedError extends CustomError {
    constructor(file) {
        const message = `No files found for path: '${file}'`;
        super(message);
    }
};
