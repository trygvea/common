const { test } = require('tap');
const EikConfig = require('../../src/eik-config.js');

const validEikConfig = {
    name: 'pizza',
    server: 'http://server',
    files: { '/': 'pizza' },
    version: '0.0.0',
};

test('EikConfig: .server: accessing property', (t) => {
    const config = new EikConfig(validEikConfig);
    t.equal(
        config.server,
        'http://server',
        'should equal value given to constructor',
    );
    t.end();
});

test('EikConfig: .server: accessing property: no config given', (t) => {
    const config = new EikConfig(null, [
        ['http://bakery', 'muffins'],
        ['http://server', 'kumara pie'],
    ]);
    t.equal(
        config.server,
        'http://bakery',
        'should fallback to value given to tokens',
    );
    t.end();
});
