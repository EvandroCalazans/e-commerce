document.addEventListener("DOMContentLoaded", () => {

    const tabela = document.getElementById("listaPedidos");
    const filtroStatus = document.getElementById("filtroStatus");
    const buscarPedido = document.getElementById("buscarPedido");

    let colunaOrdenacao = null;
    let ordemCrescente = true;

    if (!tabela) return;

    // ==========================
    // INICIALIZAÇÃO
    // ==========================

    carregarPedidos();

    filtroStatus.addEventListener("change", carregarPedidos);
    buscarPedido.addEventListener("input", carregarPedidos);

    // ==========================
    // CARREGAR PEDIDOS
    // ==========================

    function carregarPedidos() {

        fetch("/api/pedidos", {
            headers: {
                "Authorization":
                    "Bearer " + localStorage.getItem("tokenAdmin")
            }
        })
            .then(async res => {

                if (res.status === 401) {

                    alert("Sessão expirada. Faça login novamente.");

                    localStorage.removeItem("tokenAdmin");

                    window.location.href =
                        "login.html";

                    return;
                }

                if (!res.ok) {

                    const erro =
                        await res.json();

                    throw new Error(
                        erro.mensagem ||
                        "Erro ao carregar pedidos"
                    );
                }

                return res.json();

            })
            .then(pedidos => {

                const filtro =
                    filtroStatus.value;

                // ==========================
                // FILTRO POR STATUS
                // ==========================

                if (filtro !== "Todos") {

                    pedidos =
                        pedidos.filter(
                            pedido =>
                                pedido.status === filtro
                        );
                }

                // ==========================
                // BUSCA
                // ==========================

                const busca =
                    buscarPedido.value
                        .toLowerCase()
                        .trim();

                if (busca !== "") {

                    if (!isNaN(busca)) {

                        // Busca exata pelo número do pedido

                        pedidos =
                            pedidos.filter(
                                pedido =>
                                    pedido.id === Number(busca)
                            );

                    } else {

                        // Busca parcial pelo nome do cliente

                        pedidos =
                            pedidos.filter(
                                pedido =>
                                    pedido.cliente
                                        .toLowerCase()
                                        .includes(busca)
                            );
                    }
                }

                // ==========================
                // ORDENAÇÃO
                // ==========================

                pedidos =
                    ordenarPedidos(pedidos);

                // ==========================
                // LIMPAR TABELA
                // ==========================

                tabela.innerHTML = "";

                // ==========================
                // MONTAR TABELA
                // ==========================

                pedidos.forEach(pedido => {

                    const data =
                        new Date(
                            pedido.data_pedido
                        ).toLocaleDateString("pt-BR");

                    tabela.innerHTML += `
                        <tr>

                            <td>
                                ${pedido.id}
                            </td>

                            <td>
                                ${pedido.cliente}
                            </td>

                            <td>
                                R$ ${Number(
                                    pedido.valor_total
                                )
                                    .toFixed(2)
                                    .replace(".", ",")}
                            </td>

                            <td>
                                R$ ${Number(
                                    pedido.frete
                                )
                                    .toFixed(2)
                                    .replace(".", ",")}
                            </td>

                            <td>
                                ${mostrarStatus(
                                    pedido.status
                                )}
                            </td>

                            <td>
                                <select
                                    onchange="alterarStatus(
                                        ${pedido.id},
                                        this.value
                                    )"
                                >
                                    <option
                                        value="Pendente"
                                        ${pedido.status === "Pendente"
                                            ? "selected"
                                            : ""}
                                    >
                                        Pendente
                                    </option>

                                    <option
                                        value="Pago"
                                        ${pedido.status === "Pago"
                                            ? "selected"
                                            : ""}
                                    >
                                        Pago
                                    </option>

                                    <option
                                        value="Enviado"
                                        ${pedido.status === "Enviado"
                                            ? "selected"
                                            : ""}
                                    >
                                        Enviado
                                    </option>

                                    <option
                                        value="Entregue"
                                        ${pedido.status === "Entregue"
                                            ? "selected"
                                            : ""}
                                    >
                                        Entregue
                                    </option>

                                    <option
                                        value="Cancelado"
                                        ${pedido.status === "Cancelado"
                                            ? "selected"
                                            : ""}
                                    >
                                        Cancelado
                                    </option>
                                </select>
                            </td>

                            <td>
                                ${data}
                            </td>

                            <td>
                                <button
                                    onclick="verPedido(${pedido.id})"
                                >
                                    Ver
                                </button>
                            </td>

                        </tr>
                    `;
                });

            })
            .catch(erro => {

                console.error(
                    "Erro ao carregar pedidos:",
                    erro
                );

            });
    }

    // ==========================
    // VER PEDIDO
    // ==========================

    window.verPedido = function (id) {

        window.location.href =
            `pedido-detalhes.html?id=${id}`;

    };

    // ==========================
    // ALTERAR STATUS
    // ==========================

    window.alterarStatus = function (id, status) {

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
                    status: status
                })
            }
        )
            .then(res => res.json())
            .then(resultado => {

                alert(
                    resultado.mensagem
                );

                carregarPedidos();

            })
            .catch(erro => {

                console.error(
                    "Erro ao atualizar status:",
                    erro
                );

            });
    };

    // ==========================
    // MOSTRAR STATUS
    // ==========================

    function mostrarStatus(status) {

        let classe = "";

        switch (status) {

            case "Pendente":

                classe =
                    "status-pendente";

                break;

            case "Pago":

                classe =
                    "status-pago";

                break;

            case "Enviado":

                classe =
                    "status-enviado";

                break;

            case "Entregue":

                classe =
                    "status-entregue";

                break;

            case "Cancelado":

                classe =
                    "status-cancelado";

                break;
        }

        return `
            <span class="status ${classe}">
                ${status}
            </span>
        `;
    }

    // ==========================
    // ORDENAR PEDIDOS
    // ==========================

    function ordenarPedidos(pedidos) {

        if (!colunaOrdenacao) {
            return pedidos;
        }

        return pedidos.sort((a, b) => {

            let valorA;
            let valorB;

            if (colunaOrdenacao === "data_pedido") {

                valorA =
                    new Date(
                        a[colunaOrdenacao]
                    );

                valorB =
                    new Date(
                        b[colunaOrdenacao]
                    );

            } else if (
                colunaOrdenacao === "valor_total" ||
                colunaOrdenacao === "frete" ||
                colunaOrdenacao === "id"
            ) {

                valorA =
                    Number(
                        a[colunaOrdenacao]
                    );

                valorB =
                    Number(
                        b[colunaOrdenacao]
                    );

            } else {

                valorA =
                    a[colunaOrdenacao]
                        .toString()
                        .toLowerCase();

                valorB =
                    b[colunaOrdenacao]
                        .toString()
                        .toLowerCase();
            }

            if (valorA < valorB) {
                return ordemCrescente ? -1 : 1;
            }

            if (valorA > valorB) {
                return ordemCrescente ? 1 : -1;
            }

            return 0;

        });
    }

    // ==========================
    // ORDENAÇÃO DOS CABEÇALHOS
    // ==========================

    document
        .querySelectorAll("th[data-coluna]")
        .forEach(th => {

            th.style.cursor =
                "pointer";

            th.innerHTML +=
                " ↕";

            th.addEventListener(
                "click",
                () => {

                    const coluna =
                        th.dataset.coluna;

                    if (colunaOrdenacao === coluna) {

                        ordemCrescente =
                            !ordemCrescente;

                    } else {

                        colunaOrdenacao =
                            coluna;

                        ordemCrescente =
                            true;
                    }

                    document
                        .querySelectorAll(
                            "th[data-coluna]"
                        )
                        .forEach(cabecalho => {

                            cabecalho.innerHTML =
                                cabecalho.dataset.coluna ===
                                colunaOrdenacao
                                    ? cabecalho.dataset.coluna +
                                      (
                                          ordemCrescente
                                              ? " ↑"
                                              : " ↓"
                                      )
                                    : cabecalho.dataset.coluna +
                                      " ↕";
                        });

                    carregarPedidos();

                }
            );
        });

});