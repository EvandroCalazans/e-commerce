const Cliente = require("../models/Cliente");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.cadastrar = async (req, res) => {

    try {

        const { nome, email, senha } = req.body;

        const senhaHash = await bcrypt.hash(senha, 10);

        const dados = {
            nome,
            email,
            senha: senhaHash
        };

        Cliente.cadastrar(
            dados,
            (erro, resultado) => {

                if (erro) {
                    return res.status(500).json(erro);
                }

                res.json({
                    mensagem: "Cliente cadastrado com sucesso"
                });
            }
        );

    } catch (error) {

        return res.status(500).json({
            mensagem: "Erro ao cadastrar cliente",
            erro: error
        });
    }
};

// LOGIN DO CLIENTE
exports.login = async (req, res) => {

    try {

        const { email, senha } = req.body;

        Cliente.buscarPorEmail(
            email,
            async (erro, cliente) => {

                if (erro) {
                    return res.status(500).json(erro);
                }

                if (!cliente) {
                    return res.status(401).json({
                        mensagem: "Cliente não encontrado"
                    });
                }

                const senhaValida =
                    await bcrypt.compare(
                        senha,
                        cliente.senha
                    );

                if (!senhaValida) {
                    return res.status(401).json({
                        mensagem: "Senha inválida"
                    });
                }

                const token = jwt.sign(
                    {
                        id: cliente.id,
                        email: cliente.email
                    },
                    "CHAVE_SECRETA",
                    {
                        expiresIn: "2h"
                    }
                );

                res.json({
                    mensagem: "Login realizado com sucesso",
                    token
                });
            }
        );

    } catch (error) {

        res.status(500).json({
            mensagem: "Erro no login",
            erro: error
        });
    }
};