const { test } = require('tap');
const { join } = require('path');
const EikConfig = require('../../lib/classes/eik-config');

test('basic config properties', (t) => {
    const config = new EikConfig({
        name: 'pizza',
        files: 'secret receipe',
        version: 'deep dish',
    });
    t.equal(config.name, 'pizza');
    t.equal(config.files, 'secret receipe');
    t.equal(config.version, 'deep dish');
    t.end();
});

test('map property', (t) => {
    let config = new EikConfig({ 'import-map': 'cheese from italy' });
    t.deepEqual(config.map, ['cheese from italy']);

    config = new EikConfig({ 'import-map': ['gouda', 'mozzarella'] });
    t.deepEqual(config.map, ['gouda', 'mozzarella']);
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

test('setting the version', (t) => {
    const config = new EikConfig({});
    config.version = 'big cheese';
    t.equal(config.version, 'big cheese');
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
        [
            'bakery road/package.json',
            'package.json',
            'bakery road',
            'pac*age.json',
        ],
        [
            'cake road/renovate.json',
            'renovate.json',
            'cake road',
            'renov*.json',
        ],
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

test('pathsAndFilesAbsolute handles files which are already absolute', async (t) => {
    t.plan(1);
    const baseDir = join(__dirname, '..', 'fixtures');
    const config = new EikConfig(
        { files: { 'client.js': join(baseDir, '/client.js') } },
        null,
        baseDir,
    );
    const mapping = await config.pathsAndFilesAbsolute();
    const src = join(baseDir, 'client.js');
    const dest = join(baseDir, '.eik', 'client.js');
    t.equal(mapping.get(src), dest);

    t.end();
});
