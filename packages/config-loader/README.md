# @eik/common-config-loader

Eik configuration definition and functions for loading eik configuration files.

> **Note**
> this package is for internal eik-lib usage and the api may change at any time without notice.

## EikConfig

A class representing the eik configuration.

## configStore

Support for reading configuration files.

Configuration are fetched from the app's eik.json or package.json file, or well as from .eikrc, if present in the users home directory. Only one configuration source is supported.

Usage:

```js
const { configStore } = require('@eik/common-config-loader');
const config: EikConfig = configStore.findInDirectory('/path/to/my/app');
```

The `findInDirectory` method may throw

-   `MissingConfigError` if no configuration files are found.
-   `InvalidConfigError` if the configuration is not valid
-   `MultipleConfigSourcesError` if multiple configuration sources are found

## getDefaults

Wrapper function to `configStore.findInDirectory` that will return the configuration, or a placeholder object with empty values if no configuration files are found.

```js
const { getDefaults } = require('@eik/common-config-loader');
const config: EikConfig = getDefaults('/path/to/my/app');
```

## localAssets

A function to help development by mounting development routes to an Express.js or Fastify app based on values defined in `eik.json`

```js
const express = require('express');
const { localAssets } = require('@eik/common-config-loader');
const app = express();
await helpers.localAssets(app);
```

For an `eik.json` file such as

```json
{
    "name": "my-app",
    "version": "1.0.0",
    "server": "https://assets.myeikserver.com",
    "files": {
        "esm.js": "./assets/esm.js",
        "esm.css": "./assets/esm.css",
        "/": "./assets/**/*.map"
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
