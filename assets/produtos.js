let todosProdutos = [];
let categoriaSelecionada = "todos";

const parametros =
    new URLSearchParams(window.location.search);

const categoriaInicial =
    parametros.get("categoria");

if (categoriaInicial) {
    categoriaSelecionada = categoriaInicial;
}

function exibirProdutos(produtos) {
    const container = document.getElementById("lista-produtos");

    if (!container) return;

    let html = "";

    produtos.forEach(p => {
        html += `
            <div class="produto">
                <img
                    src="${p.imagem || "img/produto1.jpg"}"
                    alt="${p.nome}">

                <h3>${p.nome}</h3>

                <span class="categoria">
                    ${p.categoria || "Sem categoria"}
                </span>

                <div class="descricao-produto">
                    ${p.descricao || "Sem descrição disponível."}
                </div>

                <div>
                    R$ ${Number(p.preco)
                        .toFixed(2)
                        .replace(".", ",")}
                </div>

                <button
                    class="btn"
                    onclick="adicionarCarrinho(${p.id}, '${p.nome}', ${p.preco})"
                >
                    Comprar
                </button>
            </div>
        `;
    });

    container.innerHTML = html;
}

function atualizarLista() {
    const campoBusca = document.querySelector(".busca");
    const ordenacao = document.getElementById("ordenacao");

    let produtos = [...todosProdutos];

    // ==========================
    // BUSCA
    // ==========================

    if (campoBusca) {
        const texto = campoBusca.value.toLowerCase().trim();

        produtos = produtos.filter(produto =>
            produto.nome.toLowerCase().includes(texto)
        );
    }

    // ==========================
    // FILTRO POR CATEGORIA
    // ==========================

    if (categoriaSelecionada !== "todos") {
        produtos = produtos.filter(
            produto => produto.categoria === categoriaSelecionada
        );
    }

    // ==========================
    // ORDENAÇÃO
    // ==========================

    if (ordenacao) {
        switch (ordenacao.value) {
            case "menor":
                produtos.sort((a, b) => a.preco - b.preco);
                break;

            case "maior":
                produtos.sort((a, b) => b.preco - a.preco);
                break;

            default:
                produtos.sort((a, b) =>
                    a.nome.localeCompare(b.nome, "pt-BR")
                );
        }
    }

    exibirProdutos(produtos);
}

document.addEventListener("DOMContentLoaded", () => {
    fetch("/api/produtos")
        .then(res => res.json())
        .then(produtos => {
            todosProdutos = produtos;

            // ==========================
            // CATEGORIAS
            // ==========================

            const containerCategorias =
                document.getElementById("categorias");

            if (containerCategorias) {
                const categorias = [
                    ...new Set(
                        produtos
                            .map(p => p.categoria)
                            .filter(Boolean)
                    )
                ];

                categorias.forEach(categoria => {
                    const botao =
                        document.createElement("button");

                    botao.className = "categoria-btn";
                    botao.dataset.categoria = categoria;
                    botao.textContent = categoria;

                    if (categoria === categoriaSelecionada) {
                        botao.classList.add("ativo");
                    }

                    if (categoriaInicial) {
                        const botaoTodos =
                            containerCategorias.querySelector(
                                '[data-categoria="todos"]'
                            );
                    
                        if (botaoTodos) {
                            botaoTodos.classList.remove("ativo");
                        }
                    }

                    containerCategorias.appendChild(botao);
                });

                document
                    .querySelectorAll(".categoria-btn")
                    .forEach(botao => {
                        botao.addEventListener("click", () => {

                            document
                                .querySelectorAll(".categoria-btn")
                                .forEach(b =>
                                    b.classList.remove("ativo")
                                );

                            botao.classList.add("ativo");

                            categoriaSelecionada =
                                botao.dataset.categoria;

                            atualizarLista();
                        });
                    });
            }

            // ==========================
            // BUSCA
            // ==========================

            const campoBusca =
                document.querySelector(".busca");

            if (campoBusca) {
                campoBusca.addEventListener(
                    "input",
                    atualizarLista
                );
            }

            // ==========================
            // ORDENAÇÃO
            // ==========================

            const ordenacao =
                document.getElementById("ordenacao");

            if (ordenacao) {
                ordenacao.addEventListener(
                    "change",
                    atualizarLista
                );
            }

            // ==========================
            // EXIBIR PRODUTOS
            // ==========================

            atualizarLista();
        })
        .catch(err => {
            console.error(
                "Erro ao carregar produtos:",
                err
            );

            const container =
                document.getElementById("lista-produtos");

            if (container) {
                container.innerHTML = `
                    <p style="text-align:center;padding:30px;">
                        Não foi possível carregar os produtos.
                    </p>
                `;
            }
        });
});