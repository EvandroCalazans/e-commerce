const express = require("express");
const router = express.Router();
const clienteController = require("../controllers/clienteController");
const authMiddleware = require("../middleware/authMiddleware");

console.log(">>> clienteRoutes carregado");

// ==========================
// CADASTRO DE CLIENTE
// ==========================
router.post(
    "/cadastro",
    clienteController.cadastrar
);

// ==========================
// LOGIN CLIENTE
// ==========================
router.post(
    "/login",
    clienteController.login
);

// ==========================
// LISTAR CLIENTES ADMIN
// ==========================
router.get(
    "/admin",
    authMiddleware,
    clienteController.listarClientesAdmin
);

// ==========================
// HISTÓRICO DO CLIENTE
// ==========================
router.get(
    "/admin/:id/historico",
    authMiddleware,
    clienteController.historicoCliente
);

console.log(">>> rota /admin registrada");
console.log(">>> rota /admin/:id/historico registrada");

module.exports = router;