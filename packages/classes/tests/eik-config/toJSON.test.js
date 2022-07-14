const { test } = require('tap');
const { EikConfig } = require('@eik/common-classes');

const validEikConfig = {
    name: 'pizza',
    server: 'http://server',
    files: { '/': 'pizza' },
    version: '0.0.0',
};

test('EikConfig: .toJSON', (t) => {
    const config = new EikConfig(validEikConfig);
    t.same(
        config.toJSON(),
        validEikConfig,
        'should serialize config given to constructor',
    );
    t.end();
});
