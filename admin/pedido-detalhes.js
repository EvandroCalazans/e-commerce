document.addEventListener("DOMContentLoaded", () => {

    const parametros =
        new URLSearchParams(
            window.location.search
        );

    const id =
        parametros.get("id");

    if (!id) {

        window.location.href =
            "pedidos.html";

        return;
    }

    const configAuth = {
        headers: {
            "Authorization":
                "Bearer " + localStorage.getItem("tokenAdmin")
        }
    };

    const lista =
        document.getElementById(
            "listaItens"
        );

    const info =
        document.getElementById(
            "informacoesPedido"
        );

    const statusPedido =
        document.getElementById(
            "statusPedido"
        );

    // ==========================================
    // CARREGAR INFORMAÇÕES DO PEDIDO
    // ==========================================

    function carregarInformacoesPedido() {

        fetch(
            `/api/pedidos/${id}`,
            configAuth
        )
            .then(res => {

                if (!res.ok) {
                    throw new Error(
                        "Erro ao carregar informações do pedido."
                    );
                }

                return res.json();

            })
            .then(pedido => {

                document.getElementById(
                    "tituloPedido"
                ).textContent =
                    `Pedido Nº ${pedido.id}`;

                statusPedido.value =
                    pedido.status;

                const data =
                    new Date(
                        pedido.data_pedido
                    ).toLocaleDateString("pt-BR");

                info.innerHTML = `
                    <p>
                        <strong>Pedido:</strong>
                        Nº ${pedido.id}
                    </p>

                    <p>
                        <strong>Cliente:</strong>
                        ${pedido.cliente}
                    </p>

                    <p>
                        <strong>Data:</strong>
                        ${data}
                    </p>

                    <p>
                        <strong>Status:</strong>
                        ${pedido.status}
                    </p>
                `;

                // Guarda o total real do pedido,
                // já incluindo o frete.
                window.valorTotalPedido =
                    Number(pedido.valor_total);

                window.fretePedido =
                    Number(pedido.frete);

            })
            .catch(erro => {

                console.error(
                    "Erro ao carregar pedido:",
                    erro
                );

            });
    }

    // ==========================================
    // CARREGAR ITENS DO PEDIDO
    // ==========================================

    function carregarItensPedido() {

        fetch(
            `/api/pedidos/${id}/itens`,
            configAuth
        )
            .then(res => {

                if (!res.ok) {
                    throw new Error(
                        "Erro ao carregar itens do pedido."
                    );
                }

                return res.json();

            })
            .then(itens => {

                lista.innerHTML = "";

                let subtotalProdutos = 0;

                itens.forEach(item => {

                    const precoUnitario =
                        Number(item.preco_unitario);

                    const quantidade =
                        Number(item.quantidade);

                    const subtotal =
                        precoUnitario * quantidade;

                    subtotalProdutos += subtotal;

                    lista.innerHTML += `
                        <tr>

                            <!-- IMAGEM -->

                            <td>

                                ${
                                    item.imagem
                                    ? `<img
                                        src="../${item.imagem}"
                                        width="70"
                                        alt="${item.produto || "Produto"}"
                                      >`
                                    : "Sem imagem"
                                }

                            </td>

                            <!-- PRODUTO -->

                            <td>
                                ${item.produto}
                            </td>

                            <!-- QUANTIDADE -->

                            <td>
                                ${quantidade}
                            </td>

                            <!-- PREÇO UNITÁRIO -->

                            <td>

                                R$ ${precoUnitario
                                    .toFixed(2)
                                    .replace(".", ",")}

                            </td>

                            <!-- SUBTOTAL -->

                            <td>

                                R$ ${subtotal
                                    .toFixed(2)
                                    .replace(".", ",")}

                            </td>

                        </tr>
                    `;

                });

                /*
                    O subtotal dos produtos é calculado
                    somente para conferência.

                    O TOTAL FINAL usa valor_total do pedido,
                    pois esse valor já contém o frete.
                */

                const totalPedido =
                    Number(window.valorTotalPedido);

                const frete =
                    Number(window.fretePedido);

                // ==========================
                // MOSTRAR SUBTOTAL
                // ==========================

                document.getElementById(
                    "subtotalPedido"
                ).textContent =
                    `Subtotal dos produtos: R$ ${subtotalProdutos
                        .toFixed(2)
                        .replace(".", ",")}`;

                // ==========================
                // MOSTRAR FRETE
                // ==========================

                document.getElementById(
                    "fretePedido"
                ).textContent =
                    `Frete: R$ ${frete
                        .toFixed(2)
                        .replace(".", ",")}`;

                // ==========================
                // MOSTRAR TOTAL
                // ==========================

                const totalFinal =
                    Number.isFinite(totalPedido)
                    ? totalPedido
                    : subtotalProdutos + frete;

                document.getElementById(
                    "totalPedido"
                ).textContent =
                    `Total: R$ ${totalFinal
                        .toFixed(2)
                        .replace(".", ",")}`;

            })
            .catch(erro => {

                console.error(
                    "Erro ao carregar itens:",
                    erro
                );

            });
    }

    // ==========================================
    // SALVAR STATUS
    // ==========================================

    function salvarStatus() {

        fetch(
            `/api/pedidos/${id}/status`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization":
                        "Bearer " +
                        localStorage.getItem("tokenAdmin")
                },
                body: JSON.stringify({
                    status:
                        statusPedido.value
                })
            }
        )
            .then(res => res.json())
            .then(resultado => {

                alert(
                    resultado.mensagem
                );

            })
            .catch(erro => {

                console.error(
                    "Erro ao atualizar status:",
                    erro
                );

                alert(
                    "Erro ao atualizar status."
                );

            });
    }

    // ==========================================
    // VOLTAR
    // ==========================================

    function voltarPedidos() {

        window.location.href =
            "pedidos.html";

    }

    // ==========================================
    // DISPONIBILIZA FUNÇÕES AO HTML
    // ==========================================

    window.salvarStatus =
        salvarStatus;

    window.voltarPedidos =
        voltarPedidos;

    // ==========================================
    // INICIALIZAÇÃO
    // ==========================================

    carregarInformacoesPedido();

    carregarItensPedido();

});