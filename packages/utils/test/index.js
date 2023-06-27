const tap = require('tap');
const { Readable } = require('stream');
const { addTrailingSlash, removeLeadingSlash, addLeadingSlash, removeTrailingSlash, isStream, isReadableStream } = require('../index.js');

tap.test('handle slashes', (t) => {
    t.equal(addTrailingSlash("foo"), 'foo/');
    t.equal(addTrailingSlash("foo/"), 'foo/');
    t.equal(addTrailingSlash("foo/bar"), 'foo/bar/');

    t.equal(removeTrailingSlash("foo/"), 'foo');
    t.equal(removeTrailingSlash("foo"), 'foo');
    t.equal(removeTrailingSlash("foo/bar/"), 'foo/bar');

    t.equal(addLeadingSlash("foo"), '/foo');
    t.equal(addLeadingSlash("/foo"), '/foo');
    t.equal(addLeadingSlash("/foo/bar"), '/foo/bar');

    t.equal(removeLeadingSlash("/foo"), 'foo');
    t.equal(removeLeadingSlash("foo"), 'foo');
    t.equal(removeLeadingSlash("/foo/bar"), 'foo/bar');
    t.end();
});

tap.test('handle streams', (t) => {
    const stream = new Readable();
    t.equal(isStream(stream), true);
    t.equal(isReadableStream(stream), true);

    const fakeStream = {pipe: 'not-a-function'};
    t.equal(isStream(fakeStream), false);
    t.equal(isReadableStream(fakeStream), false);
    t.end();
});

