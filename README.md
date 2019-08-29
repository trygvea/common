# Asset Pipe Common

This package contains common utilities and schemas

## APIs

### schemas

#### assets

```js
const { schemas } = require('@asset-pipe/common');

const { error, value } = schemas.assets({
    organisation: 'my-org',
    name: 'my-app',
    version: '1.0.0',
    server: 'http://asset-server',
});
```
