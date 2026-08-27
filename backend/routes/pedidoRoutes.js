const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');
const auth = require('../middleware/authMiddleware');

// ==========================
// LISTAR PEDIDOS
// ==========================
router.get(
    '/',
    auth,
    pedidoController.listarPedidos
);

// ==========================
// PRODUTOS MAIS VENDIDOS
// ==========================
router.get(
    '/produtos-vendidos',
    auth,
    pedidoController.produtosVendidos
);

// ==========================
// DETALHES DO PEDIDO
// ==========================
router.get(
    '/:id',
    auth,
    pedidoController.buscarPedido
);

// ==========================
// ITENS DO PEDIDO
// ==========================
router.get(
    '/:id/itens',
    auth,
    pedidoController.detalhesPedido
);

// ==========================
// ATUALIZAR STATUS
// ==========================
router.put(
    '/:id/status',
    auth,
    pedidoController.atualizarStatusPedido
);

// ==========================
// CRIAR PEDIDO
// ==========================
router.post(
    '/',
    pedidoController.criarPedido
);

module.exports = router;