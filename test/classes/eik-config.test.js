const { test } = require('tap');
const EikConfig = require('../../lib/classes/eik-config');

test('basic config properties', (t) => {
    const config = new EikConfig({
        name: 'pizza',
        files: 'secret receipe',
        version: 'deep dish',
        'import-map': 'cheese from italy',
    });
    t.equal(config.name, 'pizza');
    t.equal(config.files, 'secret receipe');
    t.equal(config.version, 'deep dish');
    t.equal(config.map, 'cheese from italy');
    t.end();
});

test('out property', (t) => {
    t.equal(new EikConfig({}).out, '.eik', 'defaults to .eik');
    t.equal(new EikConfig({ out: 'pizza box' }).out, 'pizza box');
    t.end();
});

test('no token or server configured', (t) => {
    const config = new EikConfig({}, null);
    t.same(config.server, null);
    t.same(config.token, null);
    t.end();
});

test('single token present', (t) => {
    const config = new EikConfig({}, [['bakery', 'muffins']]);
    t.equal(config.server, 'bakery');
    t.equal(config.token, 'muffins');
    t.end();
});

test('multiple tokens present', (t) => {
    const config = new EikConfig({}, [['bakery', 'muffins'], []]);
    t.equal(config.server, 'bakery');
    t.equal(config.token, 'muffins');
    t.end();
});

test('server configured explicitly', (t) => {
    const config = new EikConfig({ server: 'pie shop' }, [
        ['bakery', 'muffins'],
        ['pie shop', 'kumara pie'],
    ]);
    t.equal(config.server, 'pie shop');
    t.equal(config.token, 'kumara pie');
    t.end();
});
