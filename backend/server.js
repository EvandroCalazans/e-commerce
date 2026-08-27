console.log('########## SERVIDOR ALTERADO 29/07/2026 ##########');
console.log('SERVER.JS ESTÁ SENDO EXECUTADO');

// ==========================
// IMPORTAÇÕES
// ==========================

const express = require('express');
const cors = require('cors');
const path = require('path');

// ==========================
// ROTAS
// ==========================

const adminRoutes = require('./routes/adminRoutes');
const produtoRoutes = require('./routes/produtoRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');
const clienteRoutes = require('./routes/clienteRoutes');

console.log(">>> clienteRoutes importado com sucesso");

// ==========================
// CRIAR SERVIDOR
// ==========================

const app = express();

// ==========================
// MIDDLEWARES
// ==========================

app.use(cors());
app.use(express.json());

// ==========================
// ROTAS DO ADMINISTRADOR
// ==========================

app.use(
    '/api/admin',
    adminRoutes
);

// ==========================
// SERVIR FRONTEND
// ==========================
//
// backend -> loja-virtual
//
// Permite abrir:
// index.html
// produtos.html
// admin/dashboard.html
//

app.use(
    express.static(
        path.join(__dirname, '..')
    )
);

app.get('/teste-evandro', (req, res) => {

    res.send('SERVIDOR NODE CORRETO');

});

// ==========================
// PÁGINA INICIAL
// ==========================

app.get('/', (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            '..',
            'index.html'
        )
    );

});

// ==========================
// API PRODUTOS
// ==========================

app.use(
    '/api/produtos',
    produtoRoutes
);

// ==========================
// API PEDIDOS
// ==========================

console.log('>>> Registrando rota /api/pedidos');

app.use(
    '/api/pedidos',
    pedidoRoutes
);

console.log('>>> Rota /api/pedidos registrada');

// ==========================
// API CLIENTES
// ==========================

app.use(
    '/api/clientes',
    clienteRoutes
);

console.log(
    '>>> Rota /api/clientes registrada'
);

// ==========================
// SERVIDOR
// ==========================

const PORT = 3000;

app.listen(PORT, () => {

    console.log(
        '>>> SERVIDOR INICIOU NA PORTA 3000'
    );

    console.log(
        '>>> Site: http://localhost:3000'
    );

    console.log(
        '>>> API Produtos: http://localhost:3000/api/produtos'
    );

    console.log(
        '>>> API Pedidos: http://localhost:3000/api/pedidos'
    );

});