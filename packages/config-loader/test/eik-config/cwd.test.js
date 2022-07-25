const { test } = require('tap');
const EikConfig = require('../../src/eik-config.js');

const validEikConfig = {
    name: 'pizza',
    server: 'http://server',
    files: { '/': 'pizza' },
    version: '0.0.0',
};

test('EikConfig: .cwd set to /some/path', (t) => {
    const config = new EikConfig(validEikConfig, [], '/some/path');
    t.equal(config.cwd, '/some/path', 'should equal the given cwd');
    t.end();
});

test('EikConfig: .cwd set to /some/path/', (t) => {
    const config = new EikConfig(validEikConfig, [], '/some/path/');
    t.equal(config.cwd, '/some/path', 'should normalize the given cwd');
    t.end();
});

test('EikConfig: .cwd set to invalid relative path some/path', (t) => {
    try {
        // eslint-disable-next-line no-new
        new EikConfig(validEikConfig, [], 'some/path');
    } catch (err) {
        t.match(
            err.message,
            '"configRootDir" must be an absolute path:',
            'should throw expected error with message',
        );
    }
    t.end();
});
