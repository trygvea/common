const { test } = require('tap');
const { join } = require('path');
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

test('cwd property', (t) => {
    const config = new EikConfig({}, null, 'pizza shop');
    t.equal(config.cwd, 'pizza shop');
    t.end();
});

test('pathsAndFiles returns expected contents', async (t) => {
    const config = new EikConfig(
        {
            files: {
                'bakery road': 'pac*age.json',
                'cake road': 'renov*.json',
            },
        },
        null,
        process.cwd(),
    );
    const list = await config.pathsAndFiles();
    t.deepEqual(list, [
        ['bakery road', 'package.json'],
        ['cake road', 'renovate.json'],
    ]);
    t.end();
});

test('pathsAndFiles handles invalid globs', async (t) => {
    t.plan(1);
    const config = new EikConfig(
        {
            files: {
                'bakery road': 'ch*colate.cookie',
                'cake road': 'renov*.json',
            },
        },
        null,
        process.cwd(),
    );
    try {
        await config.pathsAndFiles();
    } catch (e) {
        t.equal(e.message, "No files found for path: 'ch*colate.cookie'");
    }

    t.end();
});

test('pathsAndFiles does not allow a destination to have multiple sources', async (t) => {
    t.plan(1);
    const config = new EikConfig(
        { files: { 'sweet.json': '*.json' } },
        null,
        process.cwd(),
    );
    try {
        await config.pathsAndFiles();
    } catch (e) {
        t.equal(
            e.message,
            "Cannot specify a single file destination for multiple source files. See 'sweet.json'",
        );
    }

    t.end();
});

test('pathsAndFilesAbsolute returns absolute paths on the file system', async (t) => {
    t.plan(1);
    const baseDir = join(__dirname, '..', 'fixtures');
    const config = new EikConfig(
        { files: { 'client.js': 'client.js' } },
        null,
        baseDir,
    );
    const mapping = await config.pathsAndFilesAbsolute();
    const src = join(baseDir, 'client.js');
    const dest = join(baseDir, '.eik', 'client.js');
    t.equal(mapping.get(src), dest);

    t.end();
});
