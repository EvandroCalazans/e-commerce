const db = require('../config/database');

class Produto {

    // ==========================
    // LISTAR PRODUTOS
    // ==========================
    static listar(callback) {

        db.query(
            'SELECT * FROM produtos',
            callback
        );

    }

    // ==========================
    // BUSCAR PRODUTO POR ID
    // ==========================
    static buscarPorId(id, callback) {

        db.query(
            'SELECT * FROM produtos WHERE id = ?',
            [id],
            callback
        );

    }

    // ==========================
    // CRIAR PRODUTO
    // ==========================
    static criar(produto, callback) {

        db.query(
            'INSERT INTO produtos SET ?',
            produto,
            callback
        );

    }

    // ==========================
    // VERIFICAR ESTOQUE
    // ==========================
    static verificarEstoque(id, callback) {

        db.query(
            'SELECT estoque FROM produtos WHERE id = ?',
            [id],
            callback
        );

    }

    // ==========================
    // BAIXAR ESTOQUE
    // ==========================
    static baixarEstoque(id, quantidade, callback) {

        const sql = `
            UPDATE produtos
            SET estoque = estoque - ?
            WHERE id = ?
        `;

        db.query(
            sql,
            [
                quantidade,
                id
            ],
            callback
        );

    }

    // ==========================
    // PRODUTOS COM ESTOQUE BAIXO
    // ==========================
    static estoqueBaixo(callback) {

        const sql = `
            SELECT
                id,
                nome,
                estoque
            FROM produtos
            WHERE estoque <= 5
            ORDER BY estoque ASC,
                     nome ASC
        `;

        db.query(
            sql,
            callback
        );

    }

}

module.exports = Produto;