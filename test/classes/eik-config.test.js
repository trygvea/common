const { test } = require('tap');
const { join } = require('path');
const EikConfig = require('../../lib/classes/eik-config');

const validEikConfig = {
    name: 'pizza',
    server: 'http://server',
    files: { '/': 'pizza' },
    version: '0.0.0',
};

test('basic config properties', (t) => {
    const config = new EikConfig(validEikConfig);
    t.equal(config.name, 'pizza');
    t.same(config.files, { '/': 'pizza' });
    t.equal(config.version, '0.0.0');
    t.end();
});

test('map property', (t) => {
    let config = new EikConfig({
        ...validEikConfig,
        'import-map': 'http://map',
    });
    t.deepEqual(config.map, ['http://map']);

    config = new EikConfig({
        ...validEikConfig,
        'import-map': ['http://map', 'http://map'],
    });
    t.deepEqual(config.map, ['http://map', 'http://map']);
    t.end();
});

test('out property', (t) => {
    t.equal(new EikConfig(validEikConfig).out, '.eik', 'defaults to .eik');
    t.equal(
        new EikConfig({
            ...validEikConfig,
            out: './pizza-box',
        }).out,
        './pizza-box',
    );
    t.end();
});

test('no token configured', (t) => {
    const config = new EikConfig(validEikConfig, null);
    t.same(config.token, null);
    t.end();
});

test('single token present', (t) => {
    const config = new EikConfig(validEikConfig, [
        ['http://server', 'muffins'],
    ]);
    t.equal(config.server, 'http://server');
    t.equal(config.token, 'muffins');
    t.end();
});

test('multiple tokens present', (t) => {
    const config = new EikConfig(validEikConfig, [
        ['http://server', 'muffins'],
        [],
    ]);
    t.equal(config.server, 'http://server');
    t.equal(config.token, 'muffins');
    t.end();
});

test('server configured explicitly', (t) => {
    const config = new EikConfig(validEikConfig, [
        ['bakery', 'muffins'],
        ['http://server', 'kumara pie'],
    ]);
    t.equal(config.server, 'http://server');
    t.equal(config.token, 'kumara pie');
    t.end();
});

test('cwd property', (t) => {
    const config = new EikConfig(validEikConfig, null, 'pizza shop');
    t.equal(config.cwd, 'pizza shop');
    t.end();
});

test('setting the version', (t) => {
    const config = new EikConfig(validEikConfig);
    config.version = '0.0.1';
    t.equal(config.version, '0.0.1');
    t.end();
});

test('getting the type - default value', (t) => {
    const config = new EikConfig(validEikConfig);
    t.equal(config.type, 'package');
    t.end();
});

test('pathsAndFiles returns expected contents', async (t) => {
    const config = new EikConfig(
        {
            ...validEikConfig,
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
            ...validEikConfig,
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
        {
            ...validEikConfig,
            files: { 'sweet.json': '*.json' },
        },
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
        {
            ...validEikConfig,
            files: { 'client.js': 'client.js' },
        },
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
        {
            ...validEikConfig,
            files: { 'client.js': join(baseDir, '/client.js') },
        },
        null,
        baseDir,
    );
    const mapping = await config.pathsAndFilesAbsolute();
    const src = join(baseDir, 'client.js');
    const dest = join(baseDir, '.eik', 'client.js');
    t.equal(mapping.get(src), dest);

    t.end();
});
