// @ts-check
const schema = require('./eikjson.schema.json');
const validate = require('./validate.js');
const assert = require('./assert.js');
const ValidationError = require('./validation-error.js');

module.exports = { schema, validate, assert, ValidationError };
