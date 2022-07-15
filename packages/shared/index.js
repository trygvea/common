const {
    addTrailingSlash,
    removeTrailingSlash,
    addLeadingSlash,
    removeLeadingSlash,
} = require('./src/path-slashes');
const { isStream, isReadableStream } = require('./src/stream');

module.exports = {
    addTrailingSlash,
    removeTrailingSlash,
    addLeadingSlash,
    removeLeadingSlash,
    isStream,
    isReadableStream,
};
