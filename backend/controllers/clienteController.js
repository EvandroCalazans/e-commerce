const Cliente = require("../models/Cliente");
const bcrypt = require("bcryptjs");
const db = require("../config/database");

// ==========================
// CADASTRAR CLIENTE
// ==========================

exports.cadastrar = async (req, res) => {

    try {

        const { nome, email, senha } = req.body;

        const verificarEmail = `
            SELECT id
            FROM clientes
            WHERE email = ?
        `;

        db.query(
            verificarEmail,
            [email],
            async (erro, resultado) => {

                if (erro) {
                    return res.status(500).json({
                        mensagem:
                            "Erro ao verificar e-mail"
                    });
                }

                if (resultado.length > 0) {
                    return res.status(400).json({
                        mensagem:
                            "Este e-mail já está cadastrado"
                    });
                }

                const senhaHash =
                    await bcrypt.hash(senha, 10);

                const dados = {
                    nome,
                    email,
                    senha: senhaHash
                };

                Cliente.cadastrar(
                    dados,
                    (erro, resultado) => {

                        if (erro) {
                            return res.status(500).json({
                                mensagem:
                                    "Erro ao cadastrar cliente"
                            });
                        }

                        res.json({
                            mensagem:
                                "Cliente cadastrado com sucesso"
                        });
                    }
                );
            }
        );

    } catch (error) {

        res.status(500).json({
            mensagem:
                "Erro ao cadastrar cliente"
        });
    }
};

// ==========================
// LISTAR CLIENTES ADMIN
// ==========================

exports.listarClientesAdmin = (req, res) => {

    const sql = `
        SELECT
            c.id,
            c.nome,
            c.email,
            COUNT(p.id) AS quantidade_pedidos,
            COALESCE(
                SUM(p.valor_total),
                0
            ) AS total_comprado
        FROM clientes c
        LEFT JOIN pedidos p
            ON p.cliente_id = c.id
        GROUP BY c.id
        ORDER BY c.id DESC
    `;

    db.query(
        sql,
        (erro, resultados) => {

            if (erro) {

                console.error(erro);

                return res.status(500).json({
                    mensagem:
                        "Erro ao buscar clientes"
                });
            }

            res.json(resultados);
        }
    );
};

// ==========================
// HISTÓRICO DO CLIENTE
// ==========================

exports.historicoCliente = (req, res) => {

    const { id } = req.params;

    const sql = `
        SELECT
            p.id,
            p.valor_total,
            p.status,
            p.data_pedido
        FROM pedidos p
        WHERE p.cliente_id = ?
        ORDER BY p.id DESC
    `;

    db.query(
        sql,
        [id],
        (erro, resultados) => {

            if (erro) {

                console.error(erro);

                return res.status(500).json({
                    mensagem:
                        "Erro ao buscar histórico do cliente"
                });
            }

            res.json(resultados);
        }
    );
};

// ==========================
// LOGIN CLIENTE
// ==========================

exports.login = (req, res) => {

    const { email, senha } = req.body;

    const sql = `
        SELECT *
        FROM clientes
        WHERE email = ?
    `;

    db.query(
        sql,
        [email],
        async (erro, resultado) => {

            if (erro) {

                console.error(erro);

                return res.status(500).json({
                    mensagem:
                        "Erro ao buscar cliente"
                });
            }

            if (resultado.length === 0) {

                return res.status(401).json({
                    mensagem:
                        "Email ou senha inválidos"
                });
            }

            const cliente = resultado[0];

            const senhaValida =
                await bcrypt.compare(
                    senha,
                    cliente.senha
                );

            if (!senhaValida) {

                return res.status(401).json({
                    mensagem:
                        "Email ou senha inválidos"
                });
            }

            res.json({
                mensagem:
                    "Login realizado com sucesso",

                cliente: {
                    id: cliente.id,
                    nome: cliente.nome,
                    email: cliente.email
                }
            });
        }
    );
};