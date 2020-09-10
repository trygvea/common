'use strict';

const schema = require('./eikjson.schema.json');
const validate = require('./validate');
const assert = require('./assert');

module.exports.schema = schema;
module.exports.validate = validate;
module.exports.assert = assert;