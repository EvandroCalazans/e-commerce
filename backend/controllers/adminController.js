require('dotenv').config({
    path: require('path').join(__dirname, '../../.env')
});

const db = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = (req, res) => {

    console.log("ENTROU NO LOGIN ADMIN");
    console.log(req.body);

    const { email, senha } = req.body;

    db.query(
        "SELECT * FROM administradores WHERE email = ?",
        [email],
        async (erro, resultados) => {

            if (erro) {
                return res.status(500).json(erro);
            }

            if (resultados.length === 0) {
                return res.status(401).json({
                    mensagem: "Administrador não encontrado"
                });
            }

            const admin = resultados[0];

            const senhaValida = await bcrypt.compare(
                senha,
                admin.senha
            );

            console.log("Email recebido:", email);
            console.log("Senha digitada:", senha);
            console.log("Hash do banco:", admin.senha);
            console.log("Senha válida?", senhaValida);

            if (!senhaValida) {
                return res.status(401).json({
                    mensagem: "Senha inválida"
                });
            }

            const token = jwt.sign(
                {
                    id: admin.id,
                    email: admin.email,
                    role: "admin"
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "8h"
                }
            );

            res.json({
                mensagem: "Login administrativo realizado",
                token
            });
        }
    );
};
