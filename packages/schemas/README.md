# @eik/common-schemas

Schema and validators for the eik.json schema used by eik configuration.

> **Note**
> this package is for internal eik-lib usage and the api may change at any time without notice.

## Importing and validating schemas

```js
const { assert, validate } = require('@eik/common-schemas');
```

Validating an `eik.json` file

```js
const { error, value } = validate.eikJSON({
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

## Using individual schema validators

### name

```js
const { error, value } = schemas.validate.name('my-app');

// or

assert.name('my-app');
```

### version

```js
const { error, value } = schemas.validate.version('1.0.0');

// or

assert.version('1.0.0');
```

### type

```js
const { error, value } = schemas.validate.type('package');

// or

assert.type('package');
```

### server

```js
const { error, value } = schemas.validate.server('http://myeikserver.com');

// or

assert.server('http://myeikserver.com');
```

### files

```js
const { error, value } = schemas.validate.files({
    './index.js': '/path/to/file.js',
});

// or

assert.files({
    './index.js': '/path/to/file.js',
});
```

### import map

```js
const { error, value } = schemas.validate.importMap(
    'http://meserver.com/map.json',
);

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

### out

```js
const { error, value } = schemas.validate.out('./.eik');

// or

assert.out('./.eik');
```

## ValidationError

The `ValidationError` error is thrown when a validation fails.
