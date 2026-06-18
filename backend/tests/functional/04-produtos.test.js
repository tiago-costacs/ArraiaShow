import test from 'node:test';
import assert from 'node:assert/strict';
import { startServer, stopAll, request, login } from './utils.js';

let barraqueiroToken, createdBarracaId;

test.before(async () => {
    await startServer();
    const barraqueiro = await login('joao@barraca.com');
    barraqueiroToken = barraqueiro.token;

    // Try to pick an existing barraca for this barraqueiro; tests will still create products referencing an id.
    // For safety, create a barraca via organizador flow would be better but keep simple: use id 10 if exists.
    // We'll attempt to create a barraca owned by this barraqueiro if endpoints allow (requires organizador),
    // so we will read existing barracas and pick one.
    const list = await request('/barracas', { method: 'GET', headers: { Authorization: `Bearer ${barraqueiroToken}` } });
    if (list.status === 200) {
        const data = await list.json();
        if (Array.isArray(data) && data.length > 0) createdBarracaId = data[0].id;
    }
    // fallback to 10
    if (!createdBarracaId) createdBarracaId = 10;
});

test.after(async () => {
    await stopAll();
});

test('Caso de Teste 07 – Cadastro de produto', async () => {
    const response = await request('/produtos', {
        method: 'POST',
        headers: { Authorization: `Bearer ${barraqueiroToken}` },
        body: JSON.stringify({ barraca_id: createdBarracaId, nome: 'Milho Cozido', preco: 10, estoque: 50 })
    });

    assert.equal(response.status, 201);
    const body = await response.json();
    assert.ok(body.id);
});

test('Caso de Teste 08 – Produto com preco negativo', async () => {
    const response = await request('/produtos', {
        method: 'POST',
        headers: { Authorization: `Bearer ${barraqueiroToken}` },
        body: JSON.stringify({ barraca_id: createdBarracaId, nome: 'Produto invalido', preco: -10, estoque: 5 })
    });

    assert.equal(response.status, 400);
    const body = await response.json();
    assert.ok(body.error?.includes('Preco invalido'));
});

test('Caso de Teste 09 – Estoque critico', async () => {
    const responseCreate = await request('/produtos', {
        method: 'POST',
        headers: { Authorization: `Bearer ${barraqueiroToken}` },
        body: JSON.stringify({ barraca_id: createdBarracaId, nome: 'Produto Critico', preco: 5, estoque: 4 })
    });
    assert.equal(responseCreate.status, 201);

    const listResponse = await request('/produtos', { method: 'GET', headers: { Authorization: `Bearer ${barraqueiroToken}` } });
    assert.equal(listResponse.status, 200);
    const products = await listResponse.json();
    assert.ok(Array.isArray(products));
    const critical = products.some((product) => Number(product.estoque) === 4);
    assert.ok(critical, 'Espera-se produto com estoque critico igual a 4');
});

test('Caso de Teste 10 – Estoque normal', async () => {
    const responseCreate = await request('/produtos', {
        method: 'POST',
        headers: { Authorization: `Bearer ${barraqueiroToken}` },
        body: JSON.stringify({ barraca_id: createdBarracaId, nome: 'Produto Normal', preco: 8, estoque: 10 })
    });
    assert.equal(responseCreate.status, 201);

    const listResponse = await request('/produtos', { method: 'GET', headers: { Authorization: `Bearer ${barraqueiroToken}` } });
    assert.equal(listResponse.status, 200);
    const products = await listResponse.json();
    assert.ok(Array.isArray(products));
    const normal = products.some((product) => Number(product.estoque) === 10);
    assert.ok(normal, 'Espera-se produto com estoque normal igual a 10');
});
