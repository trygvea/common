const { join } = require('path');
const { test } = require('tap');
const packageURL = require('../../lib/helpers/package-url');

test('Generate package URL for given key', async t => {
    const url = await packageURL('esm.js', {
        eikJSONPath: join(__dirname, './eik.json'),
    });

    t.equal(`https://assets.myeikserver.com/pkg/my-app/1.0.0/esm.js`, url.href);
    t.end();
});

test('Generate package URL for given key: directory', async t => {
    const url = await packageURL('/', {
        eikJSONPath: join(__dirname, './eik.json'),
    });

    t.equal(`https://assets.myeikserver.com/pkg/my-app/1.0.0/esm.css.map`, url[0].href);
    t.equal(`https://assets.myeikserver.com/pkg/my-app/1.0.0/esm.js.map`, url[1].href);
    t.end();
});

test('Incorrect key: does not exist', async t => {
    t.rejects(packageURL('asd', {
        eikJSONPath: join(__dirname, './eik.json'),
    }));
    t.end();
});

test('Correct key but referenced file does not exist', async t => {
    t.rejects(packageURL('fake', {
        eikJSONPath: join(__dirname, './eik.json'),
    }));
    t.end();
});

