document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("tokenAdmin");
    const configAuth = {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    };

    // ==========================================
    // TOTAL DE PRODUTOS
    // ==========================================

    fetch("/api/produtos", configAuth)
        .then(res => res.json())
        .then(produtos => {
            document.getElementById(
                "totalProdutos"
            ).textContent = produtos.length;
        })
        .catch(erro => {
            console.error(
                "Erro ao carregar produtos:",
                erro
            );
        });

    // ==========================================
    // PEDIDOS
    // ==========================================

    fetch("/api/pedidos", configAuth)
        .then(res => res.json())
        .then(pedidos => {
            document.getElementById(
                "totalPedidos"
            ).textContent = pedidos.length;

            let faturamento = 0;
            let pendentes = 0;
            let pagos = 0;
            let enviados = 0;
            let entregues = 0;
            let cancelados = 0;

            pedidos.forEach(pedido => {
                faturamento += Number(pedido.valor_total);

                switch (pedido.status) {
                    case "Pendente":
                        pendentes++;
                        break;
                    case "Pago":
                        pagos++;
                        break;
                    case "Enviado":
                        enviados++;
                        break;
                    case "Entregue":
                        entregues++;
                        break;
                    case "Cancelado":
                        cancelados++;
                        break;
                }
            });

            document.getElementById(
                "faturamentoTotal"
            ).textContent =
                "R$ " +
                faturamento
                    .toFixed(2)
                    .replace(".", ",");

            document.getElementById(
                "pedidosPendentes"
            ).textContent = pendentes;

            document.getElementById(
                "pedidosPagos"
            ).textContent = pagos;

            document.getElementById(
                "pedidosEnviados"
            ).textContent = enviados;

            document.getElementById(
                "pedidosEntregues"
            ).textContent = entregues;

            document.getElementById(
                "pedidosCancelados"
            ).textContent = cancelados;
        })
        .catch(erro => {
            console.error(
                "Erro ao carregar pedidos:",
                erro
            );
        });

    // ==========================================
    // ESTOQUE BAIXO
    // ==========================================

    fetch("/api/produtos/estoque-baixo", configAuth)
        .then(res => res.json())
        .then(produtos => {
            const div = document.getElementById(
                "estoqueBaixo"
            );

            if (!div) {
                return;
            }

            div.innerHTML = "";

            if (produtos.length === 0) {
                div.innerHTML = `
                    <p>
                        ✅ Todos os produtos possuem estoque suficiente.
                    </p>
                `;

                return;
            }

            produtos.forEach(produto => {
                div.innerHTML += `
                    <div class="item-estoque">
                        <strong>
                            ${produto.nome}
                        </strong>
                        -
                        ${produto.estoque}
                        unidade(s)
                    </div>
                `;
            });
        })
        .catch(erro => {
            console.error(
                "Erro ao consultar estoque:",
                erro
            );
        });

    // ==========================================
    // PRODUTOS MAIS VENDIDOS
    // ==========================================

    fetch("/api/produtos/mais-vendidos", configAuth)
        .then(res => res.json())
        .then(produtos => {
            const div = document.getElementById(
                "maisVendidos"
            );

            if (!div) {
                return;
            }

            div.innerHTML = "";

            produtos.forEach((produto, index) => {
                let medalha = "";

                if (index === 0) {
                    medalha = "🥇";
                } else if (index === 1) {
                    medalha = "🥈";
                } else if (index === 2) {
                    medalha = "🥉";
                }

                div.innerHTML += `
                    <div class="item-vendido">
                        ${medalha}
                        <strong>
                            ${produto.produto}
                        </strong>
                        -
                        ${produto.total_vendido}
                        venda(s)
                    </div>
                `;
            });
        })
        .catch(erro => {
            console.error(
                "Erro ao consultar produtos vendidos:",
                erro
            );
        });
});