# Eik Commons

This package contains common utilities and schemas

## APIs

### schemas

#### assets

```js
const { schemas } = require('@eik/common');

const { error, value } = schemas.validate.eikJSON({
    name: 'my-app',
    version: '1.0.0',
    server: 'http://eik-server',
    files: [],
});

const { error, value } = schemas.validate.name('my-app');

const { error, value } = schemas.validate.version('1.0.0');

const { error, value } = schemas.validate.server('http://myeikserver.com');

const { error, value } = schemas.validate.files({
    './index.js': '/path/to/file.js'
});

const { error, value } = schemas.validate.importMap('http://meserver.com/map.json');

const { error, value } = schemas.validate.importMap([
    'http://meserver.com/map1.json',
    'http://meserver.com/map2.json',
]);

const { error, value } = schemas.validate.out('./.eik');
```
