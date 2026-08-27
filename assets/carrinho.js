let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

// ==========================
// SALVAR CARRINHO
// ==========================

function salvarCarrinho() {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    atualizarContadorCarrinho();
}

function atualizarContadorCarrinho() {
    const contador = document.getElementById("contador-carrinho");

    if (!contador) return;

    const quantidade = carrinho.reduce((total, item) => {
        return total + item.quantidade;
    }, 0);

    contador.textContent = quantidade;
}

// ==========================
// ADICIONAR PRODUTO
// ==========================

function adicionarCarrinho(produto_id, nome, preco) {
    const produtoExistente = carrinho.find(
        item => item.produto_id === produto_id
    );

    if (produtoExistente) {
        produtoExistente.quantidade++;
    } else {
        carrinho.push({
            produto_id: produto_id,
            nome: nome,
            preco: Number(preco),
            quantidade: 1
        });
    }

    salvarCarrinho();
    alert("Produto adicionado ao carrinho!");
}

// ==========================
// REMOVER ITEM
// ==========================

function removerItem(index) {
    carrinho.splice(index, 1);
    salvarCarrinho();
    carregarCarrinho();
}

// ==========================
// AUMENTAR QUANTIDADE
// ==========================

function aumentarQuantidade(index) {
    carrinho[index].quantidade++;
    salvarCarrinho();
    carregarCarrinho();
}

// ==========================
// DIMINUIR QUANTIDADE
// ==========================

function diminuirQuantidade(index) {
    if (carrinho[index].quantidade > 1) {
        carrinho[index].quantidade--;
    } else {
        carrinho.splice(index, 1);
    }

    salvarCarrinho();
    carregarCarrinho();
}

// ==========================
// CARREGAR CARRINHO
// ==========================

function carregarCarrinho() {
    const lista = document.getElementById("lista-carrinho");

    if (!lista) return;

    lista.innerHTML = "";

    let total = 0;

    carrinho.forEach((item, index) => {
        total += Number(item.preco) * Number(item.quantidade);

        lista.innerHTML += `
            <div class="item-carrinho">
                <h3>${item.nome}</h3>

                <div class="controle-quantidade">
                    <button onclick="diminuirQuantidade(${index})">-</button>
                    <span>${item.quantidade}</span>
                    <button onclick="aumentarQuantidade(${index})">+</button>
                </div>

                <p>
                    R$ ${Number(item.preco)
                        .toFixed(2)
                        .replace(".", ",")}
                </p>

                <p>
                    Subtotal:
                    R$ ${(item.preco * item.quantidade)
                        .toFixed(2)
                        .replace(".", ",")}
                </p>

                <button
                    onclick="removerItem(${index})"
                    class="btn"
                >
                    Remover
                </button>
            </div>

            <hr>
        `;
    });

    lista.innerHTML += `
        <h3>
            Total:
            R$ ${total.toFixed(2).replace(".", ",")}
        </h3>
    `;

    atualizarContadorCarrinho();
}

// ==========================
// INICIAR CARRINHO
// ==========================

document.addEventListener("DOMContentLoaded", () => {
    carregarCarrinho();
    atualizarContadorCarrinho();
});