'use strict';

const {
    eikJSON,
    name,
    version,
    server,
    files,
    importMap,
    out,
} = require('./validate');

class ValidationError extends Error {
    constructor(message, err) {
        let m = message;
        if (err && err.message) m += `: ${err.message}`;
        super(m);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

const assert = (validate, message) => {
    return (value) => {
        const valid = validate(value);
        if (valid.error) {
            const errorMessage = valid.error.map(err => err.message).join(',')
            throw new ValidationError(`${message}: ${errorMessage}`);
        }
    }
}

module.exports.eikJSON = assert(eikJSON, 'Invalid eik.json schema');
module.exports.name = assert(name, 'Parameter "name" is not valid');
module.exports.version = assert(version, 'Parameter "version" is not valid');
module.exports.server = assert(server, 'Parameter "server" is not valid');
module.exports.files = assert(files, 'Parameter "files" is not valid');
module.exports.importMap = assert(importMap, 'Parameter "import-map" is not valid');
module.exports.out = assert(out, 'Parameter "out" is not valid');
