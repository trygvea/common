const ReadFile = require('./src/read-file');
const EikConfig = require('./src/eik-config');
const FileMapping = require('./src/file-mapping');
const LocalFileLocation = require('./src/local-file-location');
const RemoteFileLocation = require('./src/remote-file-location');
const ResolvedFiles = require('./src/resolved-files');
const MissingConfigError = require('./src/missing-config-error');
const MultipleConfigSourcesError = require('./src/multiple-config-sources-error');
const InvalidConfigError = require('./src/invalid-config-error');
const SingleDestMultipleSourcesError = require('./src/single-dest-multiple-source-error');
const NoFilesMatchedError = require('./src/no-files-matched-error');
const CustomError = require('./src/custom-error');

module.exports = {
    ReadFile,
    EikConfig,
    FileMapping,
    LocalFileLocation,
    RemoteFileLocation,
    ResolvedFiles,
    MissingConfigError,
    MultipleConfigSourcesError,
    InvalidConfigError,
    SingleDestMultipleSourcesError,
    NoFilesMatchedError,
    CustomError,
};
