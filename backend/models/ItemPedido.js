const db = require('../config/database');

class ItemPedido {

    static criar(item, callback) {

        const sql = `
            INSERT INTO itens_pedido
            (
                pedido_id,
                produto_id,
                quantidade,
                preco_unitario
            )
            VALUES (?, ?, ?, ?)
        `;

        db.query(
            sql,
            [
                item.pedido_id,
                item.produto_id,
                item.quantidade,
                item.preco_unitario
            ],
            callback
        );
    }
}

module.exports = ItemPedido;