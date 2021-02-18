// @ts-check
/* eslint-disable no-continue */

/**
 * @type {(value: unknown, message?: string) => asserts value}
 */
const assert = require('assert');
const { promisify } = require('util');
const { extname, join, isAbsolute } = require('path');
const isGlob = require('is-glob');
const glob = promisify(require('glob'));
const NoFilesMatchedError = require('./no-files-matched-error');
const SingleDestMultipleSourcesError = require('./single-dest-multiple-source-error');
const FileMapping = require('./file-mapping');
const LocalFileLocation = require('./local-file-location');
const RemoteFileLocation = require('./remote-file-location');
const schemas = require('../schemas');
const {
    typeSlug,
    pathDiff,
    addTrailingSlash,
    removeTrailingSlash,
} = require('../helpers');

const _config = Symbol('config');
const _tokens = Symbol('tokens');

/**
 * Normalizes Eik JSON "files" definition to object form if in string form
 *
 * @param {EikjsonSchema["files"]} files
 *
 * @returns {{[k: string]: string;}}
 */
const normalizeFilesDefinition = (files) =>
    typeof files === 'string' ? { '/': files } : files;

/**
 * Uses an Eik JSON "files" definition to resolve files on disk into a data structure
 *
 * @param {{[k: string]: string;}} files
 * @param {string} cwd
 *
 * @returns {Promise<[string, string, string[]][]>}
 */
const resolveFiles = async (files, cwd) =>
    Promise.all(
        Object.entries(files).map(([dest, src]) => {
            let replaced = src.replace(addTrailingSlash(cwd), '');
            if (extname(replaced) === '' && isGlob(replaced) === false) {
                replaced = join(replaced, '/**/*');
            }
            return Promise.all([
                dest,
                replaced,
                glob(replaced, { cwd, nodir: true }),
            ]);
        }),
    );

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

        assert(
            isAbsolute(configRootDir),
            `"configRootDir" must be an absolute path: "${configRootDir}" given`,
        );
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
        schemas.assert.version(newVersion);
        this[_config].version = newVersion;
    }

    /** @type {EikjsonSchema["type"]} */
    get type() {
        return this[_config].type || schemas.schema.properties.type.default;
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

    /**
     * Normalized relative directory path with leading ./ and trailing / chars stripped
     */
    get out() {
        const defaulted = this[_config].out || '.eik';
        const out = defaulted.startsWith('./')
            ? defaulted.substr(2)
            : defaulted;
        return removeTrailingSlash(out);
    }

    toJSON() {
        return { ...this[_config] };
    }

    validate() {
        schemas.assert.eikJSON(this[_config]);
    }

    /**
     * @returns {Promise<FileMapping[]>}
     */
    async mappings() {
        const files = normalizeFilesDefinition(this.files);
        const resolvedFiles = await resolveFiles(files, this.cwd);

        return resolvedFiles.flatMap(([dest, src, srcFilePaths]) => {
            if (srcFilePaths.length === 0) {
                throw new NoFilesMatchedError(src);
            }

            if (extname(dest) !== '' && srcFilePaths.length > 1) {
                throw new SingleDestMultipleSourcesError(dest);
            }

            return srcFilePaths.map((filePath) => {
                const source = new LocalFileLocation(filePath, this.cwd);
                const destination = new RemoteFileLocation(
                    extname(dest) ? dest : join(dest, pathDiff(src, filePath)),
                    join(typeSlug(this.type), this.name, this.version),
                    this.server,
                );
                return new FileMapping(source, destination);
            });
        });
    }
};
