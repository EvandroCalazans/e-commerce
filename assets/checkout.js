// ==========================
// CARREGAR DADOS DO CLIENTE
// ==========================

document.addEventListener("DOMContentLoaded", () => {

    const dadosEntrega =
        document.getElementById("dados-entrega");

    const clienteSalvo =
        localStorage.getItem("cliente");

    if (!dadosEntrega) {
        return;
    }

    if (!clienteSalvo) {

        dadosEntrega.innerHTML = `
            <p>
                Você precisa fazer login para visualizar
                seus dados de entrega.
            </p>
        `;

        return;
    }

    try {

        const cliente =
            JSON.parse(clienteSalvo);

        dadosEntrega.innerHTML = `
            <p>
                <strong>Nome:</strong>
                ${cliente.nome || "-"}
            </p>

            <p>
                <strong>Telefone:</strong>
                ${cliente.telefone || "-"}
            </p>

            <p>
                <strong>CEP:</strong>
                ${cliente.cep || "-"}
            </p>

            <p>
                <strong>Logradouro:</strong>
                ${cliente.logradouro || "-"}
            </p>

            <p>
                <strong>Número:</strong>
                ${cliente.numero || "-"}
            </p>

            <p>
                <strong>Complemento:</strong>
                ${cliente.complemento || "-"}
            </p>

            <p>
                <strong>Bairro:</strong>
                ${cliente.bairro || "-"}
            </p>

            <p>
                <strong>Cidade:</strong>
                ${cliente.cidade || "-"}
            </p>

            <p>
                <strong>Estado:</strong>
                ${cliente.estado || "-"}
            </p>
        `;

        const campoCEP =
            document.querySelector(
                'input[placeholder="CEP"]'
            );

        if (campoCEP && cliente.cep) {

            campoCEP.value =
                cliente.cep;
        }

    } catch (erro) {

        console.error(
            "Erro ao carregar dados do cliente:",
            erro
        );

        dadosEntrega.innerHTML = `
            <p>
                Erro ao carregar os dados do cliente.
            </p>
        `;
    }
});


// ==========================
// CALCULAR FRETE
// ==========================

function calcularFrete() {

    const campoCEP =
        document.querySelector(
            'input[placeholder="CEP"]'
        );

    const campoFrete =
        document.getElementById("frete");

    if (!campoCEP || !campoFrete) {
        return;
    }

    const cep =
        campoCEP.value.replace(/\D/g, "");

    if (cep.length !== 8) {

        campoFrete.textContent =
            "Digite um CEP válido.";

        const botaoFinalizar =
            document.getElementById(
                "btn-finalizar"
            );

        if (botaoFinalizar) {
            botaoFinalizar.disabled = true;
        }

        return;
    }

    const valorFrete = 15.90;

    campoFrete.textContent =
        "Frete: R$ " +
        valorFrete
            .toFixed(2)
            .replace(".", ",");


    // ==========================
    // CALCULAR SUBTOTAL
    // ==========================

    const carrinho =
        JSON.parse(
            localStorage.getItem("carrinho")
        ) || [];

    let subtotal = 0;

    carrinho.forEach(item => {

        subtotal +=
            Number(item.preco) *
            Number(item.quantidade);

    });

    const totalPedido =
        subtotal + valorFrete;


    // ==========================
    // MOSTRAR VALORES
    // ==========================

    const campoSubtotal =
        document.getElementById("subtotal");

    const campoTotal =
        document.getElementById(
            "total-pedido"
        );

    const botaoFinalizar =
        document.getElementById(
            "btn-finalizar"
        );


    if (campoSubtotal) {

        campoSubtotal.textContent =
            "Subtotal dos produtos: R$ " +
            subtotal
                .toFixed(2)
                .replace(".", ",");

    }


    if (campoTotal) {

        campoTotal.textContent =
            "Total do pedido: R$ " +
            totalPedido
                .toFixed(2)
                .replace(".", ",");

    }


    if (botaoFinalizar) {
        botaoFinalizar.disabled = false;
    }
}


// ==========================
// FINALIZAR COMPRA
// ==========================

function finalizarCompra() {

    const clienteSalvo =
        localStorage.getItem("cliente");

    if (!clienteSalvo) {

        alert(
            "Você precisa fazer login para finalizar a compra."
        );

        window.location.href =
            "login.html";

        return;
    }

    const cliente =
        JSON.parse(clienteSalvo);


    // ==========================
    // OBTER CARRINHO
    // ==========================

    const carrinho =
        JSON.parse(
            localStorage.getItem("carrinho")
        ) || [];


    if (carrinho.length === 0) {

        alert("Carrinho vazio");

        return;
    }


    // ==========================
    // CALCULAR TOTAL
    // ==========================

    let valorTotal = 0;


    const itens =
        carrinho.map(item => {

            valorTotal +=
                Number(item.preco) *
                Number(item.quantidade);

            return {

                produto_id:
                    item.produto_id,

                quantidade:
                    item.quantidade,

                preco:
                    item.preco
            };

        });


    // ==========================
    // ADICIONAR FRETE
    // ==========================

    const valorFrete =
        15.90;

    const totalComFrete =
        valorTotal + valorFrete;


    // ==========================
    // MONTAR PEDIDO
    // ==========================

    const pedido = {

        cliente_id:
            cliente.id,

        valor_total:
            totalComFrete,

        frete:
            valorFrete,

        itens:
            itens
    };


    console.log(
        "PEDIDO ENVIADO:",
        pedido
    );

    console.log(
        "VALOR FRETE:",
        pedido.frete
    );


    // ==========================
    // ENVIAR PEDIDO
    // ==========================

    fetch(
        "/api/pedidos",
        {
            method: "POST",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body:
                JSON.stringify(pedido)
        }
    )

        .then(res =>
            res.json()
        )

        .then(dados => {

            if (dados.mensagem) {

                alert(
                    dados.mensagem
                );
            }


            if (dados.pedido_id) {

                localStorage.removeItem(
                    "carrinho"
                );

                window.location.href =
                    "index.html";
            }

        })

        .catch(erro => {

            console.error(
                "Erro ao finalizar compra:",
                erro
            );

            alert(
                "Erro ao finalizar compra"
            );

        });
}