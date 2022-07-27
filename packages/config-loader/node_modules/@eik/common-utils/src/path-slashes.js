/**
 * Add a trailing slash to a path if necessary
 *
 * @param {string} val
 *
 * @returns {string}
 */
const addTrailingSlash = (val) => (val.endsWith('/') ? val : `${val}/`);

/**
 * Remove a trailing slash from a path if necessary
 *
 * @param {string} val
 *
 * @returns {string}
 */
const removeTrailingSlash = (val) =>
    val.endsWith('/') ? val.substr(0, val.length - 1) : val;

/**
 * Add a leading slash to a path if necessary
 *
 * @param {string} val
 *
 * @returns {string}
 */
const addLeadingSlash = (val) => (val.startsWith('/') ? val : `/${val}`);

/**
 * Remove a leading slash from a path if necessary
 *
 * @param {string} val
 *
 * @returns {string}
 */
const removeLeadingSlash = (val) => (val.startsWith('/') ? val.substr(1) : val);

module.exports = {
    addTrailingSlash,
    removeTrailingSlash,
    addLeadingSlash,
    removeLeadingSlash,
};
