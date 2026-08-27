const Pedido = require('../models/Pedido');
const ItemPedido = require('../models/ItemPedido');
const Produto = require('../models/Produto');
const db = require('../config/database');

// ==========================
// LISTAR PEDIDOS
// ==========================

exports.listarPedidos = (req, res) => {

    Pedido.listar((erro, resultados) => {

        if (erro) {

            console.error(erro);

            return res.status(500).json({
                mensagem: "Erro ao listar pedidos"
            });

        }

        res.json(resultados);
    });
};

// ==========================
// CRIAR PEDIDO
// ==========================

exports.criarPedido = (req, res) => {

    const itens = req.body.itens;

    if (!itens || itens.length === 0) {

        return res.status(400).json({
            mensagem: "Carrinho vazio"
        });
    }

    let verificacoes = 0;
    let estoqueOk = true;

    itens.forEach(item => {

        Produto.verificarEstoque(
            item.produto_id,
            (erro, resultado) => {

                if (erro) {

                    return res.status(500).json({
                        mensagem: "Erro ao verificar estoque"
                    });
                }

                if (
                    resultado.length === 0 ||
                    resultado[0].estoque < item.quantidade
                ) {

                    estoqueOk = false;
                }

                verificacoes++;

                if (verificacoes === itens.length) {

                    if (!estoqueOk) {

                        return res.status(400).json({
                            mensagem: "Produto sem estoque suficiente"
                        });
                    }

                    salvarPedido();
                }
            }
        );
    });

    function salvarPedido() {

        const pedido = {
            cliente_id: req.body.cliente_id,
            valor_total: req.body.valor_total,
            frete: req.body.frete,
            status: "Pendente",
            data_pedido: new Date()
        };

        Pedido.criar(
            pedido,
            (erro, resultado) => {

                if (erro) {

                    console.error(erro);

                    return res.status(500).json({
                        mensagem: "Erro ao criar pedido"
                    });
                }

                const pedidoId = resultado.insertId;
                let salvos = 0;

                itens.forEach(item => {

                    const itemPedido = {
                        pedido_id: pedidoId,
                        produto_id: item.produto_id,
                        quantidade: item.quantidade,
                        preco_unitario: item.preco
                    };

                    ItemPedido.criar(
                        itemPedido,
                        erroItem => {

                            if (erroItem) {

                                return res.status(500).json({
                                    mensagem: "Erro ao salvar itens"
                                });
                            }

                            Produto.baixarEstoque(
                                item.produto_id,
                                item.quantidade,
                                erroEstoque => {

                                    if (erroEstoque) {

                                        return res.status(500).json({
                                            mensagem: "Erro ao baixar estoque"
                                        });
                                    }

                                    salvos++;

                                    if (salvos === itens.length) {

                                        res.json({
                                            mensagem: "Pedido criado com sucesso",
                                            pedido_id: pedidoId
                                        });
                                    }
                                }
                            );
                        }
                    );
                });
            }
        );
    }
};

// ==========================
// DETALHES DO PEDIDO
// ==========================

exports.detalhesPedido = (req, res) => {

    const id = req.params.id;

    Pedido.buscarItens(
        id,
        (erro, resultado) => {

            if (erro) {

                console.error(erro);

                return res.status(500).json({
                    mensagem: "Erro ao buscar detalhes do pedido"
                });
            }

            res.json(resultado);
        }
    );
};

// ==========================
// BUSCAR PEDIDO POR ID
// ==========================

exports.buscarPedido = (req, res) => {

    const id = req.params.id;

    Pedido.buscarPorId(
        id,
        (erro, resultado) => {

            if (erro) {

                console.error(erro);

                return res.status(500).json({
                    mensagem: "Erro ao buscar pedido"
                });
            }

            if (resultado.length === 0) {

                return res.status(404).json({
                    mensagem: "Pedido não encontrado"
                });
            }

            res.json(resultado[0]);
        }
    );
};

// ==========================
// ATUALIZAR STATUS DO PEDIDO
// ==========================

exports.atualizarStatusPedido = (req, res) => {

    const id = req.params.id;
    const { status } = req.body;

    if (!status) {

        return res.status(400).json({
            mensagem: "Status não informado"
        });
    }

    Pedido.atualizarStatus(
        id,
        status,
        erro => {

            if (erro) {

                console.error(erro);

                return res.status(500).json({
                    mensagem: "Erro ao atualizar status"
                });
            }

            res.json({
                mensagem: "Status atualizado com sucesso"
            });
        }
    );
};

// ==========================
// PRODUTOS MAIS VENDIDOS
// ==========================

exports.produtosVendidos = (req, res) => {

    const sql = `
        SELECT
            p.nome AS produto,
            SUM(ip.quantidade) AS total_vendido
        FROM itens_pedido ip
        INNER JOIN produtos p
            ON p.id = ip.produto_id
        GROUP BY p.id
        ORDER BY total_vendido DESC
        LIMIT 10
    `;

    db.query(
        sql,
        (erro, resultados) => {

            if (erro) {

                console.error(erro);

                return res.status(500).json({
                    mensagem: "Erro ao buscar produtos vendidos"
                });
            }

            res.json(resultados);
        }
    );
};