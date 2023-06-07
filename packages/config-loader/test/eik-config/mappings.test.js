const { test } = require('tap');
const { join } = require('path');

const EikConfig = require('../../src/eik-config.js');
const FileMapping = require('../../src/classes/file-mapping.js');
const LocalFileLocation = require('../../src/classes/local-file-location.js');
const RemoteFileLocation = require('../../src/classes/remote-file-location.js');

const validEikConfig = {
    name: 'pizza',
    server: 'http://server',
    files: { '/': 'pizza' },
    version: '0.0.0',
};

const baseDir = join(__dirname, '../../../../fixtures');

test('mappings - directory given', async (t) => {
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
    t.equal(mappings[0].source.relative, 'styles.css');
    t.match(mappings[0].source.absolute, 'fixtures/folder/styles.css');
    t.equal(mappings[0].destination.packagePathname, '/pkg/pizza/0.0.0');
    t.equal(mappings[0].destination.filePathname, '/styles.css');
    t.equal(
        mappings[0].destination.url.href,
        'http://server/pkg/pizza/0.0.0/styles.css',
    );
    t.ok(mappings[1] instanceof FileMapping);
    t.ok(mappings[1].source instanceof LocalFileLocation);
    t.ok(mappings[1].destination instanceof RemoteFileLocation);
    t.equal(mappings[1].source.relative, 'client.js');
    t.match(mappings[1].source.basePath, 'fixtures/folder');
    t.notMatch(mappings[1].source.basePath, 'client.js');
    t.match(mappings[1].source.absolute, 'fixtures/folder/client.js');
    t.equal(mappings[1].destination.packagePathname, '/pkg/pizza/0.0.0');
    t.equal(mappings[1].destination.filePathname, '/client.js');
    t.equal(
        mappings[1].destination.url.href,
        'http://server/pkg/pizza/0.0.0/client.js',
    );
    t.end();
});

test('mappings - directory given - prefixed by ./', async (t) => {
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
    t.equal(mappings[0].source.relative, 'styles.css');
    t.match(mappings[0].source.absolute, 'fixtures/folder/styles.css');
    t.equal(mappings[0].destination.packagePathname, '/pkg/pizza/0.0.0');
    t.equal(mappings[0].destination.filePathname, '/styles.css');
    t.equal(
        mappings[0].destination.url.href,
        'http://server/pkg/pizza/0.0.0/styles.css',
    );
    t.equal(mappings[1].source.relative, 'client.js');
    t.match(mappings[1].source.absolute, 'fixtures/folder/client.js');
    t.equal(mappings[1].destination.packagePathname, '/pkg/pizza/0.0.0');
    t.equal(mappings[1].destination.filePathname, '/client.js');
    t.equal(
        mappings[1].destination.url.href,
        'http://server/pkg/pizza/0.0.0/client.js',
    );
    t.end();
});

test('mappings - directory given - trailing /', async (t) => {
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
    t.equal(mappings[0].source.relative, 'styles.css');
    t.match(mappings[0].source.absolute, 'fixtures/folder/styles.css');
    t.equal(mappings[0].destination.packagePathname, '/pkg/pizza/0.0.0');
    t.equal(mappings[0].destination.filePathname, '/styles.css');
    t.equal(
        mappings[0].destination.url.href,
        'http://server/pkg/pizza/0.0.0/styles.css',
    );
    t.equal(mappings[1].source.relative, 'client.js');
    t.match(mappings[1].source.absolute, 'fixtures/folder/client.js');
    t.equal(mappings[1].destination.packagePathname, '/pkg/pizza/0.0.0');
    t.equal(mappings[1].destination.filePathname, '/client.js');
    t.equal(
        mappings[1].destination.url.href,
        'http://server/pkg/pizza/0.0.0/client.js',
    );
    t.end();
});

test('mappings - directory given - prefixed by ./', async (t) => {
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
    t.equal(mappings[0].source.relative, 'styles.css');
    t.match(mappings[0].source.absolute, 'fixtures/folder/styles.css');
    t.equal(mappings[0].destination.packagePathname, '/pkg/pizza/0.0.0');
    t.equal(mappings[0].destination.filePathname, '/styles.css');
    t.equal(
        mappings[0].destination.url.href,
        'http://server/pkg/pizza/0.0.0/styles.css',
    );
    t.equal(mappings[1].source.relative, 'client.js');
    t.match(mappings[1].source.absolute, 'fixtures/folder/client.js');
    t.equal(mappings[1].destination.packagePathname, '/pkg/pizza/0.0.0');
    t.equal(mappings[1].destination.filePathname, '/client.js');
    t.equal(
        mappings[1].destination.url.href,
        'http://server/pkg/pizza/0.0.0/client.js',
    );
    t.end();
});

