document.addEventListener("DOMContentLoaded", () => {
    const parametros = new URLSearchParams(window.location.search);
    const idCliente = parametros.get("id");
    const tabela = document.getElementById("listaHistorico");
    const nomeCliente = document.getElementById("nomeCliente");
    const informacoesCliente = document.getElementById("informacoesCliente");
    const totalComprado = document.getElementById("totalComprado");

    if (!idCliente || !tabela) {
        return;
    }

    const token = localStorage.getItem("tokenAdmin");

    const headers = {
        "Authorization": "Bearer " + token
    };

    carregarDadosCliente();
    carregarHistorico();

    function carregarDadosCliente() {
        fetch("/api/clientes/admin", {
            headers: headers
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Erro ao buscar dados do cliente");
                }

                return res.json();
            })
            .then(clientes => {
                const cliente = clientes.find(
                    cliente =>
                        Number(cliente.id) === Number(idCliente)
                );

                if (!cliente) {
                    nomeCliente.textContent = "Cliente não encontrado";

                    informacoesCliente.innerHTML =
                        "<p>Não foi possível encontrar os dados deste cliente.</p>";

                    return;
                }

                nomeCliente.textContent = cliente.nome;

                informacoesCliente.innerHTML = `
                    <p>
                        <strong>E-mail:</strong>
                        ${cliente.email}
                    </p>

                    <p>
                        <strong>Pedidos:</strong>
                        ${cliente.quantidade_pedidos}
                    </p>
                `;
            })
            .catch(erro => {
                console.error(
                    "Erro ao carregar dados do cliente:",
                    erro
                );

                nomeCliente.textContent =
                    "Erro ao carregar cliente";

                informacoesCliente.innerHTML =
                    "<p>Não foi possível carregar as informações do cliente.</p>";
            });
    }

    function carregarHistorico() {
        fetch(`/api/clientes/admin/${idCliente}/historico`, {
            headers: headers
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Erro ao buscar histórico");
                }

                return res.json();
            })
            .then(pedidos => {
                tabela.innerHTML = "";

                let total = 0;

                if (!Array.isArray(pedidos) || pedidos.length === 0) {
                    tabela.innerHTML = `
                        <tr>
                            <td colspan="5">
                                Nenhum pedido encontrado.
                            </td>
                        </tr>
                    `;

                    totalComprado.innerHTML =
                        "Total comprado: R$ 0,00";

                    return;
                }

                pedidos.forEach(pedido => {
                    total += Number(pedido.valor_total);

                    const data = new Date(
                        pedido.data_pedido
                    ).toLocaleDateString("pt-BR");

                    tabela.innerHTML += `
                        <tr>
                            <td>${pedido.id}</td>
                            <td>${data}</td>
                            <td>
                                R$ ${Number(pedido.valor_total)
                                    .toFixed(2)
                                    .replace(".", ",")}
                            </td>
                            <td>${pedido.status}</td>
                            <td>
                                <button
                                    onclick="verPedido(${pedido.id})"
                                >
                                    Ver Pedido
                                </button>
                            </td>
                        </tr>
                    `;
                });

                totalComprado.innerHTML =
                    `Total comprado: R$ ${total
                        .toFixed(2)
                        .replace(".", ",")}`;
            })
            .catch(erro => {
                console.error(
                    "Erro ao carregar histórico:",
                    erro
                );

                tabela.innerHTML = `
                    <tr>
                        <td colspan="5">
                            Erro ao carregar histórico.
                        </td>
                    </tr>
                `;

                totalComprado.innerHTML =
                    "Total comprado: R$ 0,00";
            });
    }
});

function verPedido(id) {
    window.location.href = `pedido-detalhes.html?id=${id}`;
}

function voltarClientes() {
    window.location.href = "clientes.html";
}