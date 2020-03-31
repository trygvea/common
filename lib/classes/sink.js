'use strict';

const Sink = class Sink {
    write() {
        throw new Error('Method not implemented');
    }

    read() {
        throw new Error('Method not implemented');
    }

    delete() {
        throw new Error('Method not implemented');
    }

    exist() {
        throw new Error('Method not implemented');
    }

    static validateFilePath(filePath) {
        if (typeof filePath !== 'string') throw new TypeError('Argument must be a String');
        if (filePath === '') throw new TypeError('Argument can not be an empty String');
        return filePath;
    }

    static validateContentType(contentType) {
        if (typeof contentType !== 'string') throw new TypeError('Argument must be a String');
        if (contentType === '') throw new TypeError('Argument can not be an empty String');
        return contentType;
    }

    get [Symbol.toStringTag]() {
        return 'Sink';
    }
};
module.exports = Sink;