test('mappings - recursive glob given', async (t) => {
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
    t.equal(mappings[0].source.relative, 'styles.css');
    t.match(mappings[0].source.absolute, 'fixtures/folder/styles.css');
    t.equal(mappings[0].destination.packagePathname, '/pkg/pizza/0.0.0');
    t.equal(mappings[0].destination.filePathname, '/styles.css');
    t.equal(
        mappings[0].destination.url.href,
        'http://server/pkg/pizza/0.0.0/styles.css',
    );
    t.equal(mappings[1].source.relative, 'client.js');
    t.match(mappings[1].source.absolute, 'fixtures/folder/client.js');
    t.equal(mappings[1].destination.packagePathname, '/pkg/pizza/0.0.0');
    t.equal(mappings[1].destination.filePathname, '/client.js');
    t.equal(
        mappings[1].destination.url.href,
        'http://server/pkg/pizza/0.0.0/client.js',
    );
    t.end();
});

test('mappings - file given', async (t) => {
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
    t.equal(mappings[0].source.relative, 'client.js');
    t.match(mappings[0].source.absolute, 'fixtures/folder/client.js');
    t.equal(mappings[0].destination.packagePathname, '/pkg/pizza/0.0.0');
    t.equal(mappings[0].destination.filePathname, '/client.js');
    t.equal(
        mappings[0].destination.url.href,
        'http://server/pkg/pizza/0.0.0/client.js',
    );
    t.end();
});

test('mappings - file given via glob', async (t) => {
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
    t.equal(mappings[0].source.relative, 'client.js');
    t.match(mappings[0].source.absolute, 'fixtures/folder/client.js');
    t.equal(mappings[0].destination.packagePathname, '/pkg/pizza/0.0.0');
    t.equal(mappings[0].destination.filePathname, '/client.js');
    t.equal(
        mappings[0].destination.url.href,
        'http://server/pkg/pizza/0.0.0/client.js',
    );
    t.end();
});

test('mappings - files given via glob - nested directories', async (t) => {
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
    t.equal(mappings[0].source.relative, 'client.js');
    t.equal(mappings[1].source.relative, 'client-with-bare-imports.js');
    t.equal(mappings[2].source.relative, 'folder/client.js');
    t.equal(mappings[0].destination.filePathname, '/client.js');
    t.equal(
        mappings[1].destination.filePathname,
        '/client-with-bare-imports.js',
    );
    t.equal(mappings[2].destination.filePathname, '/folder/client.js');

    t.end();
});

test('mappings - files is an object - remaps name of file', async (t) => {
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
    t.equal(mappings[0].source.relative, 'client.js');
    t.match(mappings[0].source.absolute, 'fixtures/folder/client.js');
    t.equal(mappings[0].destination.packagePathname, '/pkg/pizza/0.0.0');
    t.equal(mappings[0].destination.filePathname, '/script.js');
    t.equal(
        mappings[0].destination.url.href,
        'http://server/pkg/pizza/0.0.0/script.js',
    );

    t.end();
});

test('mappings - files is an object - remaps name of file - absolute path to file given', async (t) => {
    const config = new EikConfig(
        {
            ...validEikConfig,
            files: {
                'script.js': join(baseDir, 'folder/client.js'),
            },
        },
        null,
        baseDir,
    );

    const mappings = await config.mappings();
    t.equal(mappings.length, 1);
    t.equal(mappings[0].source.relative, 'client.js');
    t.match(mappings[0].source.absolute, 'fixtures/folder/client.js');
    t.equal(mappings[0].destination.packagePathname, '/pkg/pizza/0.0.0');
    t.equal(mappings[0].destination.filePathname, '/script.js');
    t.equal(
        mappings[0].destination.url.href,
        'http://server/pkg/pizza/0.0.0/script.js',
    );

    t.end();
});

test('mappings - files is an object - mapped to folder - absolute path to folder given', async (t) => {
    const config = new EikConfig(
        {
            ...validEikConfig,
            files: {
                folder: join(baseDir, 'folder'),
            },
        },
        null,
        baseDir,
    );

    const mappings = await config.mappings();
    t.equal(mappings.length, 2);
    t.equal(mappings[0].source.relative, 'styles.css');
    t.match(mappings[0].source.absolute, 'fixtures/folder/styles.css');
    t.equal(mappings[0].destination.packagePathname, '/pkg/pizza/0.0.0');
    t.equal(mappings[0].destination.filePathname, '/folder/styles.css');
    t.equal(
        mappings[0].destination.url.href,
        'http://server/pkg/pizza/0.0.0/folder/styles.css',
    );
    t.equal(mappings[1].source.relative, 'client.js');
    t.match(mappings[1].source.absolute, 'fixtures/folder/client.js');
    t.equal(mappings[1].destination.packagePathname, '/pkg/pizza/0.0.0');
    t.equal(mappings[1].destination.filePathname, '/folder/client.js');
    t.equal(
        mappings[1].destination.url.href,
        'http://server/pkg/pizza/0.0.0/folder/client.js',
    );

    t.end();
});

