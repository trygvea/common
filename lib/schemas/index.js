'use strict';

const Ajv = require('ajv');
const assetsSchema = require('./assets.schema.json');

const createValidator = (schema, ajvOptions) => {
    const ajv = new Ajv(ajvOptions);
    const validate = ajv.compile({
        $schema: 'http://json-schema.org/draft-07/schema#',
        ...schema,
    });

    return data => {
        const valid = validate(data);
        return { value: data, error: !valid && validate.errors };
    };
};

const assets = createValidator(assetsSchema, {
    removeAdditional: true,
    useDefaults: true,
});

module.exports = { assets };
