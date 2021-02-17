// @ts-check
/* eslint-disable no-continue */
const { promisify } = require('util');
const path = require('path');
const { extname, join } = require('path');
const isGlob = require('is-glob');
const glob = promisify(require('glob'));
const NoFilesMatchedError = require('./no-files-matched-error');
const SingleDestMultipleSourcesError = require('./single-dest-multiple-source-error');
const FileMapping = require('./file-mapping');
const LocalFileLocation = require('./local-file-location');
const RemoteFileLocation = require('./remote-file-location');
const { assert, schema } = require('../schemas');
const { typeSlug, pathDiff, addTrailingSlash, removeTrailingSlash } = require('../helpers');

const _config = Symbol('config');
const _tokens = Symbol('tokens');

/**
 * @typedef {import ("../../eikjson").EikjsonSchema} EikjsonSchema
 */

module.exports = class EikConfig {
    /**
     * @param {EikjsonSchema?} configHash
     * @param {[string, string][]?} tokens
     * @param {string?} configRootDir
     */
    constructor(configHash, tokens = null, configRootDir = process.cwd()) {
        /** @type EikjsonSchema */
        this[_config] = JSON.parse(JSON.stringify(configHash)) || {};
        this[_tokens] = new Map(tokens);
        this.cwd = removeTrailingSlash(configRootDir);
        /** @type {string[]} */
        this.map = [].concat(this[_config]['import-map'] || []);
    }

    get name() {
        return this[_config].name;
    }

    get version() {
        return this[_config].version;
    }

    set version(newVersion) {
        assert.version(newVersion);
        this[_config].version = newVersion;
    }

    /** @type {EikjsonSchema["type"]} */
    get type() {
        return this[_config].type || schema.properties.type.default;
    }

    /** @type {string} */
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

    validate() {
        assert.eikJSON(this[_config]);
    }

    /**
     * @returns {Promise<FileMapping[]>}
     */
    async mappings() {
        const files =
            typeof this.files === 'string' ? { '/': this.files } : this.files;

        const resolvedFiles = await Promise.all(
            Object.entries(files).map(([pathname, file]) => {
                const fl = file.replace(addTrailingSlash(this.cwd), '');
                let f = fl;
                if (extname(fl) === '' && isGlob(fl) === false) {
                    f = join(fl, '/**/*');
                }
                return Promise.all([pathname, f, glob(f, { cwd: this.cwd, nodir: true })]);
            }),
        );

        return resolvedFiles.flatMap(([pathname, file, filePaths]) => {
            if (filePaths.length === 0) {
                throw new NoFilesMatchedError(file);
            }

            if (extname(pathname) !== '' && filePaths.length > 1) {
                throw new SingleDestMultipleSourcesError(pathname);
            }

            return filePaths.map((filePath) => {
                const source = new LocalFileLocation(filePath, this.cwd);
                const destination = new RemoteFileLocation(
                    extname(pathname) ? pathname : join(pathname, pathDiff(file, filePath)),
                    join(typeSlug(this.type), this.name, this.version),
                    this.server,
                );
                return new FileMapping(source, destination);
            });
        });
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

            const url = new URL(pathname, 'http://origin');
            const basename = path.basename(url.pathname);
            const isNamedDest = basename.includes('.');

            if (isNamedDest) {
                if (filePaths.length > 1)
                    throw new SingleDestMultipleSourcesError(pathname);
                return [[pathname, filePaths[0], pathname, file]];
            }
            return filePaths.map((filePath) => [
                path.join(pathname, filePath),
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
