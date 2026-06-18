import test from 'node:test';
import assert from 'node:assert/strict';
import { startServer, stopAll, request, login, registerUser } from './utils.js';

let organizadorToken, createdEventId, createdBarracaId;

test.before(async () => {
    await startServer();
    const organizador = await login('organizador@evento.com');
    organizadorToken = organizador.token;

    // create event to attach barraca
    const ev = await request('/eventos', {
        method: 'POST',
        headers: { Authorization: `Bearer ${organizadorToken}` },
        body: JSON.stringify({ nome: `Evento Teste ${Date.now()}`, data: '2026-07-20', endereco: 'X', horario: '18:00' })
    });
    const evBody = await ev.json();
    createdEventId = evBody.id;
});

test.after(async () => {
    await stopAll();
});

test('Caso de Teste 05 – Cadastrar barraca vinculada a evento', async () => {
    const responsavelEmail = `responsavel-${Date.now()}@demo.com`;
    const reg = await registerUser(`Resp ${Date.now()}`, responsavelEmail, 'barraqueiro');
    assert.equal(reg.status, 201);
    const loginResp = await login(responsavelEmail);
    const responsavel = loginResp.user;

    const response = await request('/barracas', {
        method: 'POST',
        headers: { Authorization: `Bearer ${organizadorToken}` },
        body: JSON.stringify({ evento_id: createdEventId, nome: 'Barraca do Milho', responsavel_id: responsavel.id })
    });

    assert.equal(response.status, 201);
    const body = await response.json();
    assert.ok(body.id);
    createdBarracaId = body.id;
});

test('Caso de Teste 06 – Barraca sem responsavel', async () => {
    const response = await request('/barracas', {
        method: 'POST',
        headers: { Authorization: `Bearer ${organizadorToken}` },
        body: JSON.stringify({ evento_id: createdEventId, nome: 'Barraca sem responsavel' })
    });

    assert.equal(response.status, 400);
    const body = await response.json();
    assert.ok(body.error?.includes('responsavel'));
});