test('mappings - files is an object - mapped to folder - relative path to folder given', async (t) => {
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
    t.equal(mappings[0].source.relative, 'styles.css');
    t.match(mappings[0].source.absolute, 'fixtures/folder/styles.css');
    t.equal(mappings[0].destination.packagePathname, '/pkg/pizza/0.0.0');
    t.equal(mappings[0].destination.filePathname, '/folder/styles.css');
    t.equal(
        mappings[0].destination.url.href,
        'http://server/pkg/pizza/0.0.0/folder/styles.css',
    );
    t.equal(mappings[1].source.relative, 'client.js');
    t.match(mappings[1].source.absolute, 'fixtures/folder/client.js');
    t.equal(mappings[1].destination.packagePathname, '/pkg/pizza/0.0.0');
    t.equal(mappings[1].destination.filePathname, '/folder/client.js');
    t.equal(
        mappings[1].destination.url.href,
        'http://server/pkg/pizza/0.0.0/folder/client.js',
    );

    t.end();
});

test('mappings - files is an object - mapped to folder - relative path to folder given - no leading . in path', async (t) => {
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
    t.equal(mappings[0].source.relative, 'styles.css');
    t.match(mappings[0].source.absolute, 'fixtures/folder/styles.css');
    t.equal(mappings[0].destination.packagePathname, '/pkg/pizza/0.0.0');
    t.equal(mappings[0].destination.filePathname, '/folder/styles.css');
    t.equal(
        mappings[0].destination.url.href,
        'http://server/pkg/pizza/0.0.0/folder/styles.css',
    );    
    t.equal(mappings[1].source.relative, 'client.js');
    t.match(mappings[1].source.absolute, 'fixtures/folder/client.js');
    t.equal(mappings[1].destination.packagePathname, '/pkg/pizza/0.0.0');
    t.equal(mappings[1].destination.filePathname, '/folder/client.js');
    t.equal(
        mappings[1].destination.url.href,
        'http://server/pkg/pizza/0.0.0/folder/client.js',
    );

    t.end();
});

test('mappings - files is an object - mapped to folder glob', async (t) => {
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
    t.equal(mappings[0].source.relative, 'styles.css');
    t.match(mappings[0].source.absolute, 'fixtures/folder/styles.css');
    t.equal(mappings[0].destination.packagePathname, '/pkg/pizza/0.0.0');
    t.equal(mappings[0].destination.filePathname, '/folder/styles.css');
    t.equal(
        mappings[0].destination.url.href,
        'http://server/pkg/pizza/0.0.0/folder/styles.css',
    );
    t.equal(mappings[1].source.relative, 'client.js');
    t.match(mappings[1].source.absolute, 'fixtures/folder/client.js');
    t.equal(mappings[1].destination.packagePathname, '/pkg/pizza/0.0.0');
    t.equal(mappings[1].destination.filePathname, '/folder/client.js');
    t.equal(
        mappings[1].destination.url.href,
        'http://server/pkg/pizza/0.0.0/folder/client.js',
    );

    t.end();
});

test('mappings - files is an object - mapped to folder glob - no folder recursion', async (t) => {
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
    t.equal(mappings[0].source.relative, 'styles.css');
    t.match(mappings[0].source.absolute, 'fixtures/folder/styles.css');
    t.equal(mappings[0].destination.packagePathname, '/pkg/pizza/0.0.0');
    t.equal(mappings[0].destination.filePathname, '/path/to/folder/styles.css');
    t.equal(
        mappings[0].destination.url.href,
        'http://server/pkg/pizza/0.0.0/path/to/folder/styles.css',
    );
    t.equal(mappings[1].source.relative, 'client.js');
    t.match(mappings[1].source.absolute, 'fixtures/folder/client.js');
    t.equal(mappings[1].destination.packagePathname, '/pkg/pizza/0.0.0');
    t.equal(mappings[1].destination.filePathname, '/path/to/folder/client.js');
    t.equal(
        mappings[1].destination.url.href,
        'http://server/pkg/pizza/0.0.0/path/to/folder/client.js',
    );

    t.end();
});

test('mappings - files is an object - mapped to folder - absolute path to folder given - non matching cwd', async (t) => {
    const config = new EikConfig(
        {
            ...validEikConfig,
            files: {
                folder: join(baseDir, 'folder'),
            },
        },
        null,
        process.cwd(),
    );

    const mappings = await config.mappings();
    t.equal(mappings[0].source.relative, 'styles.css');
    t.match(mappings[0].source.absolute, 'fixtures/folder/styles.css');
    t.equal(mappings[0].destination.packagePathname, '/pkg/pizza/0.0.0');
    t.equal(mappings[0].destination.filePathname, '/folder/styles.css');

    t.end();
});
