# Eik Commons

This package contains common utilities and schemas

## APIs

### schemas

#### eik.json

Importing schemas 

```js
const { schemas } = require('@eik/common');
```

Validating an `eik.json` file

```js
const { error, value } = schemas.validate.eikJSON({
    name: 'my-app',
    version: '1.0.0',
    server: 'http://eik-server',
    files: [],
});
```

Using invididual schema validators

##### name

```js
const { error, value } = schemas.validate.name('my-app');
```

##### version

```js
const { error, value } = schemas.validate.version('1.0.0');
```
##### server

```js
const { error, value } = schemas.validate.server('http://myeikserver.com');
```
##### files

```js
const { error, value } = schemas.validate.files({
    './index.js': '/path/to/file.js'
});
```

##### import map

```js
const { error, value } = schemas.validate.importMap('http://meserver.com/map.json');

const { error, value } = schemas.validate.importMap([
    'http://meserver.com/map1.json',
    'http://meserver.com/map2.json',
]);
```

##### out

```js
const { error, value } = schemas.validate.out('./.eik');
```
