const { test } = require('tap');
const EikConfig = require('../../src/eik-config.js');

const validEikConfig = {
    name: 'pizza',
    server: 'http://server',
    files: { '/': 'pizza' },
    version: '0.0.0',
};

test('EikConfig: .validate(): no config given', (t) => {
    t.plan(1);
    try {
        const config = new EikConfig(null);
        config.validate();
    } catch (err) {
        t.match(
            err.message,
            'Invalid eik.json schema',
            'should throw for invalid config',
        );
    }
    t.end();
});

test('EikConfig: .validate(): no config given', (t) => {
    const config = new EikConfig(validEikConfig);
    config.validate();
    t.ok(true, 'should not throw when valid config is given');
    t.end();
});
