const typeSlug = require('./src/type-slug.js');
const typeTitle = require('./src/type-title.js');
const { isStream, isReadableStream } = require('./src/stream.js');
const ReadFile = require('./src/read-file.js');
const {
    addTrailingSlash,
    removeTrailingSlash,
    addLeadingSlash,
    removeLeadingSlash,
} = require('./src/path-slashes.js');

module.exports = {
    addTrailingSlash,
    removeTrailingSlash,
    addLeadingSlash,
    removeLeadingSlash,
    isStream,
    isReadableStream,
    typeSlug,
    typeTitle,
    ReadFile,
};
