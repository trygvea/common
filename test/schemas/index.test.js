const { test } = require('tap');
const { validate } = require('../../lib/schemas/index');

test('validate basic eik JSON file', t => {
    const result = validate.eikJSON({
        name: 'my-app-name',
        version: '1.0.0',
        server: 'http://localhost:4001',
        files: {
            'index.js': './assets/scripts.js',
            'index.css': './assets/styles.css',
        },
    });
    t.equal(result.value.type, 'package');
    t.equal(result.error, false);
    t.end();
});

test('validate asset manifest - all props invalid', t => {
    const result = validate.eikJSON({
        name: '',
    });

    t.same(result.value, { name: '', type: 'package' });
    t.equal(result.error[0].message, `should have required property 'server'`);
    t.end();
});

test('validate name: empty string', t => {
    const result = validate.name('');
    t.equal(result.value, '');
    t.equal(result.error.length, 1);
    t.end();
});

test('validate name: valid', t => {
    const result = validate.name('@finn-no/my-app');
    t.equal(result.value, '@finn-no/my-app');
    t.equal(result.error, false);
    t.end();
});

test('validate name: invalid by validate-npm-package-name module', t => {
    const result = validate.name('@finn-no/my-app~');
    t.equal(result.value, '@finn-no/my-app~');
    t.equal(result.error.length, 1);
    t.end();
});

test('validate version: empty string', t => {
    const result = validate.version('');
    t.equal(result.value, '');
    t.equal(result.error.length, 1);
    t.end();
});

test('validate version: valid', t => {
    const result = validate.version('1.0.0');
    t.equal(result.value, '1.0.0');
    t.equal(result.error, false);
    t.end();
});

test('validate type: empty string', t => {
    const result = validate.type('');
    t.equal(result.value, '');
    t.equal(result.error.length, 1);
    t.equal(result.error[0].message, 'should be equal to one of the allowed values');
    t.end();
});

test('validate type: valid - package', t => {
    const result = validate.type('package');
    t.equal(result.value, 'package');
    t.equal(result.error, false);
    t.end();
});
test('validate type: valid - npm', t => {
    const result = validate.type('npm');
    t.equal(result.value, 'npm');
    t.equal(result.error, false);
    t.end();
});
test('validate type: valid - map', t => {
    const result = validate.type('map');
    t.equal(result.value, 'map');
    t.equal(result.error, false);
    t.end();
});

test('validate version: invalid by node-semver module', t => {
    const result = validate.version('1.0');
    t.equal(result.value, '1.0');
    t.equal(result.error.length, 1);
    t.end();
});

test('validate server: valid', t => {
    const result = validate.server('http://localhost:4000');
    t.equal(result.value, 'http://localhost:4000');
    t.equal(result.error, false);
    t.end();
});

test('validate server: invalid', t => {
    const result = validate.server('localhost');
    t.equal(result.value, 'localhost');
    t.equal(result.error.length, 1);
    t.end();
});

test('validate files: valid', t => {
    const result = validate.files({'index.js': '/path/to/file.js'});
    t.same(result.value, {'index.js': '/path/to/file.js'});
    t.equal(result.error, false);
    t.end();
});

test('validate files: invalid', t => {
    const result = validate.files({'asd': 1});
    t.same(result.value, {'asd': 1});
    t.equal(result.error.length, 1);
    t.end();
});

test('validate files: invalid', t => {
    const result = validate.files({});
    t.same(result.value, {});
    t.equal(result.error.length, 1);
    t.end();
});

test('validate importMap: valid string', t => {
    const result = validate.importMap('http://myimportmap/file.json');
    t.same(result.value, 'http://myimportmap/file.json');
    t.equal(result.error, false);
    t.end();
});

test('validate importMap: valid array', t => {
    const result = validate.importMap([
        'http://myimportmap/file1.json',
        'http://myimportmap/file2.json'
    ]);
    t.same(result.value, [
        'http://myimportmap/file1.json',
        'http://myimportmap/file2.json',
    ]);
    t.equal(result.error, false);
    t.end();
});

test('validate importMap: invalid string', t => {
    const result = validate.importMap('');
    t.same(result.value, '');
    t.equal(result.error.length, 3);
    t.end();
});

test('validate importMap: invalid array', t => {
    const result = validate.importMap(['']);
    t.same(result.value, ['']);
    t.equal(result.error.length, 3);
    t.end();
});

test('validate out: valid', t => {
    const result = validate.out('./.eik');
    t.same(result.value, './.eik');
    t.equal(result.error, false);
    t.end();
});

test('validate out: invalid', t => {
    const result = validate.out('');
    t.same(result.value, '');
    t.equal(result.error.length, 1);
    t.end();
});
