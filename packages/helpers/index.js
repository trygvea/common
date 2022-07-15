const localAssets = require('./src/local-assets');
const getDefaults = require('./src/get-defaults');
const configStore = require('./src/config-store');
const typeSlug = require('./src/type-slug');
const typeTitle = require('./src/type-title');
const resolveFiles = require('./src/resolve-files');

const {
    addTrailingSlash,
    removeTrailingSlash,
    addLeadingSlash,
    removeLeadingSlash,
} = require('@eik/common-shared');

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
