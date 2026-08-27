# Loja Virtual - E-commerce Full Stack

Sistema de e-commerce desenvolvido como projeto Full Stack, com frontend, backend, banco de dados MySQL e painel administrativo.

## Funcionalidades

- Cadastro e login de clientes
- Listagem de produtos
- Carrinho de compras
- Cálculo de frete por CEP
- Checkout e finalização de pedidos
- Login administrativo
- Autenticação com JWT
- Dashboard administrativo
- Gráficos de vendas
- Cadastro, edição e exclusão de produtos
- Controle de estoque
- Gerenciamento de clientes e pedidos
- Alteração do status dos pedidos

## Tecnologias

### Frontend

- HTML5
- CSS3
- JavaScript

### Backend

- Node.js
- Express
- JWT
- bcryptjs
- Multer
- CORS
- dotenv

### Banco de dados

- MySQL
- MySQL2

## Estrutura

- admin/ - Painel administrativo
- assets/ - Arquivos JavaScript e CSS
- backend/ - API e servidor Node.js
- database/ - Scripts do banco de dados
- img/ - Imagens dos produtos

## Banco de dados

O projeto utiliza o banco de dados MySQL loja_virtual.

O script de criação está em database/loja.sql.

## Execução

Na pasta do projeto:

```powershell
npm install
```

Na pasta backend:

```powershell
cd backend
npm install
npm start
```

O servidor é executado na porta 3000.

## Autor

**Evandro Calazans**

Projeto desenvolvido como parte dos estudos em Análise e Desenvolvimento de Sistemas.

