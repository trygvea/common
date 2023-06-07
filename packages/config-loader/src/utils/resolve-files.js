/* eslint-disable no-continue */

const { extname, join, isAbsolute, basename, sep, normalize } = require('path');
const isGlob = require('is-glob');
const { glob } = require('glob');

const {
    removeTrailingSlash,
    addLeadingSlash,
    removeLeadingSlash,
} = require('@eik/common-utils');
const ResolvedFiles = require('../classes/resolved-files.js');

/**
 * Create a new path from a path string preceeding a glob or the whole path if no glob is found
 *
 * @param {string} path
 * @returns {string} modified path
 */
const pathUntilGlob = (path) => {
    const segments = (path || '').split(sep);
    const segmentsToKeep = [];
    for (const segment of segments) {
        if (segment === '.') continue;
        if (segment === '') continue;
        if (isGlob(segment)) break;
        segmentsToKeep.push(segment);
    }
    return addLeadingSlash(normalize(segmentsToKeep.join(sep)));
};

/**
 * Uses an Eik JSON "files" definition to resolve files on disk into a data structure
 *
 * @param {{[k: string]: string;}} files
 * @param {string} cwd
 *
 * @returns {Promise<ResolvedFiles[]>}
 */
const resolveFiles = async (files, cwd) =>
    Promise.all(
        Object.entries(files).map(async (definition) => {
            const [, source] = definition;
            // normalise to absolute path
            let pattern = isAbsolute(source) ? source : join(cwd, source);

            // append glob if folder
            if (extname(pattern) === '' && isGlob(pattern) === false) {
                pattern = join(pattern, '/**/*');
            }

            // trim off any glob
            let basePath = pathUntilGlob(pattern);

            // fix basePath if file
            if (extname(pattern) !== '') {
                basePath = removeTrailingSlash(
                    basePath.replace(basename(pattern), ''),
                );
            }

            // process glob pattern into a list of existing files
            const resolvedFiles = await glob(pattern, {
                cwd: basePath,
                nodir: true,
            });

            // trim off the basePath to create a relative pathed pattern
            pattern = removeTrailingSlash(
                removeLeadingSlash(pattern.replace(basePath, '')),
            );

            return new ResolvedFiles(resolvedFiles, {
                definition,
                basePath,
                pattern,
            });
        }),
    );

module.exports = resolveFiles;
