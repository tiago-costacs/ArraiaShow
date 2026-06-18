import test from 'node:test';
import assert from 'node:assert/strict';
import { startServer, stopAll, request, login } from './utils.js';

let organizadorToken;

test.before(async () => {
    await startServer();
    const organizador = await login('organizador@evento.com');
    organizadorToken = organizador.token;
});

test.after(async () => {
    await stopAll();
});

test('Caso de Teste 03 – Criar evento valido', async () => {
    const response = await request('/eventos', {
        method: 'POST',
        headers: { Authorization: `Bearer ${organizadorToken}` },
        body: JSON.stringify({
            nome: 'Arraiá 2026',
            data: '2026-07-20',
            endereco: 'Praça central',
            horario: '18:00',
            descricao: 'Evento de teste'
        })
    });

    assert.equal(response.status, 201);
    const body = await response.json();
    assert.ok(body.id);
});

test('Caso de Teste 04 – Criar evento sem nome', async () => {
    const response = await request('/eventos', {
        method: 'POST',
        headers: { Authorization: `Bearer ${organizadorToken}` },
        body: JSON.stringify({
            data: '2026-07-20',
            endereco: 'Praça central',
            horario: '18:00',
            descricao: 'Evento sem nome'
        })
    });

    assert.equal(response.status, 400);
    const body = await response.json();
    assert.ok(body.error?.includes('Nome') || body.error?.includes('obrigatorios'));
});
