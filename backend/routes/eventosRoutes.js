import express from "express";
import { criarEvento, listarEventos, listarEventoPorId, atualizarEvento, deletarEvento } from '../controllers/eventosController.js';
import { verificarOrganizador } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rota para criar um evento (POST)
router.post('/', verificarOrganizador, criarEvento);

// Rota para listar todos os eventos (GET)
router.get('/', listarEventos);

// Rota para buscar um evento por ID (GET)
router.get('/:id', listarEventoPorId);

// Rota para atualizar um evento (PUT)
router.put('/:id', verificarOrganizador, atualizarEvento);

// Rota para excluir um evento (DELETE)
router.delete('/:id', verificarOrganizador, deletarEvento);

export default router;
export { listarEventos };