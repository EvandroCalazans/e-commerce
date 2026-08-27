const db = require('../config/database');

class Pedido {

    // ==========================
    // LISTAR PEDIDOS
    // ==========================

    static listar(callback) {

        db.query(
            `SELECT
                p.id,
                p.cliente_id,
                c.nome AS cliente,
                p.valor_total,
                p.frete,
                p.status,
                p.data_pedido
             FROM pedidos p
             LEFT JOIN clientes c
             ON c.id = p.cliente_id
             ORDER BY p.id DESC`,
            callback
        );

    }

    // ==========================
    // CRIAR PEDIDO
    // ==========================

    static criar(dados, callback) {

        const sql = `
            INSERT INTO pedidos
            (
                cliente_id,
                valor_total,
                frete,
                status,
                data_pedido
            )
            VALUES (?, ?, ?, ?, ?)
        `;

        db.query(
            sql,
            [
                dados.cliente_id,
                dados.valor_total,
                dados.frete,
                dados.status,
                dados.data_pedido
            ],
            callback
        );

    }

    // ==========================
    // BUSCAR PEDIDO POR ID
    // ==========================

    static buscarPorId(id, callback) {

        const sql = `
            SELECT
                p.id,
                p.valor_total,
                p.frete,
                p.status,
                p.data_pedido,
                c.nome AS cliente
            FROM pedidos p
            LEFT JOIN clientes c
            ON c.id = p.cliente_id
            WHERE p.id = ?
        `;

        db.query(
            sql,
            [id],
            callback
        );

    }

    // ==========================
    // BUSCAR ITENS DO PEDIDO
    // ==========================

    static buscarItens(id, callback) {

        const sql = `
            SELECT
                ip.id,
                ip.quantidade,
                ip.preco_unitario,
                p.nome AS produto,
                p.imagem
            FROM itens_pedido ip
            INNER JOIN produtos p
            ON p.id = ip.produto_id
            WHERE ip.pedido_id = ?
        `;

        db.query(
            sql,
            [id],
            callback
        );

    }

    // ==========================
    // ATUALIZAR STATUS DO PEDIDO
    // ==========================

    static atualizarStatus(id, status, callback) {

        const sql = `
            UPDATE pedidos
            SET status = ?
            WHERE id = ?
        `;

        db.query(
            sql,
            [
                status,
                id
            ],
            callback
        );

    }

}

module.exports = Pedido;