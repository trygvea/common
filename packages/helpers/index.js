const localAssets = require('./local-assets');
const getDefaults = require('./get-defaults');
const configStore = require('./config-store');
const typeSlug = require('./type-slug');
const typeTitle = require('./type-title');
const resolveFiles = require('./resolve-files');
const {
    addTrailingSlash,
    removeTrailingSlash,
    addLeadingSlash,
    removeLeadingSlash,
} = require('./path-slashes');

module.exports = {
    addLeadingSlash,
    configStore,
    addTrailingSlash,
    removeTrailingSlash,
    removeLeadingSlash,
    localAssets,
    getDefaults,
    resolveFiles,
    typeSlug,
    typeTitle,
};
