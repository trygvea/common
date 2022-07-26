const tap = require('tap');
const LocalFileLocation = require('../../src/classes/local-file-location.js');

tap.test('LocalFileLocation: .mimeType for ./my/file.json', (t) => {
    const subject = new LocalFileLocation('./my/file.json', __dirname);
    t.equal(subject.mimeType, 'application/json', 'should be treated as JSON');
    t.end();
});

tap.test('LocalFileLocation: .mimeType for ./my/file.js', (t) => {
    const subject = new LocalFileLocation('./my/file.js', __dirname);
    t.equal(
        subject.mimeType,
        'application/javascript',
        'should be treated as JavaScript',
    );
    t.end();
});

tap.test('LocalFileLocation: .mimeType for file.css', (t) => {
    const subject = new LocalFileLocation('./my/file.css', __dirname);
    t.equal(subject.mimeType, 'text/css', 'should be treated as CSS');
    t.end();
});

tap.test('LocalFileLocation: .mimeType for file.jpg', (t) => {
    const subject = new LocalFileLocation('./my/file.jpg', __dirname);
    t.equal(subject.mimeType, 'image/jpeg', 'should be treated as jpeg image');
    t.end();
});

tap.test(
    'LocalFileLocation: .mimeType should fallback for unknown file extension',
    (t) => {
        const subject = new LocalFileLocation('./my/file.unknown', __dirname);
        t.equal(
            subject.mimeType,
            'application/octet-stream',
            'should be treated as application/octet-stream',
        );
        t.end();
    },
);
