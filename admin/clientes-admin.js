document.addEventListener("DOMContentLoaded", () => {
    const tabela = document.getElementById("listaClientes");
    const buscarCliente = document.getElementById("buscarCliente");

    let colunaOrdenacao = null;
    let ordemCrescente = true;

    if (!tabela) return;

    carregarClientes();

    buscarCliente.addEventListener("input", carregarClientes);

    function carregarClientes() {
        window.verCliente = function (id) {
            window.location.href =
                `cliente-detalhes.html?id=${id}`;
        };

        fetch("/api/clientes/admin", {
            headers: {
                "Authorization":
                    "Bearer " + localStorage.getItem("tokenAdmin")
            }
        })
            .then(res => res.json())
            .then(clientes => {
                const busca = buscarCliente.value
                    .toLowerCase()
                    .trim();

                if (busca !== "") {
                    clientes = clientes.filter(cliente =>
                        cliente.nome
                            .toLowerCase()
                            .includes(busca) ||
                        cliente.email
                            .toLowerCase()
                            .includes(busca)
                    );
                }

                clientes = ordenarClientes(clientes);
                tabela.innerHTML = "";

                clientes.forEach(cliente => {
                    tabela.innerHTML += `
                        <tr>
                            <td>${cliente.id}</td>
                            <td>${cliente.nome}</td>
                            <td>${cliente.email}</td>
                            <td>${cliente.quantidade_pedidos}</td>
                            <td>
                                R$ ${Number(cliente.total_comprado)
                                    .toFixed(2)
                                    .replace(".", ",")}
                            </td>
                            <td>
                                <button
                                    onclick="verCliente(${cliente.id})"
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
                    "Erro ao carregar clientes:",
                    erro
                );
            });
    }

    function ordenarClientes(clientes) {
        if (!colunaOrdenacao) {
            return clientes;
        }

        return clientes.sort((a, b) => {
            let valorA;
            let valorB;

            if (
                colunaOrdenacao === "id" ||
                colunaOrdenacao === "pedidos" ||
                colunaOrdenacao === "total_comprado"
            ) {
                if (colunaOrdenacao === "pedidos") {
                    valorA = Number(a.quantidade_pedidos);
                    valorB = Number(b.quantidade_pedidos);
                } else {
                    valorA = Number(a[colunaOrdenacao]);
                    valorB = Number(b[colunaOrdenacao]);
                }
            } else {
                valorA = a[colunaOrdenacao]
                    .toString()
                    .toLowerCase();

                valorB = b[colunaOrdenacao]
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

    document
        .querySelectorAll("th[data-coluna]")
        .forEach(th => {
            th.style.cursor = "pointer";
            th.innerHTML += " ↕";

            th.addEventListener("click", () => {
                const coluna = th.dataset.coluna;

                if (colunaOrdenacao === coluna) {
                    ordemCrescente = !ordemCrescente;
                } else {
                    colunaOrdenacao = coluna;
                    ordemCrescente = true;
                }

                document
                    .querySelectorAll("th[data-coluna]")
                    .forEach(cabecalho => {
                        cabecalho.innerHTML =
                            cabecalho.textContent
                                .replace(" ↑", "")
                                .replace(" ↓", "")
                                .replace(" ↕", "") +
                            " ↕";
                    });

                th.innerHTML =
                    th.textContent
                        .replace(" ↕", "")
                        .replace(" ↑", "")
                        .replace(" ↓", "") +
                    (ordemCrescente ? " ↑" : " ↓");

                carregarClientes();
            });
        });
});