const { test } = require('tap');
const EikConfig = require('../../src/eik-config.js');

const validEikConfig = {
    name: 'pizza',
    server: 'http://server',
    files: { '/': 'pizza' },
    version: '0.0.0',
};

test('EikConfig: .token: no token configured', (t) => {
    const config = new EikConfig(validEikConfig, null);
    t.same(config.token, null);
    t.end();
});

test('EikConfig: .token: single token present: config given', (t) => {
    const config = new EikConfig(validEikConfig, [
        ['http://server', 'muffins'],
    ]);
    t.equal(
        config.server,
        'http://server',
        'server should be provided from config',
    );
    t.equal(config.token, 'muffins', 'token should match given token');
    t.end();
});

test('EikConfig: .token: single token present', (t) => {
    const config = new EikConfig(null, [['http://server', 'muffins']]);
    t.equal(
        config.server,
        'http://server',
        'server should be provided from tokens',
    );
    t.equal(config.token, 'muffins', 'token should match given token');
    t.end();
});

test('EikConfig: .token: multiple tokens present', (t) => {
    const config = new EikConfig(null, [
        ['http://server', 'muffins'],
        ['http://server2', 'cupcakes'],
    ]);
    t.equal(config.server, 'http://server');
    t.equal(config.token, 'muffins', 'token should match first given token');
    t.end();
});
