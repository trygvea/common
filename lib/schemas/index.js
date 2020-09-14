'use strict';

const schema = require('./eikjson.schema.json');
const validate = require('./validate');
const assert = require('./assert');
const ValidationError = require('./validation-error');

module.exports = { schema, validate, assert, ValidationError };
