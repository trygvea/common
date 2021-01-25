const { promisify } = require('util');
const path = require('path');
const glob = promisify(require('glob'));
const NoFilesMatchedError = require('./no-files-matched-error');
const SingleDestMultipleSourcesError = require('./single-dest-multiple-source-error');

const _config = Symbol('config');
const _tokens = Symbol('tokens');

module.exports = class EikConfig {
    constructor(configHash, tokens, configRootDir) {
        this[_config] = configHash;

        this[_tokens] = new Map(tokens);
        this.cwd = configRootDir;
        this.map = [].concat(configHash['import-map'] || []);
    }

    get name() {
        return this[_config].name;
    }

    get version() {
        return this[_config].version;
    }

    set version(newVersion) {
        this[_config].version = newVersion;
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

    toJSON() {
        return { ...this[_config] };
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
            const basename = path.basename(pathname);
            const isNamedDest = basename.includes('.');
            if (isNamedDest) {
                if (filePaths.length > 1)
                    throw new SingleDestMultipleSourcesError(pathname);
                return [[pathname, filePaths[0], pathname, file]];
            }
            return filePaths.map((filePath) => [
                path.join(pathname, path.basename(filePath)),
                filePath,
                pathname,
                file,
            ]);
        });
    }

    async pathsAndFilesAbsolute() {
        const relativePathsAndFiles = await this.pathsAndFiles();
        return relativePathsAndFiles.reduce((acc, [destPath, srcPath]) => {
            const absoluteSrc = path.isAbsolute(srcPath)
                ? srcPath
                : path.join(this.cwd, srcPath);
            const absoluteDest = path.join(this.cwd, this.out, destPath);
            acc.set(absoluteSrc, absoluteDest);
            return acc;
        }, new Map());
    }
};
