CREATE DATABASE IF NOT EXISTS loja_virtual;

USE loja_virtual;

-- ==========================================
-- TABELA DE ADMINISTRADORES
-- ==========================================

CREATE TABLE administradores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL
);

-- ==========================================
-- TABELA DE CLIENTES
-- ==========================================

CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    email VARCHAR(100),
    senha VARCHAR(255),
    role VARCHAR(20) DEFAULT 'cliente'
);

-- ==========================================
-- TABELA DE PRODUTOS
-- ==========================================

CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    preco DECIMAL(10,2),
    descricao TEXT,
    imagem VARCHAR(255),
    estoque INT DEFAULT 0,
    categoria VARCHAR(100) NOT NULL DEFAULT 'Geral'
);

-- ==========================================
-- TABELA DE PEDIDOS
-- ==========================================

CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT,
    valor_total DECIMAL(10,2),
    frete DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    data_pedido DATETIME,
    status VARCHAR(20) NOT NULL DEFAULT 'Pendente',
    FOREIGN KEY (cliente_id)
        REFERENCES clientes(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- ==========================================
-- TABELA DE ITENS DOS PEDIDOS
-- ==========================================

CREATE TABLE itens_pedido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    produto_id INT NOT NULL,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (pedido_id)
        REFERENCES pedidos(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (produto_id)
        REFERENCES produtos(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);