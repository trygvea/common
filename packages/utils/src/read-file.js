const { isReadableStream } = require('./stream.js');

const ReadFile = class ReadFile {
    constructor({ mimeType = '', etag = '' } = {}) {
        this._mimeType = mimeType;
        this._stream = undefined;
        this._etag = etag;
    }

    get mimeType() {
        return this._mimeType;
    }

    set stream(value) {
        if (!isReadableStream(value))
            throw new Error('Value is not a Readable stream');
        this._stream = value;
    }

    get stream() {
        return this._stream;
    }

    get etag() {
        return this._etag;
    }

    get [Symbol.toStringTag]() {
        return 'ReadFile';
    }
};

module.exports = ReadFile;
