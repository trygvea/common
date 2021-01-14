const { test } = require('tap');
const { join } = require('path');
const files = require('../../lib/helpers/files');

test('files: basic mapping dest path to file source', async (t) => {
    const cwd = join(__dirname, 'tmp');
    const path = join(cwd, '.eik');
    const src = join(__dirname, '../fixtures/client.js');
    const dest = join(path, './index.js');

    const map = await files({ './index.js': src }, path, { cwd });

    t.equal(map.get(src), dest, 'File source should point to destination');
});

test('files: error thrown when glob used with specific file mapping', async (t) => {
    const cwd = join(__dirname, 'tmp');
    const path = join(cwd, '.eik');
    const src = join(__dirname, './*.js');

    t.rejects(async () => files({ './index.js': src }, path, { cwd }));
});

test('files: matching dest path to file source', async (t) => {
    const cwd = join(__dirname, 'tmp');
    const path = join(cwd, '.eik');
    const src1 = join(__dirname, '../fixtures/client.js');
    const dest1 = join(path, './src/client.js');

    const map = await files({ './src': '../../fixtures/client.js' }, path, {
        cwd,
    });

    t.equal(map.get(src1), dest1, 'File source should point to destination');
});

test('files: matching dest path to file source', async (t) => {
    const cwd = join(__dirname, 'tmp');
    const path = join(cwd, '.eik');
    const src1 = join(__dirname, '../fixtures/client.js');
    const src2 = join(__dirname, '../fixtures/client-with-bare-imports.js');
    const dest1 = join(path, './src/client.js');
    const dest2 = join(path, './src/client-with-bare-imports.js');

    const map = await files({ './src': '../../fixtures/*.js' }, path, { cwd });

    t.equal(map.get(src1), dest1, 'File source should point to destination');
    t.equal(map.get(src2), dest2, 'File source should point to destination');
});

test('files: glob matching dest path to file source', async (t) => {
    const cwd = join(__dirname, 'tmp');
    const path = join(cwd, '.eik');
    const src1 = join(__dirname, '../fixtures/client.js');
    const src2 = join(__dirname, '../fixtures/client-with-bare-imports.js');
    const dest1 = join(path, './src/client.js');
    const dest2 = join(path, './src/client-with-bare-imports.js');

    const map = await files({ './src': '../../**/client*.js' }, path, { cwd });

    t.equal(map.get(src1), dest1, 'File source should point to destination');
    t.equal(map.get(src2), dest2, 'File source should point to destination');
});

test('files: glob matching dest path to file source, root path', async (t) => {
    const cwd = join(__dirname, 'tmp');
    const path = join(cwd, '.eik');
    const src1 = join(__dirname, '../fixtures/client.js');
    const src2 = join(__dirname, '../fixtures/client-with-bare-imports.js');
    const dest1 = join(path, './client.js');
    const dest2 = join(path, './client-with-bare-imports.js');

    const map = await files({ './': '../../**/client*.js' }, path, { cwd });

    t.equal(map.get(src1), dest1, 'File source should point to destination');
    t.equal(map.get(src2), dest2, 'File source should point to destination');
});

test('files: folder without *', async (t) => {
    const cwd = join(__dirname, 'tmp');
    const path = join(cwd, '.eik');
    const src = join(__dirname, '../fixtures/icons/checkbox-sprite.svg');
    const dest = join(path, './icons/checkbox-sprite.svg');

    const map = await files({ '/icons': '../../fixtures/icons/*' }, path, {
        cwd,
    });

    t.equal(map.get(src), dest, 'File source should point to destination');
});
