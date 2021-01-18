const { promisify } = require('util');
const glob = promisify(require('glob'));
const NoFilesMatchedError = require('./no-files-matched-error');

const _config = Symbol('config');
const _tokens = Symbol('tokens');

module.exports = class EikConfig {
    constructor(configHash, tokens, projectDir) {
        this[_config] = configHash;

        this[_tokens] = new Map(tokens);
        this.cwd = projectDir;
    }

    get name() {
        return this[_config].name;
    }

    get version() {
        return this[_config].version;
    }

    get map() {
        return this[_config]['import-map'] || [];
    }

    get server() {
        const configuredServer = this[_config].server;
        if (configuredServer) {
            return configuredServer;
        }
        return this[_tokens].keys().next().value;
    }

    get token() {
        return this[_tokens].get(this.server);
    }

    get files() {
        return this[_config].files;
    }

    get out() {
        return this[_config].out || '.eik';
    }

    async pathsAndFiles() {
        const resolvedFiles = await Promise.all(
            Object.entries(this.files).map(([pathname, file]) =>
                Promise.all([pathname, file, glob(file, { cwd: this.cwd })]),
            ),
        );
        return resolvedFiles.flatMap(([pathname, file, filePaths]) => {
            if (filePaths.length === 0) {
                throw new NoFilesMatchedError(file);
            }
            return filePaths.map((filePath) => [pathname, filePath]);
        });
    }
};
