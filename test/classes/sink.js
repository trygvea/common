'use strict';

const { test } = require('tap');
const Sink = require('../../lib/classes/sink');

test('Sink() - Object type', (t) => {
    const obj = new Sink();
    t.equal(Object.prototype.toString.call(obj), '[object Sink]', 'should be Sink');
    t.end();
});

test('Sink() - Call .write() method', (t) => {
    const obj = new Sink();
    t.throws(() => {
        obj.write();
    }, /Method not implemented/, 'Should throw');
    t.end();
});

test('Sink() - Call .read() method', (t) => {
    const obj = new Sink();
    t.throws(() => {
        obj.read();
    }, /Method not implemented/, 'Should throw');
    t.end();
});

test('Sink() - Call .delete() method', (t) => {
    const obj = new Sink();
    t.throws(() => {
        obj.delete();
    }, /Method not implemented/, 'Should throw');
    t.end();
});

test('Sink() - Call .exist() method', (t) => {
    const obj = new Sink();
    t.throws(() => {
        obj.exist();
    }, /Method not implemented/, 'Should throw');
    t.end();
});

test('Sink() - Call .validateFilePath() with legal value', (t) => {
    t.equal(Sink.validateFilePath('foo'), 'foo', 'Should return value');
    t.end();
});

test('Sink() - Call .validateFilePath() with illegal values', (t) => {
    t.throws(() => {
        Sink.validateFilePath();
        Sink.validateFilePath({});
        Sink.validateFilePath(300);
        Sink.validateFilePath(true);
    }, /Argument must be a String/, 'Should throw');
    t.end();
});

test('Sink() - Call .validateFilePath() with empty String value', (t) => {
    t.throws(() => {
        Sink.validateFilePath('')
    }, /Argument can not be an empty String/, 'Should throw');
    t.end();
});

test('Sink() - Call .validateContentType() with legal value', (t) => {
    t.equal(Sink.validateContentType('foo'), 'foo', 'Should return value');
    t.end();
});

test('Sink() - Call .validateContentType() with illegal values', (t) => {
    t.throws(() => {
        Sink.validateContentType();
        Sink.validateContentType({});
        Sink.validateContentType(300);
        Sink.validateContentType(true);
    }, /Argument must be a String/, 'Should throw');
    t.end();
});

test('Sink() - Call .validateContentType() with empty String value', (t) => {
    t.throws(() => {
        Sink.validateContentType('')
    }, /Argument can not be an empty String/, 'Should throw');
    t.end();
});