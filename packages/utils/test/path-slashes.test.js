const tap = require('tap');
const {
    addTrailingSlash,
    removeLeadingSlash,
    addLeadingSlash,
    removeTrailingSlash,
} = require('../index.js');

tap.test('handle slashes', (t) => {
    t.equal(addTrailingSlash('foo'), 'foo/');
    t.equal(addTrailingSlash('foo/'), 'foo/');
    t.equal(addTrailingSlash('foo/bar'), 'foo/bar/');

    t.equal(removeTrailingSlash('foo/'), 'foo');
    t.equal(removeTrailingSlash('foo'), 'foo');
    t.equal(removeTrailingSlash('foo/bar/'), 'foo/bar');

    t.equal(addLeadingSlash('foo'), '/foo');
    t.equal(addLeadingSlash('/foo'), '/foo');
    t.equal(addLeadingSlash('/foo/bar'), '/foo/bar');

    t.equal(removeLeadingSlash('/foo'), 'foo');
    t.equal(removeLeadingSlash('foo'), 'foo');
    t.equal(removeLeadingSlash('/foo/bar'), 'foo/bar');
    t.end();
});
