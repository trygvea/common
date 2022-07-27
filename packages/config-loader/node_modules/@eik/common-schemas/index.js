// @ts-check
const schema = require('./src/eikjson.schema.json');
const validate = require('./src/validate.js');
const assert = require('./src/assert.js');
const ValidationError = require('./src/validation-error.js');

module.exports = { schema, validate, assert, ValidationError };
