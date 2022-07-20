const typeSlug = require('./src/type-slug');
const typeTitle = require('./src/type-title');
const { isStream, isReadableStream } = require('./src/stream');
const {
    addTrailingSlash,
    removeTrailingSlash,
    addLeadingSlash,
    removeLeadingSlash,
} = require('./src/path-slashes');

module.exports = {
    addTrailingSlash,
    removeTrailingSlash,
    addLeadingSlash,
    removeLeadingSlash,
    isStream,
    isReadableStream,
    typeSlug,
    typeTitle,
};
