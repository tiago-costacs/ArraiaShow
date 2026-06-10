import express from 'express';
import { criarBarraca, listarBarracasPorEvento, listartodasBarracas, atualizarBarraca, deletarBarraca } from '../controllers/barracasController.js';
import { verificarOrganizador } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rota para cadastrar (POST)
router.post('/', verificarOrganizador, criarBarraca);

// Rota para buscar barracas de um evento (GET)
router.get('/evento/:eventoId', listarBarracasPorEvento);

// Rota para buscar todas as barracas (GET)
router.get('/', listartodasBarracas);

// Rota para atualizar uma barraca (PUT)
router.put('/:id', verificarOrganizador, atualizarBarraca);

// Rota para excluir uma barraca (DELETE)
router.delete('/:id', verificarOrganizador, deletarBarraca);

export default router;
