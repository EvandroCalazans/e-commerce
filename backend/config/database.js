require('dotenv').config({
    path: require('path').join(__dirname, '../../.env')
});

const mysql = require('mysql2');

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),

    ssl: {
        rejectUnauthorized: false
    },

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

db.getConnection((erro, conexao) => {

    if (erro) {
        console.error('ERRO AO CONECTAR AO MYSQL:');
        console.error(erro);
        return;
    }

    console.log('MYSQL CONECTADO COM SUCESSO!');
    conexao.release();
});

module.exports = db;
