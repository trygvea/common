const tap = require('tap');
const pathDiff = require('../../lib/helpers/path-diff');

tap.test('definition: /folder, path: /folder/client.js => client.js', (t) => {
    t.equal(pathDiff('/folder', '/folder/client.js'), '/client.js');
    t.end();
});

tap.test(
    'definition: /**/*, path: /folder/client.js => /folder/client.js',
    (t) => {
        t.equal(pathDiff('/**/*', '/folder/client.js'), '/folder/client.js');
        t.end();
    },
);

tap.test(
    'definition: /folder/**/*, path: /folder/client.js => /client.js',
    (t) => {
        t.equal(pathDiff('/folder/**/*', '/folder/client.js'), '/client.js');
        t.end();
    },
);

tap.test(
    'definition: /folder/clie*.js, path: /folder/client.js => /client.js',
    (t) => {
        t.equal(
            pathDiff('/folder/clie*.js', '/folder/client.js'),
            '/client.js',
        );
        t.end();
    },
);

tap.test(
    'definition: folder/**/*, path: /folder/client.js => /client.js',
    (t) => {
        t.equal(pathDiff('folder/**/*', '/folder/client.js'), '/client.js');
        t.end();
    },
);

tap.test(
    'definition: ./**/*, path: /folder/client.js => /folder/client.js',
    (t) => {
        t.equal(pathDiff('./**/*', '/folder/client.js'), '/folder/client.js');
        t.end();
    },
);

tap.test('definition: ./**/*, path: /client.js => /client.js', (t) => {
    t.equal(pathDiff('./**/*', '/client.js'), '/client.js');
    t.end();
});

tap.test('definition: ./*, path: /client.js => /client.js', (t) => {
    t.equal(pathDiff('./*', '/client.js'), '/client.js');
    t.end();
});

tap.test(
    'definition: path/to/folder, path: /path/to/folder/to/folder/client.js => /to/folder/client.js',
    (t) => {
        t.equal(
            pathDiff('path/to/folder', 'path/to/folder/to/folder/client.js'),
            '/to/folder/client.js',
        );
        t.end();
    },
);

tap.test(
    'definition: /folder, path: /path/to/folder/to/folder/client.js => /path/to/folder/to/folder/client.js',
    (t) => {
        t.equal(
            pathDiff('/folder', '/path/to/folder/to/folder/client.js'),
            '/path/to/folder/to/folder/client.js',
        );
        t.end();
    },
);

tap.test(
    'definition: /path/to, path: /path/to//folder/client.js => /folder/client.js',
    (t) => {
        t.equal(
            pathDiff('/path/to', '/path/to//folder/client.js'),
            '/folder/client.js',
        );
        t.end();
    },
);

tap.test('definition: /, path: ./client.js => /client.js', (t) => {
    t.equal(pathDiff('/', './client.js'), '/client.js');
    t.end();
});

tap.test('definition: /, path: .//client.js => /client.js', (t) => {
    t.equal(pathDiff('/', './/client.js'), '/client.js');
    t.end();
});

tap.test('definition: ., path: ./client.js => /client.js', (t) => {
    t.equal(pathDiff('.', './client.js'), '/client.js');
    t.end();
});

tap.test('definition: "", path: ./client.js => /client.js', (t) => {
    t.equal(pathDiff('', './client.js'), '/client.js');
    t.end();
});

tap.test('definition: null, path: ./client.js => /client.js', (t) => {
    t.equal(pathDiff(null, './client.js'), '/client.js');
    t.end();
});

tap.test('definition: undefined, path: ./client.js => /client.js', (t) => {
    t.equal(pathDiff(undefined, './client.js'), '/client.js');
    t.end();
});
