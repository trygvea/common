// @ts-check
const schema = require('./src/eikjson.schema.json');
const validate = require('./src/validate');
const assert = require('./src/assert');
const ValidationError = require('./src/validation-error');

module.exports = { schema, validate, assert, ValidationError };
