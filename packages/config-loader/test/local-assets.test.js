const express = require('express');
const fastify = require('fastify');
const Hapi = require('@hapi/hapi');
const { test } = require('tap');
const fetch = require('node-fetch');
const stoppable = require('stoppable');
const localAssets = require('../src/local-assets.js');

class Server {
    constructor() {
        this.app = express();
    }

    start() {
        return new Promise((resolve, reject) => {
            try {
                this.server = this.app.listen(0, () => {
                    this.port = this.server.address().port;
                    resolve();
                });
                stoppable(this.server);
            } catch (err) {
                reject(err);
            }
        });
    }

    stop() {
        return new Promise((resolve, reject) => {
            try {
                this.server.stop(resolve);
            } catch (err) {
                reject(err);
            }
        });
    }
}

test('Setup development routes for express', async (t) => {
    const server = new Server();
    await localAssets(server.app, __dirname);
    await server.start();

    const res1 = await fetch(
        new URL('/pkg/my-app/1.0.0/esm.js', `http://localhost:${server.port}`),
    );
    const res2 = await fetch(
        new URL('/pkg/my-app/1.0.0/esm.css', `http://localhost:${server.port}`),
    );
    const res3 = await fetch(
        new URL(
            '/pkg/my-app/1.0.0/assets/esm.css.map',
            `http://localhost:${server.port}`,
        ),
    );
    const res4 = await fetch(
        new URL(
            '/pkg/my-app/1.0.0/assets/esm.js.map',
            `http://localhost:${server.port}`,
        ),
    );

    t.equal(res1.status, 200);
    t.equal(res2.status, 200);
    t.equal(res3.status, 200);
    t.equal(res4.status, 200);
    await server.stop();
    t.end();
});

test('Setup development routes for fastify', async (t) => {
    const server = fastify();
    await localAssets(server, __dirname);
    const address = await server.listen();

    const res1 = await fetch(new URL('/pkg/my-app/1.0.0/esm.js', address));
    const res2 = await fetch(new URL('/pkg/my-app/1.0.0/esm.css', address));
    const res3 = await fetch(
        new URL('/pkg/my-app/1.0.0/assets/esm.css.map', address),
    );
    const res4 = await fetch(
        new URL('/pkg/my-app/1.0.0/assets/esm.js.map', address),
    );

    t.equal(res1.status, 200);
    t.equal(res2.status, 200);
    t.equal(res3.status, 200);
    t.equal(res4.status, 200);
    await server.close();
    t.end();
});

test('Setup development routes for hapi', async (t) => {
    const server = new Hapi.Server();
    await localAssets(server, __dirname);
    await server.start();
    const address = server.info.uri;

    const res1 = await fetch(new URL('/pkg/my-app/1.0.0/esm.js', address));
    const res2 = await fetch(new URL('/pkg/my-app/1.0.0/esm.css', address));
    const res3 = await fetch(
        new URL('/pkg/my-app/1.0.0/assets/esm.css.map', address),
    );
    const res4 = await fetch(
        new URL('/pkg/my-app/1.0.0/assets/esm.js.map', address),
    );

    t.equal(res1.status, 200);
    t.equal(res2.status, 200);
    t.equal(res3.status, 200);
    t.equal(res4.status, 200);
    await server.stop();
    t.end();
});

test('Invalid app instance', async (t) => {
    t.rejects(localAssets({}, __dirname));
    t.end();
});

test('Invalid eik.json string', async (t) => {
    const server = fastify();
    t.rejects(localAssets(server, ''));
    t.end();
});
