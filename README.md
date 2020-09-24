# Eik Commons

This package contains common utilities and schemas

## APIs

### schemas

#### eik.json

Importing schemas 

```js
const { schemas, assert } = require('@eik/common');
```

Validating an `eik.json` file

```js
const { error, value } = schemas.validate.eikJSON({
    name: 'my-app',
    version: '1.0.0',
    server: 'http://eik-server',
    files: [],
});

//or 

assert.eikJSON({
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

// or

assert.name('my-app');
```

##### version

```js
const { error, value } = schemas.validate.version('1.0.0');

// or

assert.version('1.0.0');
```
##### server

```js
const { error, value } = schemas.validate.server('http://myeikserver.com');

// or

assert.server('http://myeikserver.com');
```
##### files

```js
const { error, value } = schemas.validate.files({
    './index.js': '/path/to/file.js'
});

// or

assert.files({
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

// or

assert.importMap([
    'http://meserver.com/map1.json',
    'http://meserver.com/map2.json',
]);
```

##### out

```js
const { error, value } = schemas.validate.out('./.eik');

// or

assert.out('./.eik');
```

### helpers

#### localAssets

A function to help development by mounting development routes to an Express.js or Fastify app based on values defined in `eik.json`

```js
const express = require('express');
const { helpers } = require('@eik/common');
const app = express();
await helpers.localAssets(app);
```

For an `eik.json` file such as

```json
{
    "name": "my-app",
    "version": "1.0.0",
    "server": "https://assets.myeikserver.com",
    "files" :{
        "esm.js": "./assets/esm.js",
        "esm.css": "./assets/esm.css",
        "/": "./assets/**/*.map",
    }
}
```

A number of routes would be mounted into your app.

```
/pkg/my-app/1.0.0/esm.js
/pkg/my-app/1.0.0/esm.css
/pkg/my-app/1.0.0/esm.js.map
/pkg/my-app/1.0.0/esm.css.map
```

#### packageURL

This helper function can be used to build URLs for given entries in an `eik.json` files section. 

Given the following `eik.json` file:

```json
{
    "name": "my-app",
    "version": "1.0.0",
    "server": "https://assets.myeikserver.com",
    "files" :{
        "esm.js": "./assets/esm.js",
        "esm.css": "./assets/esm.css",
        "/": "./assets/**/*.map",
    }
}
```

and the following call to packageURL

```js
const { helpers } = require('@eik/common');
const url = await helpers.packageURL('esm.js');
```

The URL returned will be `https://assets.myeikserver.com/pkg/my-app/1.0.0/esm.js`

