function isStream(stream) {
    return (
        stream !== null &&
        typeof stream === 'object' &&
        typeof stream.pipe === 'function'
    );
}

function isReadableStream(stream) {
    return (
        isStream(stream) &&
        stream.readable !== false &&
        typeof stream._read === 'function' &&
        typeof stream._readableState === 'object'
    );
}

module.exports = {
    isStream,
    isReadableStream,
};
