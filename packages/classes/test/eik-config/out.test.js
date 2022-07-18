const { test } = require('tap');
const EikConfig = require('../../src/eik-config.js');

const validEikConfig = {
    name: 'pizza',
    server: 'http://server',
    files: { '/': 'pizza' },
    version: '0.0.0',
};

test('EikConfig: .out: no value given', (t) => {
    t.equal(
        new EikConfig(validEikConfig).out,
        '.eik',
        'should default to .eik',
    );
    t.end();
});

test('EikConfig: .out: value pizza-box given', (t) => {
    t.equal(
        new EikConfig({
            ...validEikConfig,
            out: 'pizza-box',
        }).out,
        'pizza-box',
        'should be set to ./pizza-box',
    );
    t.end();
});

test('EikConfig: .out: value pizza-box/ given', (t) => {
    t.equal(
        new EikConfig({
            ...validEikConfig,
            out: 'pizza-box/',
        }).out,
        'pizza-box',
        'should have trailing slash removed',
    );
    t.end();
});

test('EikConfig: .out: value ./pizza-box given', (t) => {
    t.equal(
        new EikConfig({
            ...validEikConfig,
            out: './pizza-box',
        }).out,
        'pizza-box',
        'should have leading ./ slash removed',
    );
    t.end();
});
