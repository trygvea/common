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
const ValidationError = require('./validation-error');

const assert = (validate, message) => {
    return value => {
        const valid = validate(value);
        if (valid.error) {
            const errorMessage = valid.error.map(err => err.message).join(',');
            throw new ValidationError(`${message}: ${errorMessage}`);
        }
    };
};

module.exports = {
    eikJSON: assert(eikJSON, 'Invalid eik.json schema'),
    name: assert(name, 'Parameter "name" is not valid'),
    version: assert(version, 'Parameter "version" is not valid'),
    server: assert(server, 'Parameter "server" is not valid'),
    files: assert(files, 'Parameter "files" is not valid'),
    importMap: assert(importMap, 'Parameter "import-map" is not valid'),
    out: assert(out, 'Parameter "out" is not valid'),
};
