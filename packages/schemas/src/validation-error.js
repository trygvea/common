// @ts-check
class ValidationError extends Error {
    /**
     * @param {string} message
     * @param {Error} err
     */
    constructor(message, err) {
        let m = message;
        if (err && err.message) m += `: ${err.message}`;
        super(m);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ValidationError;
