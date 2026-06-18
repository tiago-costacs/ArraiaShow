import test from 'node:test';
import assert from 'node:assert/strict';
import { startServer, stopAll, request, login } from './utils.js';

let participanteToken, participanteId, createdProductId, createdBarracaId;

test.before(async () => {
    await startServer();
    const participante = await login('maria@cliente.com');
    participanteToken = participante.token;
    participanteId = participante.user.id;

    // create a product via barraqueiro flow: we'll login as barraqueiro and create product
    const barraqueiro = await login('joao@barraca.com');
    const barraqueiroToken = barraqueiro.token;

    // find a barraca
    const list = await request('/barracas', { method: 'GET', headers: { Authorization: `Bearer ${barraqueiroToken}` } });
    if (list.status === 200) {
        const data = await list.json();
        if (Array.isArray(data) && data.length > 0) createdBarracaId = data[0].id;
    }
    if (!createdBarracaId) createdBarracaId = 10;

    const prod = await request('/produtos', {
        method: 'POST',
        headers: { Authorization: `Bearer ${barraqueiroToken}` },
        body: JSON.stringify({ barraca_id: createdBarracaId, nome: `ProdutoVenda ${Date.now()}`, preco: 10, estoque: 5 })
    });
    if (prod.status === 201) {
        const body = await prod.json();
        createdProductId = body.id;
    }
});

test.after(async () => {
    await stopAll();
});

test('Caso de Teste 11 – Atualizacao do faturamento', async () => {
    if (!createdProductId) throw new Error('Produto nao criado para teste');

    const orderResponse = await request('/pedidos', {
        method: 'POST',
        headers: { Authorization: `Bearer ${participanteToken}` },
        body: JSON.stringify({ usuario_id: participanteId, itens: [{ produto_id: createdProductId, quantidade: 1 }] })
    });

    assert.equal(orderResponse.status, 201);
    const orderBody = await orderResponse.json();
    assert.ok(orderBody.id);
    // total should be 10 for quantity 1 at price 10
    assert.equal(orderBody.total, 10);

    const produtoResponse = await request(`/produtos/barraca/${createdBarracaId}`, { method: 'GET', headers: { Authorization: `Bearer ${participanteToken}` } });
    assert.equal(produtoResponse.status, 200);
    const produtos = await produtoResponse.json();
    const product = produtos.find((item) => Number(item.id) === Number(createdProductId));
    assert.ok(product);
    // estoque decreased from 5 to 4
    assert.equal(Number(product.estoque), 4);
});
