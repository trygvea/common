const fs = require('fs');
const os = require('os');
const { join, basename } = require('path');
const tap = require('tap');
const resolveFiles = require('../src/internal/resolve-files.js');

// then integrate the resolve-files function into eik-config.

// fix all tests

// then publish a PR and integrate into cli

const fixturesPath = join(__dirname, '../../../fixtures');

tap.test('when source is a relative folder', async (t) => {
    const resolved = await resolveFiles({ '/': './folder' }, fixturesPath);
    t.equal(resolved[0].destination, '/', 'destination should be unchanged');
    t.equal(resolved[0].source, './folder', 'source should be unchanged');
    t.match(
        resolved[0].basePath,
        'fixtures/folder',
        'basePath should exclude glob',
    );
    t.equal(resolved[0].pattern, '**/*', 'pattern should exclude basePath');
});

tap.test(
    'when source is a relative folder and files iterator is accessed',
    async (t) => {
        t.plan(6);
        const resolved = await resolveFiles(
            { '/': 'folder/**/*' },
            fixturesPath,
        );
        for (const file of resolved[0]) {
            t.equal(
                file.constructor.name,
                'LocalFileLocation',
                `${file.relative} wrapped in LocalFileLocation object`,
            );
        }
        const asArray = Array.from(resolved[0]);
        const { relative, absolute, basePath } = asArray[0];
        t.equal(
            relative,
            'client.js',
            '.relative should not include .basePath',
        );
        t.equal(
            absolute,
            join(basePath, relative),
            '.absolute should include .basePath and .relative',
        );
        t.match(
            basePath,
            'fixtures/folder',
            '.basePath should include everything except .relative',
        );
        t.notMatch(
            basePath,
            'client.js',
            '.basePath should include everything except .relative',
        );
    },
);

tap.test('when source is a relative file', async (t) => {
    const resolved = await resolveFiles(
        { '/': './folder/client.js' },
        fixturesPath,
    );
    t.match(
        resolved[0].basePath,
        'fixtures/folder',
        'basePath should exclude glob',
    );
    t.equal(
        resolved[0].pattern,
        'client.js',
        'pattern should exclude basePath',
    );
});

tap.test('when source is a relative folder with glob', async (t) => {
    const resolved = await resolveFiles({ '/': './folder/**/*' }, fixturesPath);
    t.match(
        resolved[0].basePath,
        'fixtures/folder',
        'basePath should exclude glob',
    );
    t.equal(resolved[0].pattern, '**/*', 'pattern should exclude basePath');
});

tap.test(
    'when source is a relative folder with glob and nested files',
    async (t) => {
        const resolved = await resolveFiles({ '/': './**/*.js' }, fixturesPath);
        t.match(
            resolved[0].basePath,
            'fixtures',
            'basePath should exclude glob',
        );
        t.equal(
            resolved[0].pattern,
            '**/*.js',
            'pattern should exclude basePath',
        );
        t.equal(Array.from(resolved[0])[2].relative, 'folder/client.js');
    },
);

tap.test('when source is an absolute folder', async (t) => {
    const resolved = await resolveFiles(
        { '/': join(fixturesPath, 'folder') },
        fixturesPath,
    );
    t.match(
        resolved[0].basePath,
        'fixtures/folder',
        'basePath should exclude glob',
    );
    t.equal(resolved[0].pattern, '**/*', 'pattern should exclude basePath');
});

tap.test('when source is an absolute file', async (t) => {
    const resolved = await resolveFiles(
        { '/': join(fixturesPath, 'folder/client.js') },
        fixturesPath,
    );
    t.match(
        resolved[0].basePath,
        'fixtures/folder',
        'basePath should exclude glob',
    );
    t.match(
        resolved[0].pattern,
        'client.js',
        'pattern should exclude basePath',
    );
});

tap.test('when source is an absolute folder with glob', async (t) => {
    const resolved = await resolveFiles(
        { '/': join(fixturesPath, 'folder/**/*') },
        fixturesPath,
    );
    t.match(
        resolved[0].basePath,
        'fixtures/folder',
        'basePath should exclude glob',
    );
    t.equal(resolved[0].pattern, '**/*', 'pattern should exclude basePath');
});

tap.test(
    'when source is an absolute folder and cwd is a different directory entirely',
    async (t) => {
        const cwd = await fs.mkdtempSync(
            join(os.tmpdir(), basename(__filename)),
        );
        const resolved = await resolveFiles(
            { '/': join(fixturesPath, 'folder') },
            cwd,
        );
        t.match(
            resolved[0].basePath,
            'fixtures/folder',
            'basePath should exclude glob',
        );
        t.equal(resolved[0].pattern, '**/*', 'pattern should exclude basePath');
    },
);

tap.test(
    'when source is an absolute folder and files iterator is accessed',
    async (t) => {
        t.plan(6);
        const bPath = await fs.mkdtempSync(
            join(os.tmpdir(), basename(__filename)),
        );
        const resolved = await resolveFiles(
            { '/': join(fixturesPath, 'folder') },
            bPath,
        );
        for (const file of resolved[0]) {
            t.equal(
                file.constructor.name,
                'LocalFileLocation',
                `${file.relative} wrapped in LocalFileLocation object`,
            );
        }
        const asArray = Array.from(resolved[0]);
        const { relative, absolute, basePath } = asArray[0];
        t.equal(
            relative,
            'client.js',
            '.relative should not include .basePath',
        );
        t.equal(
            absolute,
            join(basePath, relative),
            '.absolute should include .basePath and .relative',
        );
        t.match(
            basePath,
            'fixtures/folder',
            '.basePath should include everything except .relative',
        );
        t.notMatch(
            basePath,
            'client.js',
            '.basePath should include everything except .relative',
        );
    },
);

tap.test(
    'when source is an absolute file and cwd is a different directory entirely',
    async (t) => {
        const cwd = await fs.mkdtempSync(
            join(os.tmpdir(), basename(__filename)),
        );
        const resolved = await resolveFiles(
            { '/': join(fixturesPath, 'folder/client.js') },
            cwd,
        );
        t.match(
            resolved[0].basePath,
            'fixtures/folder',
            'basePath should exclude glob',
        );
        t.equal(
            resolved[0].pattern,
            'client.js',
            'pattern should exclude basePath',
        );
    },
);

tap.test(
    'when source is an absolute folder with glob and cwd is a different directory entirely',
    async (t) => {
        const cwd = await fs.mkdtempSync(
            join(os.tmpdir(), basename(__filename)),
        );
        const resolved = await resolveFiles(
            { '/': join(fixturesPath, 'folder/**/*') },
            cwd,
        );
        t.match(
            resolved[0].basePath,
            'fixtures/folder',
            'basePath should exclude glob',
        );
        t.equal(resolved[0].pattern, '**/*', 'pattern should exclude basePath');
    },
);
