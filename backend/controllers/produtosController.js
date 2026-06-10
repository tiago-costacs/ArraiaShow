import { db } from "../config/db.js";

// Criar um novo produto
export const criarProduto = (req, res) => {
    const { barraca_id, nome, preco, estoque } = req.body;
    const query = 'INSERT INTO produtos (barraca_id, nome, preco, estoque) VALUES (?, ?, ?, ?)';

    db.query(query, [barraca_id, nome, preco, estoque], (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(201).json({ message: "Produto criado com sucesso!", id: result.insertId });
    }
);};

// Listar todos os produtos de uma barraca específica
export const listarProdutosPorBarraca = (req, res) => {
    const { barracaId } = req.params;
    const query = 'SELECT * FROM produtos WHERE barraca_id = ?';

    db.query(query, [barracaId], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });};

// Buscar um produto por ID
export const listarProdutoPorId = (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM produtos WHERE id = ?';

    db.query(query, [id], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) return res.status(404).json({ message: "Produto não encontrado" });
        res.json(results[0]);
    }
);};

// Atualizar um produto
export const atualizarProduto = (req, res) => {
    const { id } = req.params;
    const { nome, preco, estoque } = req.body;
    const query = 'UPDATE produtos SET nome = ?, preco = ?, estoque = ? WHERE id = ?';

    db.query(query, [nome, preco, estoque, id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Produto atualizado com sucesso!" });
    });};

// Deletar um produto
export const deletarProduto = (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM produtos WHERE id = ?';
    
    db.query(query, [id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Produto deletado com sucesso!" });
    });
}

//Listar todos os produtos independente de barraca
export const listarTodosProdutos = (req, res) => {
    const query = 'SELECT * FROM produtos';

    db.query(query, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
}