# [3.0.0-next.1](https://github.com/eik-lib/common/compare/v2.0.3...v3.0.0-next.1) (2021-02-18)


### Features

* add extension, mime-type and content-type to file location ([a9b4fe1](https://github.com/eik-lib/common/commit/a9b4fe15cf39425070b9bd260183656933d94c5d))
* add mappings() method to eik config object ([f989ae0](https://github.com/eik-lib/common/commit/f989ae0e2de0aa5646fd33d0f5854bc7e74c8734)), closes [/github.com/eik-lib/issues/issues/2#issuecomment-779099732](https://github.com//github.com/eik-lib/issues/issues/2/issues/issuecomment-779099732)


* refactor!: packageURL removed, localAssets fixed and updated ([90fd181](https://github.com/eik-lib/common/commit/90fd1818f69384d4edeb056dc2c8367e51b21d44))
* refactor!: remove pathsAndFiles methods ([90d8a12](https://github.com/eik-lib/common/commit/90d8a12e4df8e3a37f295c6136e94bf4ade68cb4))
* feat!: preserve directory structure when globbing in config ([dff2830](https://github.com/eik-lib/common/commit/dff28301f9bc6e37ef9db32455fa64f5a7a9e80a))


### BREAKING CHANGES

* packageURL was removed as it no longer makes sense given the changes to eik json files config

localAssets has been refactored to use the new mappings method of eik config
* Consumers of the Eik Config class will all need to be updated to use the newer .mappings() method instead.
* directory structures are no longer flattened

## [2.0.3](https://github.com/eik-lib/common/compare/v2.0.2...v2.0.3) (2021-02-11)


### Bug Fixes

* handle file keys starting with . correctly ([01c0dd8](https://github.com/eik-lib/common/commit/01c0dd8f9f4485ef35489629526c5871e35a83e8))

## [2.0.2](https://github.com/eik-lib/common/compare/v2.0.1...v2.0.2) (2021-02-10)


### Bug Fixes

* do not use package.json as config source if eik key is not defined ([ccbc610](https://github.com/eik-lib/common/commit/ccbc61070ff26b75aae5d3cdab1ac5d0d8ed6929))

## [2.0.1](https://github.com/eik-lib/common/compare/v2.0.0...v2.0.1) (2021-02-09)


### Bug Fixes

* correctly return default type from eik-config class ([fadaea7](https://github.com/eik-lib/common/commit/fadaea794346c77ce60b07fb8efd3684fc2c3911))

# [2.0.0](https://github.com/eik-lib/common/compare/v1.6.0...v2.0.0) (2021-02-08)


* feat!: add type field to eik config schema ([d9bd0c4](https://github.com/eik-lib/common/commit/d9bd0c4bceee07506fb8e1efc3d2c09715a10062))


### BREAKING CHANGES

* valid eik config object is now required when instantiating EikConfig class

# [1.6.0](https://github.com/eik-lib/common/compare/v1.5.0...v1.6.0) (2021-01-27)


### Features

* add "type" field to JSON Schema, validation and asserts ([402ffca](https://github.com/eik-lib/common/commit/402ffcadcd823fdfdd47bf0d4e2c8353795e6fbc))

# [1.5.0](https://github.com/eik-lib/common/compare/v1.4.2...v1.5.0) (2021-01-25)


### Features

* Add config persistence method to configStore ([91b396c](https://github.com/eik-lib/common/commit/91b396c52077d0b7916c65bbfcfbca10428e76f9))

## [1.4.2](https://github.com/eik-lib/common/compare/v1.4.1...v1.4.2) (2021-01-21)


### Bug Fixes

* remove singletons in packageURL and localAssets ([6e49df0](https://github.com/eik-lib/common/commit/6e49df03afd5294bf8535c95c050a8d28e94f491))

## [1.4.1](https://github.com/eik-lib/common/compare/v1.4.0...v1.4.1) (2021-01-19)


### Bug Fixes

* Ensure map property for config is always an array ([c0d1860](https://github.com/eik-lib/common/commit/c0d1860fe906fd7902ffcceb76996cfff02861e2))

# [1.4.0](https://github.com/eik-lib/common/compare/v1.3.3...v1.4.0) (2021-01-19)


### Features

* Remove unneeded file ([72c07df](https://github.com/eik-lib/common/commit/72c07dfb3e8673a55535470dd41b7ed09e492b08))

## [1.3.3](https://github.com/eik-lib/common/compare/v1.3.2...v1.3.3) (2020-12-31)


### Bug Fixes

* Expose invalid value when throwing validation error ([7f1d0f0](https://github.com/eik-lib/common/commit/7f1d0f02e3df36dcd8984e0b475f9adf55937c46))

## [1.3.2](https://github.com/eik-lib/common/compare/v1.3.1...v1.3.2) (2020-12-16)


### Bug Fixes

* Added ajv-formats to support uri's ([66e86d0](https://github.com/eik-lib/common/commit/66e86d09d16644ad35e40617b4a5e3b380e587f3))
* **deps:** update dependency ajv to v7 ([bb61f63](https://github.com/eik-lib/common/commit/bb61f638259a0d379b6a43490e016c08bf6ac04e))

# [1.3.0](https://github.com/eik-lib/common/compare/v1.2.0...v1.3.0) (2020-09-25)


### Features

* add helpers for development and production ([207708c](https://github.com/eik-lib/common/commit/207708ce68639388ad4cea033c0204417dfc684e))

# [1.2.0](https://github.com/eik-lib/common/compare/v1.1.0...v1.2.0) (2020-09-14)


### Features

* expose validation error ([66585ef](https://github.com/eik-lib/common/commit/66585ef3de7e6e272fcb4ec7ffa8649f2fff0598))

# [1.1.0](https://github.com/eik-lib/common/compare/v1.0.1...v1.1.0) (2020-09-10)


### Features

* add assert functions for schema ([ba3aa28](https://github.com/eik-lib/common/commit/ba3aa28d2450d2ef6ebf58ba716427164f849680))

## [1.0.1](https://github.com/eik-lib/common/compare/v1.0.0...v1.0.1) (2020-09-10)


### Bug Fixes

* loosen validation ([ea00919](https://github.com/eik-lib/common/commit/ea00919fcfb1ef7e0dd277e0e06525fd467834cf))

# 1.0.0 (2020-09-08)


### Features

* update schema file, split out small validation functions ([3f4f7e0](https://github.com/eik-lib/common/commit/3f4f7e05bf296430582efa93008ca3d6f2360bd9))
