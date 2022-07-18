const localAssets = require('./src/local-assets');
const getDefaults = require('./src/get-defaults');
const configStore = require('./src/config-store');
const typeSlug = require('./src/type-slug');
const typeTitle = require('./src/type-title');
const resolveFiles = require('./src/resolve-files');
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
    localAssets,
    getDefaults,
    resolveFiles,
    configStore,
    typeSlug,
    typeTitle,
};
