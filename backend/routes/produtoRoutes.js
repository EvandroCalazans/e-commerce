const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');
const auth = require('../middleware/authMiddleware');

// ==========================
// ROTAS PÚBLICAS
// ==========================

// listar produtos
router.get(
    '/',
    produtoController.listarProdutos
);

// ==========================
// DASHBOARD ADMIN
// ==========================

// estoque baixo
router.get(
    '/estoque-baixo',
    auth,
    produtoController.estoqueBaixo
);

// produtos mais vendidos
router.get(
    '/mais-vendidos',
    auth,
    produtoController.maisVendidos
);

// ==========================
// ROTAS POR ID
// ==========================

// buscar produto por ID
router.get(
    '/:id',
    produtoController.buscarProdutoPorId
);

// ==========================
// ROTAS ADMINISTRATIVAS
// ==========================

// cadastrar produto
router.post(
    '/',
    auth,
    produtoController.criarProduto
);

// editar produto
router.put(
    '/:id',
    auth,
    produtoController.editarProduto
);

// excluir produto
router.delete(
    '/:id',
    auth,
    produtoController.excluirProduto
);

module.exports = router;