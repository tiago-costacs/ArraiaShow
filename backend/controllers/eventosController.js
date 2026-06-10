import { db } from "../config/db.js";

export const criarEvento = (req, res) => {
    const { nome, endereco, horario, descricao, ativo = true, organizador_id } = req.body;
    const dataEvento = req.body.data_evento || req.body.data;

    if (!nome || !dataEvento || !endereco || !horario) {
        return res.status(400).json({ error: "Nome, Data, Endereço e Horário são obrigatórios." });
    }

    const query = 'INSERT INTO eventos (nome, data_evento, endereco, horario, descricao, ativo, organizador_id) VALUES (?, ?, ?, ?, ?, ?, ?)';

    db.query(query, [nome, dataEvento, endereco, horario, descricao, ativo, organizador_id || null], (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(201).json({ message: "Evento criado com sucesso!", id: result.insertId });
    });
};

export const listarEventos = (req, res) => {
    const query = 'SELECT * FROM eventos ORDER BY data_evento DESC, id DESC';

    db.query(query, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};

export const listarEventoPorId = (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM eventos WHERE id = ?';

    db.query(query, [id], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) return res.status(404).json({ message: "Evento nao encontrado" });
        res.json(results[0]);
    });
};

export const atualizarEvento = (req, res) => {
    const { id } = req.params;
    const { nome, data_evento, endereco, horario, descricao, ativo, organizador_id } = req.body;

    // Se o organizador_id não for enviado ou for vazio, definimos como null no banco
    const orgId = organizador_id || null;

    const query = `
        UPDATE eventos 
        SET nome = COALESCE(?, nome), 
            data_evento = COALESCE(?, data_evento), 
            endereco = COALESCE(?, endereco), 
            horario = COALESCE(?, horario), 
            descricao = COALESCE(?, descricao), 
            ativo = COALESCE(?, ativo),
            organizador_id = ?
        WHERE id = ?`;

    db.query(query, [nome, data_evento, endereco, horario, descricao, ativo, orgId, id], (err, result) => {
        if (err) {
            console.error("Erro ao atualizar evento:", err);
            return res.status(500).json(err);
        }
        if (result.affectedRows === 0) return res.status(404).json({ message: "Evento não encontrado" });
        res.json({ message: "Evento atualizado com sucesso!" });
    });
};

export const deletarEvento = (req, res) => {
    const { id } = req.params;

    // Deleção em cascata:
    // 1. Buscar todas as barracas do evento
    const getBarracasQuery = 'SELECT id FROM barracas WHERE evento_id = ?';
    
    db.query(getBarracasQuery, [id], (err, barracas) => {
        if (err) return res.status(500).json(err);
        
        if (barracas.length === 0) {
            // Sem barracas, deletar diretamente
            const deleteEventoQuery = 'DELETE FROM eventos WHERE id = ?';
            db.query(deleteEventoQuery, [id], (err, result) => {
                if (err) return res.status(500).json(err);
                if (result.affectedRows === 0) return res.status(404).json({ message: 'Evento não encontrado' });
                res.json({ message: 'Evento deletado com sucesso.' });
            });
            return;
        }

        // Tem barracas, precisamos deletar tudo em cascata
        const barracaIds = barracas.map(b => b.id);
        
        // 2. Deletar itens de pedido das barracas
        const deleteItensQuery = `
            DELETE FROM itens_pedido 
            WHERE pedido_id IN (
                SELECT id FROM pedidos WHERE barraca_id IN (${barracaIds.join(',')})
            )
        `;
        
        db.query(deleteItensQuery, (err) => {
            if (err) return res.status(500).json(err);
            
            // 3. Deletar pedidos das barracas
            const deletePedidosQuery = `DELETE FROM pedidos WHERE barraca_id IN (${barracaIds.join(',')})`;
            db.query(deletePedidosQuery, (err) => {
                if (err) return res.status(500).json(err);
                
                // 4. Deletar produtos das barracas
                const deleteProdutosQuery = `DELETE FROM produtos WHERE barraca_id IN (${barracaIds.join(',')})`;
                db.query(deleteProdutosQuery, (err) => {
                    if (err) return res.status(500).json(err);
                    
                    // 5. Deletar barracas do evento
                    const deleteBarracasQuery = 'DELETE FROM barracas WHERE evento_id = ?';
                    db.query(deleteBarracasQuery, [id], (err) => {
                        if (err) return res.status(500).json(err);
                        
                        // 6. Deletar evento
                        const deleteEventoQuery = 'DELETE FROM eventos WHERE id = ?';
                        db.query(deleteEventoQuery, [id], (err, result) => {
                            if (err) return res.status(500).json(err);
                            if (result.affectedRows === 0) return res.status(404).json({ message: 'Evento não encontrado' });
                            res.json({ message: 'Evento deletado com sucesso.' });
                        });
                    });
                });
            });
        });
    });
};