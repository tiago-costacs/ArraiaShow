import { db } from '../config/db.js';

// Criar uma nova barraca
export const criarBarraca = (req, res) => {
    const { evento_id, nome, responsavel_id } = req.body;
    if (!evento_id || !nome || !responsavel_id) {
        return res.status(400).json({ error: "Evento, nome e responsavel sao obrigatorios para cadastrar barraca." });
    }

    const query = 'INSERT INTO barracas (evento_id, nome, responsavel_id) VALUES (?, ?, ?)';

    db.query(query, [evento_id, nome, responsavel_id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Erro ao criar barraca. Verifique se o Evento e o Responsável existem." });
        }
        res.status(201).json({ message: "Barraca cadastrada com sucesso!", id: result.insertId });
    });
};

// Listar todas as barracas de um evento específico
export const listarBarracasPorEvento = (req, res) => {
    const { eventoId } = req.params;
    const query = 'SELECT * FROM barracas WHERE evento_id = ?';

    db.query(query, [eventoId], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};
//Listar todas as barracas independente de evento
export const listartodasBarracas = (req, res) => {
    const query = `
        SELECT b.*, e.nome as evento_nome, u.nome as responsavel_nome 
        FROM barracas b
        LEFT JOIN eventos e ON b.evento_id = e.id
        LEFT JOIN usuarios u ON b.responsavel_id = u.id
    `;

    db.query(query, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};

export const atualizarBarraca = (req, res) => {
    const { id } = req.params;
    const { nome, evento_id, responsavel_id } = req.body;

    const query = `
        UPDATE barracas
        SET nome = COALESCE(?, nome),
            evento_id = COALESCE(?, evento_id),
            responsavel_id = COALESCE(?, responsavel_id)
        WHERE id = ?`;

    db.query(query, [nome, evento_id, responsavel_id, id], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Barraca nao encontrada' });
        res.json({ message: 'Barraca atualizada com sucesso.' });
    });
};

export const deletarBarraca = (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM barracas WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Barraca nao encontrada' });
        res.json({ message: 'Barraca excluida com sucesso.' });
    });
};