// @ts-check
/* eslint-disable no-continue */
const { basename, normalize } = require('path');
const isGlob = require('is-glob');

const leadingSlash = (val) => val.startsWith('/') ? val : `/${val}`;

/**
 * Takes a definition string and uses it to remove leading parts of a path if necessary.
 * The definition may include glob segments which, if present, will be removed before use from the definition along with all trailing parts of the definition string.
 * 
 * @param {string} definition file path to remove, may include glob segments.
 * @param {string} path file path to perform replacements on.
 * 
 * @return {string} remaining path, will always include a leading slash.
 */
module.exports = function pathDiff (definition, path) {
    const segments = (definition || '').split('/');
    const replacementParts = [];
    for (const segment of segments) {
        if (segment === '.') continue;
        if (segment === '') continue;
        if (isGlob(segment)) break;
        if (basename(path) === segment) break;
        replacementParts.push(segment);
    }
    const matcher = new RegExp(`^/${replacementParts.join('/')}`);
    const replaced = normalize(leadingSlash(path)).replace(matcher, '');
    return leadingSlash(replaced);
}