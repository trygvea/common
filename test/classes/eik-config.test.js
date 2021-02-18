const { test } = require('tap');
const { join } = require('path');
const FileMapping = require('../../lib/classes/file-mapping');
const LocalFileLocation = require('../../lib/classes/local-file-location');
const RemoteFileLocation = require('../../lib/classes/remote-file-location');
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
        ['http://server2', 'cupcakes'],
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

test('pathsAndFiles does not allow a single destination to have multiple sources', async (t) => {
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

test('pathsAndFilesAbsolute - files pathnames beginning with .', async (t) => {
    t.plan(4);
    const baseDir = join(__dirname, '..', 'fixtures');
    const config = new EikConfig(
        {
            ...validEikConfig,
            files: {
                'esm.css': './styles.css',
                'esm.js': './client.js',
                './nested': './nested/*.map',
                './': './*.map',
            },
        },
        null,
        baseDir,
    );
    const mapping = await config.pathsAndFilesAbsolute();
    t.equal(
        mapping.get(join(baseDir, 'styles.css')),
        join(baseDir, '.eik', 'esm.css'),
    );
    t.equal(
        mapping.get(join(baseDir, 'styles.css.map')),
        join(baseDir, '.eik', 'styles.css.map'),
    );
    t.equal(
        mapping.get(join(baseDir, 'client.js')),
        join(baseDir, '.eik', 'esm.js'),
    );
    t.equal(
        mapping.get(join(baseDir, 'client.js.map')),
        join(baseDir, '.eik', 'client.js.map'),
    );

    t.end();
});

test('pathsAndFilesAbsolute - throws for not existent directory paths', async (t) => {
    t.plan(1);
    const baseDir = join(__dirname, '..', 'fixtures');
    const config = new EikConfig(
        {
            ...validEikConfig,
            files: {
                '/': './does/not/exist/*.map',
            },
        },
        null,
        baseDir,
    );

    try {
        await config.pathsAndFilesAbsolute();
    } catch (err) {
        t.equals(
            err.message,
            "No files found for path: './does/not/exist/*.map'",
        );
    }

    t.end();
});

test('pathsAndFilesAbsolute - does not throw for directory glob pattern', async (t) => {
    t.plan(1);
    const baseDir = join(__dirname, '..', 'fixtures');
    const config = new EikConfig(
        {
            ...validEikConfig,
            files: {
                '/': './**/*.map',
            },
        },
        null,
        baseDir,
    );

    await config.pathsAndFilesAbsolute();
    t.ok(true);
    t.end();
});

test('pathsAndFilesAbsolute - glob should not flatten files', async (t) => {
    t.plan(1);
    const baseDir = join(__dirname, '..', 'fixtures');
    const config = new EikConfig(
        {
            ...validEikConfig,
            files: {
                '/': './**/*.map',
            },
        },
        null,
        baseDir,
    );

    const mapping = await config.pathsAndFilesAbsolute();

    t.equal(
        mapping.get(join(baseDir, 'nested/client.js.map')),
        join(baseDir, '.eik', 'nested/client.js.map'),
    );
    t.end();
});

test('mappings - directory given', async (t) => {
    const baseDir = join(__dirname, '..', 'fixtures');
    const config = new EikConfig(
        {
            ...validEikConfig,
            files: 'folder',
        },
        null,
        baseDir,
    );

    const mappings = await config.mappings();
    t.equal(mappings.length, 2);
    t.ok(mappings[0] instanceof FileMapping);
    t.ok(mappings[0].source instanceof LocalFileLocation);
    t.ok(mappings[0].destination instanceof RemoteFileLocation);
    t.equal(mappings[0].source.relative, 'folder/client.js');
    t.match(mappings[0].source.absolute, 'test/fixtures/folder/client.js');
    t.equal(mappings[0].destination.packagePathname, '/pkg/pizza/0.0.0');
    t.equal(mappings[0].destination.filePathname, '/client.js');
    t.equal(
        mappings[0].destination.url.href,
        'http://server/pkg/pizza/0.0.0/client.js',
    );
    t.equal(mappings[1].source.relative, 'folder/styles.css');
    t.match(mappings[1].source.absolute, 'test/fixtures/folder/styles.css');
    t.equal(mappings[1].destination.packagePathname, '/pkg/pizza/0.0.0');
    t.equal(mappings[1].destination.filePathname, '/styles.css');
    t.equal(
        mappings[1].destination.url.href,
        'http://server/pkg/pizza/0.0.0/styles.css',
    );
    t.end();
});

test('mappings - directory given - prefixed by ./', async (t) => {
    const baseDir = join(__dirname, '..', 'fixtures');
    const config = new EikConfig(
        {
            ...validEikConfig,
            files: './folder',
        },
        null,
        baseDir,
    );

    const mappings = await config.mappings();
    t.equal(mappings.length, 2);
    t.equal(mappings[0].source.relative, 'folder/client.js');
    t.match(mappings[0].source.absolute, 'test/fixtures/folder/client.js');
    t.equal(mappings[0].destination.packagePathname, '/pkg/pizza/0.0.0');
    t.equal(mappings[0].destination.filePathname, '/client.js');
    t.equal(
        mappings[0].destination.url.href,
        'http://server/pkg/pizza/0.0.0/client.js',
    );
    t.equal(mappings[1].source.relative, 'folder/styles.css');
    t.match(mappings[1].source.absolute, 'test/fixtures/folder/styles.css');
    t.equal(mappings[1].destination.packagePathname, '/pkg/pizza/0.0.0');
    t.equal(mappings[1].destination.filePathname, '/styles.css');
    t.equal(
        mappings[1].destination.url.href,
        'http://server/pkg/pizza/0.0.0/styles.css',
    );
    t.end();
});

test('mappings - directory given - trailing /', async (t) => {
    const baseDir = join(__dirname, '..', 'fixtures');
    const config = new EikConfig(
        {
            ...validEikConfig,
            files: 'folder/',
        },
        null,
        baseDir,
    );

    const mappings = await config.mappings();
    t.equal(mappings.length, 2);
    t.equal(mappings[0].source.relative, 'folder/client.js');
    t.match(mappings[0].source.absolute, 'test/fixtures/folder/client.js');
    t.equal(mappings[0].destination.packagePathname, '/pkg/pizza/0.0.0');
    t.equal(mappings[0].destination.filePathname, '/client.js');
    t.equal(
        mappings[0].destination.url.href,
        'http://server/pkg/pizza/0.0.0/client.js',
    );
    t.equal(mappings[1].source.relative, 'folder/styles.css');
    t.match(mappings[1].source.absolute, 'test/fixtures/folder/styles.css');
    t.equal(mappings[1].destination.packagePathname, '/pkg/pizza/0.0.0');
    t.equal(mappings[1].destination.filePathname, '/styles.css');
    t.equal(
        mappings[1].destination.url.href,
        'http://server/pkg/pizza/0.0.0/styles.css',
    );
    t.end();
});

test('mappings - directory given - prefixed by ./', async (t) => {
    const baseDir = join(__dirname, '..', 'fixtures');
    const config = new EikConfig(
        {
            ...validEikConfig,
            files: './folder',
        },
        null,
        baseDir,
    );

    const mappings = await config.mappings();
    t.equal(mappings.length, 2);
    t.equal(mappings[0].source.relative, 'folder/client.js');
    t.match(mappings[0].source.absolute, 'test/fixtures/folder/client.js');
    t.equal(mappings[0].destination.packagePathname, '/pkg/pizza/0.0.0');
    t.equal(mappings[0].destination.filePathname, '/client.js');
    t.equal(
        mappings[0].destination.url.href,
        'http://server/pkg/pizza/0.0.0/client.js',
    );
    t.equal(mappings[1].source.relative, 'folder/styles.css');
    t.match(mappings[1].source.absolute, 'test/fixtures/folder/styles.css');
    t.equal(mappings[1].destination.packagePathname, '/pkg/pizza/0.0.0');
    t.equal(mappings[1].destination.filePathname, '/styles.css');
    t.equal(
        mappings[1].destination.url.href,
        'http://server/pkg/pizza/0.0.0/styles.css',
    );
    t.end();
});

test('mappings - recursive glob given', async (t) => {
    const baseDir = join(__dirname, '..', 'fixtures');
    const config = new EikConfig(
        {
            ...validEikConfig,
            files: 'folder/**/*',
        },
        null,
        baseDir,
    );

    const mappings = await config.mappings();
    t.equal(mappings.length, 2);
    t.equal(mappings[0].source.relative, 'folder/client.js');
    t.match(mappings[0].source.absolute, 'test/fixtures/folder/client.js');
    t.equal(mappings[0].destination.packagePathname, '/pkg/pizza/0.0.0');
    t.equal(mappings[0].destination.filePathname, '/client.js');
    t.equal(
        mappings[0].destination.url.href,
        'http://server/pkg/pizza/0.0.0/client.js',
    );
    t.equal(mappings[1].source.relative, 'folder/styles.css');
    t.match(mappings[1].source.absolute, 'test/fixtures/folder/styles.css');
    t.equal(mappings[1].destination.packagePathname, '/pkg/pizza/0.0.0');
    t.equal(mappings[1].destination.filePathname, '/styles.css');
    t.equal(
        mappings[1].destination.url.href,
        'http://server/pkg/pizza/0.0.0/styles.css',
    );
    t.end();
});

test('mappings - file given', async (t) => {
    const baseDir = join(__dirname, '..', 'fixtures');
    const config = new EikConfig(
        {
            ...validEikConfig,
            files: 'folder/client.js',
        },
        null,
        baseDir,
    );

    const mappings = await config.mappings();
    t.equal(mappings.length, 1);
    t.equal(mappings[0].source.relative, 'folder/client.js');
    t.match(mappings[0].source.absolute, 'test/fixtures/folder/client.js');
    t.equal(mappings[0].destination.packagePathname, '/pkg/pizza/0.0.0');
    t.equal(mappings[0].destination.filePathname, '/client.js');
    t.equal(
        mappings[0].destination.url.href,
        'http://server/pkg/pizza/0.0.0/client.js',
    );
    t.end();
});

test('mappings - file given via glob', async (t) => {
    const baseDir = join(__dirname, '..', 'fixtures');
    const config = new EikConfig(
        {
            ...validEikConfig,
            files: 'folder/*.js',
        },
        null,
        baseDir,
    );

    const mappings = await config.mappings();
    t.equal(mappings.length, 1);
    t.equal(mappings[0].source.relative, 'folder/client.js');
    t.match(mappings[0].source.absolute, 'test/fixtures/folder/client.js');
    t.equal(mappings[0].destination.packagePathname, '/pkg/pizza/0.0.0');
    t.equal(mappings[0].destination.filePathname, '/client.js');
    t.equal(
        mappings[0].destination.url.href,
        'http://server/pkg/pizza/0.0.0/client.js',
    );
    t.end();
});

test('mappings - files given via glob - nested directories', async (t) => {
    const baseDir = join(__dirname, '..', 'fixtures');
    const config = new EikConfig(
        {
            ...validEikConfig,
            files: './**/*.js',
        },
        null,
        baseDir,
    );

    const mappings = await config.mappings();
    t.equal(mappings.length, 3);
    t.equal(
        mappings[0].destination.filePathname,
        '/client-with-bare-imports.js',
    );
    t.equal(mappings[1].destination.filePathname, '/client.js');
    t.equal(mappings[2].destination.filePathname, '/folder/client.js');

    t.end();
});

test('mappings - files is an object - remaps name of file', async (t) => {
    const baseDir = join(__dirname, '..', 'fixtures');
    const config = new EikConfig(
        {
            ...validEikConfig,
            files: {
                'script.js': 'folder/client.js',
            },
        },
        null,
        baseDir,
    );

    const mappings = await config.mappings();
    t.equal(mappings.length, 1);
    t.equal(mappings[0].source.relative, 'folder/client.js');
    t.match(mappings[0].source.absolute, 'test/fixtures/folder/client.js');
    t.equal(mappings[0].destination.packagePathname, '/pkg/pizza/0.0.0');
    t.equal(mappings[0].destination.filePathname, '/script.js');
    t.equal(
        mappings[0].destination.url.href,
        'http://server/pkg/pizza/0.0.0/script.js',
    );

    t.end();
});

test('mappings - files is an object - remaps name of file - absolute path to file given', async (t) => {
    const baseDir = join(__dirname, '..', 'fixtures');
    const config = new EikConfig(
        {
            ...validEikConfig,
            files: {
                'script.js': join(__dirname, '../fixtures/folder/client.js'),
            },
        },
        null,
        baseDir,
    );

    const mappings = await config.mappings();
    t.equal(mappings.length, 1);
    t.equal(mappings[0].source.relative, 'folder/client.js');
    t.match(mappings[0].source.absolute, 'test/fixtures/folder/client.js');
    t.equal(mappings[0].destination.packagePathname, '/pkg/pizza/0.0.0');
    t.equal(mappings[0].destination.filePathname, '/script.js');
    t.equal(
        mappings[0].destination.url.href,
        'http://server/pkg/pizza/0.0.0/script.js',
    );

    t.end();
});

test('mappings - files is an object - mapped to folder - absolute path to folder given', async (t) => {
    const baseDir = join(__dirname, '..', 'fixtures');
    const config = new EikConfig(
        {
            ...validEikConfig,
            files: {
                folder: join(__dirname, '../fixtures/folder'),
            },
        },
        null,
        baseDir,
    );

    const mappings = await config.mappings();
    t.equal(mappings.length, 2);
    t.equal(mappings[0].source.relative, 'folder/client.js');
    t.match(mappings[0].source.absolute, 'test/fixtures/folder/client.js');
    t.equal(mappings[0].destination.packagePathname, '/pkg/pizza/0.0.0');
    t.equal(mappings[0].destination.filePathname, '/folder/client.js');
    t.equal(
        mappings[0].destination.url.href,
        'http://server/pkg/pizza/0.0.0/folder/client.js',
    );
    t.equal(mappings[1].source.relative, 'folder/styles.css');
    t.match(mappings[1].source.absolute, 'test/fixtures/folder/styles.css');
    t.equal(mappings[1].destination.packagePathname, '/pkg/pizza/0.0.0');
    t.equal(mappings[1].destination.filePathname, '/folder/styles.css');
    t.equal(
        mappings[1].destination.url.href,
        'http://server/pkg/pizza/0.0.0/folder/styles.css',
    );

    t.end();
});

test('mappings - files is an object - mapped to folder - relative path to folder given', async (t) => {
    const baseDir = join(__dirname, '..', 'fixtures');
    const config = new EikConfig(
        {
            ...validEikConfig,
            files: {
                folder: './folder',
            },
        },
        null,
        baseDir,
    );

    const mappings = await config.mappings();
    t.equal(mappings.length, 2);
    t.equal(mappings[0].source.relative, 'folder/client.js');
    t.match(mappings[0].source.absolute, 'test/fixtures/folder/client.js');
    t.equal(mappings[0].destination.packagePathname, '/pkg/pizza/0.0.0');
    t.equal(mappings[0].destination.filePathname, '/folder/client.js');
    t.equal(
        mappings[0].destination.url.href,
        'http://server/pkg/pizza/0.0.0/folder/client.js',
    );
    t.equal(mappings[1].source.relative, 'folder/styles.css');
    t.match(mappings[1].source.absolute, 'test/fixtures/folder/styles.css');
    t.equal(mappings[1].destination.packagePathname, '/pkg/pizza/0.0.0');
    t.equal(mappings[1].destination.filePathname, '/folder/styles.css');
    t.equal(
        mappings[1].destination.url.href,
        'http://server/pkg/pizza/0.0.0/folder/styles.css',
    );

    t.end();
});

test('mappings - files is an object - mapped to folder - relative path to folder given - no leading . in path', async (t) => {
    const baseDir = join(__dirname, '..', 'fixtures');
    const config = new EikConfig(
        {
            ...validEikConfig,
            files: {
                folder: 'folder',
            },
        },
        null,
        baseDir,
    );

    const mappings = await config.mappings();
    t.equal(mappings.length, 2);
    t.equal(mappings[0].source.relative, 'folder/client.js');
    t.match(mappings[0].source.absolute, 'test/fixtures/folder/client.js');
    t.equal(mappings[0].destination.packagePathname, '/pkg/pizza/0.0.0');
    t.equal(mappings[0].destination.filePathname, '/folder/client.js');
    t.equal(
        mappings[0].destination.url.href,
        'http://server/pkg/pizza/0.0.0/folder/client.js',
    );
    t.equal(mappings[1].source.relative, 'folder/styles.css');
    t.match(mappings[1].source.absolute, 'test/fixtures/folder/styles.css');
    t.equal(mappings[1].destination.packagePathname, '/pkg/pizza/0.0.0');
    t.equal(mappings[1].destination.filePathname, '/folder/styles.css');
    t.equal(
        mappings[1].destination.url.href,
        'http://server/pkg/pizza/0.0.0/folder/styles.css',
    );

    t.end();
});

test('mappings - files is an object - mapped to folder glob', async (t) => {
    const baseDir = join(__dirname, '..', 'fixtures');
    const config = new EikConfig(
        {
            ...validEikConfig,
            files: {
                folder: 'folder/**/*',
            },
        },
        null,
        baseDir,
    );

    const mappings = await config.mappings();
    t.equal(mappings.length, 2);
    t.equal(mappings[0].source.relative, 'folder/client.js');
    t.match(mappings[0].source.absolute, 'test/fixtures/folder/client.js');
    t.equal(mappings[0].destination.packagePathname, '/pkg/pizza/0.0.0');
    t.equal(mappings[0].destination.filePathname, '/folder/client.js');
    t.equal(
        mappings[0].destination.url.href,
        'http://server/pkg/pizza/0.0.0/folder/client.js',
    );
    t.equal(mappings[1].source.relative, 'folder/styles.css');
    t.match(mappings[1].source.absolute, 'test/fixtures/folder/styles.css');
    t.equal(mappings[1].destination.packagePathname, '/pkg/pizza/0.0.0');
    t.equal(mappings[1].destination.filePathname, '/folder/styles.css');
    t.equal(
        mappings[1].destination.url.href,
        'http://server/pkg/pizza/0.0.0/folder/styles.css',
    );

    t.end();
});

test('mappings - files is an object - mapped to folder glob - no folder recursion', async (t) => {
    const baseDir = join(__dirname, '..', 'fixtures');
    const config = new EikConfig(
        {
            ...validEikConfig,
            files: {
                folder: '*',
            },
        },
        null,
        baseDir,
    );

    const mappings = await config.mappings();
    t.equal(mappings.length, 5);
    t.end();
});

test('mappings - files is an object - mapped to nested folder', async (t) => {
    const baseDir = join(__dirname, '..', 'fixtures');
    const config = new EikConfig(
        {
            ...validEikConfig,
            files: {
                'path/to/folder': 'folder',
            },
        },
        null,
        baseDir,
    );

    const mappings = await config.mappings();
    t.equal(mappings.length, 2);
    t.equal(mappings[0].source.relative, 'folder/client.js');
    t.match(mappings[0].source.absolute, 'test/fixtures/folder/client.js');
    t.equal(mappings[0].destination.packagePathname, '/pkg/pizza/0.0.0');
    t.equal(mappings[0].destination.filePathname, '/path/to/folder/client.js');
    t.equal(
        mappings[0].destination.url.href,
        'http://server/pkg/pizza/0.0.0/path/to/folder/client.js',
    );
    t.equal(mappings[1].source.relative, 'folder/styles.css');
    t.match(mappings[1].source.absolute, 'test/fixtures/folder/styles.css');
    t.equal(mappings[1].destination.packagePathname, '/pkg/pizza/0.0.0');
    t.equal(mappings[1].destination.filePathname, '/path/to/folder/styles.css');
    t.equal(
        mappings[1].destination.url.href,
        'http://server/pkg/pizza/0.0.0/path/to/folder/styles.css',
    );

    t.end();
});
