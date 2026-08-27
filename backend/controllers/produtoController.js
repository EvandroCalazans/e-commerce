const db = require('../config/database');

// ==========================
// LISTAR PRODUTOS
// ==========================

exports.listarProdutos = (req, res) => {

    db.query(
        'SELECT * FROM produtos',
        (erro, resultados) => {

            if (erro) {

                console.error(erro);

                return res.status(500).json({
                    mensagem: "Erro ao listar produtos"
                });
            }

            res.json(resultados);
        }
    );
};

// ==========================
// BUSCAR PRODUTO POR ID
// ==========================

exports.buscarProdutoPorId = (req, res) => {

    const { id } = req.params;

    db.query(
        'SELECT * FROM produtos WHERE id = ?',
        [id],
        (erro, resultado) => {

            if (erro) {

                console.error(erro);

                return res.status(500).json({
                    mensagem: "Erro ao buscar produto"
                });
            }

            if (resultado.length === 0) {

                return res.status(404).json({
                    mensagem: "Produto não encontrado"
                });
            }

            res.json(resultado[0]);
        }
    );
};

// ==========================
// CRIAR PRODUTO
// ==========================

exports.criarProduto = (req, res) => {

    const {
        nome,
        categoria,
        preco,
        estoque,
        descricao,
        imagem
    } = req.body;

    if (!nome || nome.trim() === "") {

        return res.status(400).json({
            mensagem: "Nome do produto obrigatório"
        });
    }

    if (Number(preco) < 0) {

        return res.status(400).json({
            mensagem: "Preço inválido"
        });
    }

    if (Number(estoque) < 0) {

        return res.status(400).json({
            mensagem: "Estoque inválido"
        });
    }

    db.query(
        `INSERT INTO produtos
        (nome, categoria, preco, estoque, descricao, imagem)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
            nome,
            categoria,
            preco,
            estoque,
            descricao,
            imagem
        ],
        (erro, resultado) => {

            if (erro) {

                console.error(erro);

                return res.status(500).json({
                    mensagem: "Erro ao cadastrar produto"
                });
            }

            res.json({
                mensagem: "Produto cadastrado com sucesso",
                id: resultado.insertId
            });
        }
    );
};

// ==========================
// EXCLUIR PRODUTO
// ==========================

exports.excluirProduto = (req, res) => {

    const { id } = req.params;

    db.query(
        'SELECT * FROM itens_pedido WHERE produto_id = ?',
        [id],
        (erro, resultado) => {

            if (erro) {

                console.error(erro);

                return res.status(500).json({
                    mensagem: "Erro ao excluir produto"
                });
            }

            if (resultado.length > 0) {

                return res.status(400).json({
                    mensagem:
                        "Este produto possui pedidos registrados e não pode ser excluído"
                });
            }

            db.query(
                'DELETE FROM produtos WHERE id = ?',
                [id],
                erro => {

                    if (erro) {

                        console.error(erro);

                        return res.status(500).json({
                            mensagem: "Erro ao excluir produto"
                        });
                    }

                    res.json({
                        mensagem: "Produto removido"
                    });
                }
            );
        }
    );
};

// ==========================
// EDITAR PRODUTO
// ==========================

exports.editarProduto = (req, res) => {

    const { id } = req.params;

    const {
        nome,
        categoria,
        preco,
        estoque,
        descricao,
        imagem
    } = req.body;

    if (Number(preco) < 0) {

        return res.status(400).json({
            mensagem: "Preço inválido"
        });
    }

    if (Number(estoque) < 0) {

        return res.status(400).json({
            mensagem: "Estoque inválido"
        });
    }

    db.query(
        `UPDATE produtos SET
        nome = ?,
        categoria = ?,
        preco = ?,
        estoque = ?,
        descricao = ?,
        imagem = ?
        WHERE id = ?`,
        [
            nome,
            categoria,
            preco,
            estoque,
            descricao,
            imagem,
            id
        ],
        erro => {

            if (erro) {

                console.error(erro);

                return res.status(500).json({
                    mensagem: "Erro ao atualizar produto"
                });
            }

            res.json({
                mensagem: "Produto atualizado com sucesso"
            });
        }
    );
};

// ==========================
// ESTOQUE BAIXO
// ==========================

exports.estoqueBaixo = (req, res) => {

    db.query(
        `SELECT
            id,
            nome,
            estoque
         FROM produtos
         WHERE estoque <= 5
         ORDER BY estoque ASC, nome ASC`,
        (erro, resultados) => {

            if (erro) {

                console.error(erro);

                return res.status(500).json({
                    mensagem: "Erro ao consultar estoque"
                });
            }

            res.json(resultados);
        }
    );
};

// ==========================
// PRODUTOS MAIS VENDIDOS
// ==========================

exports.maisVendidos = (req, res) => {

    const sql = `
        SELECT
            p.nome AS produto,
            SUM(ip.quantidade) AS total_vendido
        FROM itens_pedido ip
        INNER JOIN produtos p
            ON p.id = ip.produto_id
        GROUP BY p.id
        ORDER BY total_vendido DESC
        LIMIT 5
    `;

    db.query(
        sql,
        (erro, resultados) => {

            if (erro) {

                console.error(erro);

                return res.status(500).json({
                    mensagem:
                        "Erro ao consultar produtos mais vendidos"
                });
            }

            res.json(resultados);
        }
    );
};