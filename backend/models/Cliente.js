const db = require('../config/database');

class Cliente {

    static cadastrar(cliente, callback) {

        db.query(
            'INSERT INTO clientes SET ?',
            cliente,
            callback
        );
    }

    static buscarPorEmail(email, callback) {

        db.query(
            'SELECT * FROM clientes WHERE email = ?',
            [email],
            (erro, resultado) => {

                if (erro) {
                    return callback(erro, null);
                }

                if (resultado.length === 0) {
                    return callback(null, null);
                }

                callback(null, resultado[0]);
            }
        );
    }
}

module.exports = Cliente;