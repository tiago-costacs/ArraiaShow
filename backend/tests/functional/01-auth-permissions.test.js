import test from 'node:test';
import assert from 'node:assert/strict';
import { startServer, stopAll, request, login, registerUser } from './utils.js';

let adminToken, organizadorToken, participanteToken, participanteId;

test.before(async () => {
    await startServer();
    const admin = await login('admin@evento.com');
    const organizador = await login('organizador@evento.com');
    const participante = await login('maria@cliente.com');

    adminToken = admin.token;
    organizadorToken = organizador.token;
    participanteToken = participante.token;
    participanteId = participante.user.id;
});

test.after(async () => {
    await stopAll();
});

test('Caso de Teste 01 – Participante nao pode acessar dashboard administrativo', async () => {
    const response = await request('/usuarios', {
        method: 'GET',
        headers: { Authorization: `Bearer ${participanteToken}` }
    });

    assert.equal(response.status, 403);
    const body = await response.json();
    assert.ok(body.message?.includes('Acesso negado') || body.message?.includes('administradores'));
});

test('Caso de Teste 02 – Administrador pode alterar perfil de usuario', async () => {
    const randomEmail = `teste-participante-${Date.now()}@demo.com`;
    const reg = await registerUser('Participante Teste', randomEmail, 'participante');
    assert.equal(reg.status, 201);

    const loginResult = await login(randomEmail);
    const user = loginResult.user;

    const response = await request(`/usuarios/${user.id}/tipo`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({ tipo: 'barraqueiro' })
    });

    assert.equal(response.status, 200);
    const responseUpdate = await response.json();
    assert.ok(responseUpdate.message?.includes('Tipo atualizado'));

    const verifyResponse = await request(`/usuarios/${user.id}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert.equal(verifyResponse.status, 200);
    const verifyBody = await verifyResponse.json();
    assert.equal(verifyBody.tipo, 'barraqueiro');
});
