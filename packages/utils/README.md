# @eik/common-utils

Utilities used by other eik-lib packages.

> **Note**
this package is for internal eik-lib usage and the api may change at any time without notice.

## ReadFile

A convenience wrapper of a node stream with attributes `mimeType` and `etag`.

## Handling leading and trailing slashes

The following functions are used to add or remove leading and trailing slashes in paths.

```js
function addTrailingSlash(val: string): string;
function removeTrailingSlash(val: string): string;
function addLeadingSlash(val: string): string;
function removeLeadingSlash(val: string): string;
```

## Check the type of a stream

These functions check the type of a stream:
    
```js
function isStream(stream: any): boolean;
function isReadableStream(stream: any): boolean;
```

## Decorated variants of typechecker functions

Better check the implementation of these functions before use :).

```js
function typeSlug(type: any): any
function typeTitle(type: any): any
```