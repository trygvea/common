const tap = require('tap');
const ResolvedFiles = require('../../src/classes/resolved-files.js');

tap.test('ResolvedFiles: iterator for ./my/file.js', (t) => {
    const subject = new ResolvedFiles(['./my/file.js', './my/file.css'], {
        basePath: '/base/path',
        definition: ['dest', 'src'],
    });

    const files = Array.from(subject);
    t.equal(
        files[0].relative,
        './my/file.js',
        'should result in a valid absolute path',
    );
    t.end();
});
