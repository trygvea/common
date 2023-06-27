const tap = require('tap');
const { Readable } = require('stream');
const { isStream, isReadableStream } = require('../index.js');

tap.test('handle streams', (t) => {
    const stream = new Readable();
    t.equal(isStream(stream), true);
    t.equal(isReadableStream(stream), true);

    const fakeStream = { pipe: 'not-a-function' };
    t.equal(isStream(fakeStream), false);
    t.equal(isReadableStream(fakeStream), false);
    t.end();
});
