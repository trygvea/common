const { test } = require('tap');
const { assets } = require('./');

test('validate basic asset manifest', t => {
    const result = assets({
        organisation: 'my-org',
        name: 'my-app-name',
        version: '1.0.0',
        server: 'http://localhost:4001',
        js: {
            input: './assets/scripts.js',
            options: { async: true, defer: true },
        },
        css: {
            input: './assets/styles.css',
            options: {},
        },
    });
    t.equal(result.error, false);
    t.end();
});

test('validate asset manifest - all props invalid', t => {
    const result = assets({
        organisation: '',
        name: '',
        version: '',
        server: '',
    });

    t.equal(result.error[0].dataPath, '.name');
    t.equal(result.error[0].message, 'should NOT be shorter than 2 characters');
    t.end();
});

test('validate asset manifest - all props invalid except name', t => {
    const result = assets({
        organisation: '',
        name: 'my-app',
        version: '',
        server: '',
    });

    t.equal(result.error[0].dataPath, '.version');
    t.equal(result.error[0].message, 'should NOT be shorter than 5 characters');
    t.end();
});

test('validate asset manifest - all props invalid except name and version', t => {
    const result = assets({
        organisation: '',
        name: 'my-app',
        version: '1.0.0',
        server: '',
    });

    t.equal(result.error[0].dataPath, '.organisation');
    t.equal(result.error[0].message, 'should NOT be shorter than 2 characters');
    t.end();
});

test('validate asset manifest - ', t => {
    const result = assets({
        organisation: 'my-org',
        name: 'my-app',
        version: '1.0.0',
        server: '',
    });

    t.equal(result.error[0].dataPath, '.server');
    t.equal(result.error[0].message, 'should NOT be shorter than 7 characters');
    t.end();
});

test('validate asset manifest - ', t => {
    const result = assets({
        organisation: 'my-org',
        name: 'my-app',
        version: '1.0.0',
        server: 'asdasdasdasd',
    });

    t.equal(result.error[0].dataPath, '.server');
    t.equal(
        result.error[0].message,
        'should match pattern "^https?://[a-zA-Z0-9-_./]+(:[0-9]+)?"'
    );
    t.end();
});

test('minimum viable', t => {
    const result = assets({
        organisation: 'my-org',
        name: 'my-app',
        version: '1.0.0',
        server: 'http://localhost:4001',
    });

    t.equal(result.error, false);
    t.same(result.value, {
        organisation: 'my-org',
        name: 'my-app',
        version: '1.0.0',
        server: 'http://localhost:4001',
        js: { input: '', options: {} },
        css: { input: '', options: {} },
    });
    t.end();
});

test('js and css fields', t => {
    const result = assets({
        organisation: 'my-org',
        name: 'my-app',
        version: '1.0.0',
        server: 'http://localhost:4001',
        js: {
            input: './assets/scripts.js',
            options: {
                async: true,
                defer: true,
            },
        },
        css: {
            input: './assets/styles.css',
            options: {
                crossorigin: 'etc etc',
            },
        },
    });

    t.equal(result.error, false);
    t.same(result.value, {
        organisation: 'my-org',
        name: 'my-app',
        version: '1.0.0',
        server: 'http://localhost:4001',
        js: {
            input: './assets/scripts.js',
            options: {
                async: true,
                defer: true,
            },
        },
        css: {
            input: './assets/styles.css',
            options: {
                crossorigin: 'etc etc',
            },
        },
    });
    t.end();
});
