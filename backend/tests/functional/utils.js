import { createServer, Agent as HttpAgent } from 'http';
import { Agent as HttpsAgent } from 'https';
import app from '../../app.js';
import { db } from '../../config/db.js';

let server;
let baseUrl;

const FETCH_AGENT = {
    'http:': new HttpAgent({ keepAlive: false }),
    'https:': new HttpsAgent({ keepAlive: false })
};

export async function startServer() {
    if (server) return { baseUrl };
    server = createServer(app);
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    server.unref();
    const port = server.address().port;
    baseUrl = `http://127.0.0.1:${port}`;
    return { baseUrl };
}

export async function stopServer() {
    if (!server) return;
    await new Promise((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));
    server = null;
    baseUrl = null;
}

export async function stopDatabase() {
    if (!db) return;
    await db.promise().end();
}

export async function stopAll() {
    await stopServer();
    await stopDatabase();
}

export async function request(path, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        Connection: 'close',
        ...(options.headers || {})
    };

    const response = await fetch(`${baseUrl}${path}`, {
        ...options,
        headers,
        agent: FETCH_AGENT
    });

    return response;
}

export async function login(email, senha = '123456') {
    const response = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, senha })
    });
    return response.json();
}

export async function registerUser(nome, email, tipo = 'participante') {
    const response = await request('/auth/registrar', {
        method: 'POST',
        body: JSON.stringify({ nome, email, senha: '123456', tipo })
    });
    return response;
}
