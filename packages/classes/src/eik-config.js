/* eslint-disable no-continue */

/**
 * @type {(value: unknown, message?: string) => asserts value}
 */
const assert = require('assert');
const { extname, join, isAbsolute } = require('path');
const { typeSlug, removeTrailingSlash } = require('@eik/common-helpers');

const schemas = require('@eik/common-schemas');

const resolveFiles = require('./internal/resolve-files.js');

const RemoteFileLocation = require('./internal/remote-file-location.js');
const FileMapping = require('./internal/file-mapping.js');
const SingleDestMultipleSourcesError = require('./internal/single-dest-multiple-source-error.js');
const NoFilesMatchedError = require('./internal/no-files-matched-error.js');

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
 * @typedef {import ("../../eikjson").EikjsonSchema} EikjsonSchema
 */

class EikConfig {
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

    /** @type {EikjsonSchema["name"]} */
    get name() {
        return this[_config].name;
    }

    /** @type {EikjsonSchema["version"]} */
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

    /** @type {[string, string][]} */
    get token() {
        return this[_tokens].get(this.server);
    }

    /** @type {EikjsonSchema["files"]} */
    get files() {
        return this[_config].files;
    }

    /**
     * Normalized relative directory path with any leading ./ or
     * trailing / characters stripped. Defaults to .eik
     *
     * @returns {string} out path string
     */
    get out() {
        const defaulted = this[_config].out || '.eik';
        const out = defaulted.startsWith('./')
            ? defaulted.substr(2)
            : defaulted;
        return removeTrailingSlash(out);
    }

    /**
     * Serializes internal values to an object
     *
     * @returns {EikjsonSchema} object consistent with EikjsonSchema
     */
    toJSON() {
        return { ...this[_config] };
    }

    /**
     * Validates config values against the eik JSON schema
     *
     * @return {void}
     */
    validate() {
        schemas.assert.eikJSON(this[_config]);
    }

    /**
     * Resolves file locations on disk based on values defined in files property
     * of config object.
     *
     * @returns {Promise<FileMapping[]>}
     */
    async mappings() {
        const normalizedFiles = normalizeFilesDefinition(this.files);
        const resolvedFiles = await resolveFiles(normalizedFiles, this.cwd);

        return resolvedFiles.flatMap((files) => {
            const { destination, source } = files;
            const filesArray = Array.from(files);
            if (filesArray.length === 0) {
                throw new NoFilesMatchedError(source);
            }

            if (extname(destination) !== '' && filesArray.length > 1) {
                throw new SingleDestMultipleSourcesError(destination);
            }

            return filesArray.map((localFile) => {
                const shouldMapFilename = extname(destination);
                const relativePathname = shouldMapFilename
                    ? destination
                    : join(destination, localFile.relative);
                const packagePathname = join(
                    typeSlug(this.type),
                    this.name,
                    this.version,
                );
                const remoteDestination = new RemoteFileLocation(
                    relativePathname,
                    packagePathname,
                    this.server,
                );
                return new FileMapping(localFile, remoteDestination);
            });
        });
    }
}

module.exports = EikConfig;
