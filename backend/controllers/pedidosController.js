import { db } from "../config/db.js";

const agruparPedidos = (rows) => {
    const pedidos = new Map();

    rows.forEach((row) => {
        if (!pedidos.has(row.id)) {
            pedidos.set(row.id, {
                id: row.id,
                usuario_id: row.usuario_id,
                usuario_nome: row.usuario_nome,
                total: Number(row.total || 0),
                status: row.status,
                pix_copia_cola: row.pix_copia_cola,
                criado_em: row.criado_em,
                itens: []
            });
        }

        if (row.item_id) {
            pedidos.get(row.id).itens.push({
                id: row.item_id,
                produto_id: row.produto_id,
                produto_nome: row.produto_nome,
                barraca_id: row.barraca_id,
                barraca_nome: row.barraca_nome,
                quantidade: row.quantidade,
                subtotal: Number(row.subtotal || 0),
                preco: Number(row.preco || 0)
            });
        }
    });

    return Array.from(pedidos.values());
};

const queryPedidos = `
    SELECT
        p.id,
        p.usuario_id,
        u.nome AS usuario_nome,
        p.total,
        p.status,
        p.pix_copia_cola,
        p.criado_em,
        ip.id AS item_id,
        ip.produto_id,
        pr.nome AS produto_nome,
        pr.preco,
        pr.barraca_id,
        b.nome AS barraca_nome,
        ip.quantidade,
        ip.subtotal
    FROM pedidos p
    LEFT JOIN usuarios u ON u.id = p.usuario_id
    LEFT JOIN itens_pedido ip ON ip.pedido_id = p.id
    LEFT JOIN produtos pr ON pr.id = ip.produto_id
    LEFT JOIN barracas b ON b.id = pr.barraca_id
`;

export const listarPedidos = (req, res) => {
    db.query(`${queryPedidos} ORDER BY p.criado_em DESC, p.id DESC`, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(agruparPedidos(results));
    });
};

export const listarPedidosPorUsuario = (req, res) => {
    const { usuarioId } = req.params;

    db.query(`${queryPedidos} WHERE p.usuario_id = ? ORDER BY p.criado_em DESC, p.id DESC`, [usuarioId], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(agruparPedidos(results));
    });
};

export const listarPedidosPorBarraca = (req, res) => {
    const { barracaId } = req.params;

    db.query(`${queryPedidos} WHERE pr.barraca_id = ? ORDER BY p.criado_em DESC, p.id DESC`, [barracaId], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(agruparPedidos(results));
    });
};

export const criarPedido = async (req, res) => {
    const { usuario_id, itens = [], status = 'pendente', pix_copia_cola = null } = req.body;
    const totalInformado = Number(req.body.total || 0);

    if (!usuario_id) {
        return res.status(400).json({ error: "usuario_id e obrigatorio" });
    }

    const conn = await db.promise().getConnection();

    try {
        await conn.beginTransaction();

        let total = totalInformado;
        const itensNormalizados = [];

        if (Array.isArray(itens) && itens.length > 0) {
            const ids = itens.map((item) => item.produto_id);
            const [produtos] = await conn.query(
                `SELECT id, preco, estoque FROM produtos WHERE id IN (?)`,
                [ids]
            );

            const produtosPorId = new Map(produtos.map((produto) => [Number(produto.id), produto]));
            total = 0;

            for (const item of itens) {
                const produto = produtosPorId.get(Number(item.produto_id));
                if (!produto) throw new Error(`Produto ${item.produto_id} nao encontrado`);

                const quantidade = Number(item.quantidade || 1);
                if (Number(produto.estoque) < quantidade) {
                    throw new Error(`Estoque insuficiente para o produto ${item.produto_id}`);
                }

                const subtotal = Number(produto.preco) * quantidade;
                total += subtotal;
                itensNormalizados.push({ produto_id: item.produto_id, quantidade, subtotal });
            }
        }

        const [pedidoResult] = await conn.query(
            'INSERT INTO pedidos (usuario_id, total, status, pix_copia_cola) VALUES (?, ?, ?, ?)',
            [usuario_id, total, status, pix_copia_cola]
        );

        const pedidoId = pedidoResult.insertId;

        for (const item of itensNormalizados) {
            await conn.query(
                'INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, subtotal) VALUES (?, ?, ?, ?)',
                [pedidoId, item.produto_id, item.quantidade, item.subtotal]
            );
            await conn.query(
                'UPDATE produtos SET estoque = estoque - ? WHERE id = ?',
                [item.quantidade, item.produto_id]
            );
        }

        await conn.commit();
        res.status(201).json({ message: "Pedido criado com sucesso!", id: pedidoId, total });
    } catch (err) {
        await conn.rollback();
        res.status(500).json({ error: err.message || "Erro ao criar pedido" });
    } finally {
        conn.release();
    }
};

export const atualizarStatusPedido = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) return res.status(400).json({ error: "status e obrigatorio" });

    db.query('UPDATE pedidos SET status = ? WHERE id = ?', [status, id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Status do pedido atualizado com sucesso!" });
    });
};