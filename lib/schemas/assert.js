'use strict';

const {
    eikJSON,
    name,
    version,
    type,
    server,
    files,
    importMap,
    out,
} = require('./validate');
const ValidationError = require('./validation-error');

const assert = (validate, message) => value => {
        const valid = validate(value);
        if (valid.error) {
            const errorMessage = valid.error.map(err => {
                let msg = err.message;
                if (err.params && err.params.allowedValues) {
                    msg += ` ("${err.params.allowedValues.join('", ')}")`;
                }
                return msg;
            }).join(',');
            throw new ValidationError(`${message}: ${errorMessage}`);
        }
    };

module.exports = {
    eikJSON: assert(eikJSON, 'Invalid eik.json schema'),
    name: assert(name, 'Parameter "name" is not valid'),
    type: assert(type, 'Parameter "type" is not valid'),
    version: assert(version, 'Parameter "version" is not valid'),
    server: assert(server, 'Parameter "server" is not valid'),
    files: assert(files, 'Parameter "files" is not valid'),
    importMap: assert(importMap, 'Parameter "import-map" is not valid'),
    out: assert(out, 'Parameter "out" is not valid'),
};
