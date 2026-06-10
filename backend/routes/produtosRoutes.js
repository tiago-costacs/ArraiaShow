import express from 'express';
import { criarProduto, listarTodosProdutos, listarProdutosPorBarraca, deletarProduto, atualizarProduto } from '../controllers/produtosController.js';

const router = express.Router();

// Rota para cadastrar (POST)
router.post('/', criarProduto);

// Rota para buscar todos os produtos (GET)
router.get('/', listarTodosProdutos);

// Rota para buscar produtos de uma barraca (GET)
router.get('/barraca/:barracaId', listarProdutosPorBarraca);


// Rota  para deletar um produto (DELETE)
router.delete('/deletar/:id', deletarProduto);

// Rota para atualizar um produto (PUT)
router.put('/atualizar/:id', atualizarProduto);

export default router;