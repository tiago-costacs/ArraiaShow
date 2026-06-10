import { db } from '../config/db.js';

// O banco usa 'admin' para simplificar a hierarquia
const TIPOS_VALIDOS = ['participante', 'barraqueiro', 'organizador', 'admin'];

export const listarUsuarios = (req, res) => {
    const query = 'SELECT id, nome, email, tipo, evento_id, criado_em FROM usuarios ORDER BY criado_em DESC, id DESC';

    db.query(query, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};

export const listarUsuarioPorId = (req, res) => {
    const { id } = req.params;
    const query = 'SELECT id, nome, email, tipo, evento_id, criado_em FROM usuarios WHERE id = ?';

    db.query(query, [id], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) return res.status(404).json({ message: 'Usuario nao encontrado' });
        res.json(results[0]);
    });
};

// Atualizar o tipo/perfil de um usuário — usado pelo AdminApp
export const atualizarTipoUsuario = (req, res) => {
    const { id } = req.params;
    const { tipo } = req.body;

    if (!tipo || !TIPOS_VALIDOS.includes(tipo)) {
        return res.status(400).json({
            error: `Tipo invalido. Valores aceitos: ${TIPOS_VALIDOS.join(', ')}`
        });
    }

    // Impede que o admin rebaixe a si mesmo
    if (req.usuarioId && Number(req.usuarioId) === Number(id) && tipo !== 'admin') {
        return res.status(403).json({ error: 'Voce nao pode alterar o proprio tipo.' });
    }

    const query = 'UPDATE usuarios SET tipo = ? WHERE id = ?';

    db.query(query, [tipo, id], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Usuario nao encontrado' });
        res.json({ message: `Tipo atualizado para "${tipo}" com sucesso.` });
    });
};

export const atualizarEventoUsuario = (req, res) => {
    const { id } = req.params;
    const { evento_id } = req.body;

    if (evento_id === undefined || evento_id === null) {
        return res.status(400).json({ error: 'evento_id e obrigatorio.' });
    }

    const query = 'UPDATE usuarios SET evento_id = ? WHERE id = ?';

    db.query(query, [evento_id, id], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Usuario nao encontrado' });
        res.json({ message: 'Evento do usuario atualizado com sucesso.' });
    });
};

export const deletarUsuario = (req, res) => {
    const { id } = req.params;

    if (req.usuarioId && Number(req.usuarioId) === Number(id)) {
        return res.status(403).json({ message: 'Voce nao pode excluir o proprio usuario.' });
    }

    const query = 'DELETE FROM usuarios WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Usuario nao encontrado' });
        res.json({ message: 'Usuario excluido com sucesso.' });
    });
};

export const listarParticipantes = (req, res) => {
    const query = 'SELECT id, nome, email, tipo, evento_id, criado_em FROM usuarios WHERE tipo = ? ORDER BY criado_em DESC, id DESC';

    db.query(query, ['participante'], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};