const { test } = require('tap');
const EikConfig = require('../../src/eik-config.js');

const validEikConfig = {
    name: 'pizza',
    server: 'http://server',
    files: { '/': 'pizza' },
    version: '0.0.0',
};

test('EikConfig: .map: set to string http://map', (t) => {
    const config = new EikConfig({
        ...validEikConfig,
        'import-map': 'http://map',
    });
    t.same(config.map, ['http://map'], 'should be wrapped into an array');
    t.end();
});

test('EikConfig: .map: set to an array with two values', (t) => {
    const config = new EikConfig({
        ...validEikConfig,
        'import-map': ['http://map', 'http://map'],
    });
    t.same(
        config.map,
        ['http://map', 'http://map'],
        'should remain the same as input',
    );
    t.end();
});
