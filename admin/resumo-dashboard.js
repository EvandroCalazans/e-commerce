document.addEventListener("DOMContentLoaded", () => {

    const token =
        localStorage.getItem("tokenAdmin");

    const configAuth = {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    };

    // ==========================
    // MELHOR CLIENTE
    // ==========================

    fetch(
        "/api/clientes/admin",
        configAuth
    )

        .then(res => res.json())

        .then(clientes => {

            if (clientes.length > 0) {

                // Ordena do maior para o menor
                // valor total comprado

                clientes.sort(
                    (a, b) =>
                        Number(b.total_comprado || 0) -
                        Number(a.total_comprado || 0)
                );

                const melhorCliente =
                    clientes[0];

                document.getElementById(
                    "melhorCliente"
                ).textContent =
                    melhorCliente.nome +
                    " (R$ " +
                    Number(
                        melhorCliente.total_comprado || 0
                    )
                        .toFixed(2)
                        .replace(".", ",") +
                    ")";
            }
        })

        .catch(erro => {

            console.error(
                "Erro ao carregar melhor cliente:",
                erro
            );
        });

    // ==========================
    // ÚLTIMO PEDIDO
    // ==========================

    fetch(
        "/api/pedidos",
        configAuth
    )

        .then(res => res.json())

        .then(pedidos => {

            if (pedidos.length > 0) {

                const pedido = pedidos[0];

                document.getElementById(
                    "ultimoPedido"
                ).innerHTML =
                    "Pedido #" +
                    pedido.id +
                    "<br>Valor: R$ " +
                    Number(
                        pedido.valor_total
                    )
                        .toFixed(2)
                        .replace(".", ",") +
                    "<br>Status: " +
                    pedido.status +
                    "<br>Data: " +
                    new Date(
                        pedido.data_pedido
                    ).toLocaleDateString("pt-BR");
            }
        })

        .catch(erro => {

            console.error(
                "Erro ao carregar último pedido:",
                erro
            );
        });

});