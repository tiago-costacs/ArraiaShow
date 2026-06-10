import express from 'express';
import {
    atualizarStatusPedido,
    criarPedido,
    listarPedidos,
    listarPedidosPorBarraca,
    listarPedidosPorUsuario
} from '../controllers/pedidosController.js';

const router = express.Router();

router.post('/', criarPedido);
router.get('/', listarPedidos);
router.get('/usuario/:usuarioId', listarPedidosPorUsuario);
router.get('/barraca/:barracaId', listarPedidosPorBarraca);
router.put('/:id/status', atualizarStatusPedido);

export default router;