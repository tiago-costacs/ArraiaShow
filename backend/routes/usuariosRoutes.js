import express from 'express';
import { listarUsuarios, listarUsuarioPorId, listarParticipantes, atualizarTipoUsuario, atualizarEventoUsuario, deletarUsuario } from '../controllers/usuariosController.js';
import { verificarToken } from '../controllers/authController.js';
import { verificarAdmin, verificarBarraca } from '../middleware/authMiddleware.js';

const router = express.Router();

// Listar todos os usuários — só admin
router.get('/', verificarAdmin, listarUsuarios);
router.get('/participantes', verificarBarraca, listarParticipantes);

// Buscar usuário por ID — só admin
router.get('/:id', verificarAdmin, listarUsuarioPorId);

// Atualizar perfil de um usuário — só admin
router.put('/:id/tipo', verificarAdmin, atualizarTipoUsuario);
router.put('/:id/evento', verificarAdmin, atualizarEventoUsuario);

// Excluir usuário — só admin
router.delete('/:id', verificarAdmin, deletarUsuario);

export default router;