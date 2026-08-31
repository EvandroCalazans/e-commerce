document.addEventListener("DOMContentLoaded", () => {

    const containerCategorias = document.getElementById("categorias-home");
    const containerProdutos = document.getElementById("produtos-destaque");

    fetch("/api/produtos")
        .then(res => {
            if (!res.ok) {
                throw new Error("Erro HTTP: " + res.status);
            }

            return res.json();
        })
        .then(produtos => {

            // ==================================================
            // CATEGORIAS
            // ==================================================

            if (containerCategorias) {

                const categorias = [
                    ...new Set(
                        produtos
                            .map(produto => produto.categoria)
                            .filter(Boolean)
                    )
                ];

                if (categorias.length === 0) {
                    containerCategorias.innerHTML = `
                        <p>Nenhuma categoria disponível no momento.</p>
                    `;
                } else {
                    containerCategorias.innerHTML = "";

                    categorias.forEach(categoria => {

                        const botao = document.createElement("a");

                        botao.className = "categoria-home-btn";
                        botao.href =
                            "produtos.html?categoria=" +
                            encodeURIComponent(categoria);
                        botao.textContent = categoria;

                        containerCategorias.appendChild(botao);
                    });
                }
            }

            // ==================================================
            // PRODUTOS EM DESTAQUE
            // ==================================================

            if (containerProdutos) {

                if (produtos.length === 0) {
                    containerProdutos.innerHTML = `
                        <p class="mensagem-produtos">
                            Nenhum produto disponível no momento.
                        </p>
                    `;

                    return;
                }

                const produtosDestaque = produtos.slice(0, 4);

                containerProdutos.innerHTML = "";

                produtosDestaque.forEach(produto => {

                    const card = document.createElement("div");

                    card.className = "produto produto-home";

                    card.innerHTML = `
                        <img
                            src="${produto.imagem || "img/produto1.jpg"}"
                            alt="${produto.nome}"
                        >

                        <h3>${produto.nome}</h3>

                        <span class="categoria">
                            ${produto.categoria || "Sem categoria"}
                        </span>

                        <p class="descricao-produto">
                            ${produto.descricao || "Produto de qualidade."}
                        </p>

                        <p>
                            R$ ${Number(produto.preco)
                                .toFixed(2)
                                .replace(".", ",")}
                        </p>

                        <button
                            class="btn"
                            onclick="adicionarCarrinho(
                                ${produto.id},
                                '${produto.nome}',
                                ${produto.preco}
                            )"
                        >
                            Comprar
                        </button>
                    `;

                    containerProdutos.appendChild(card);
                });
            }
        })
        .catch(erro => {

            console.error("Erro ao carregar produtos:", erro);

            if (containerCategorias) {
                containerCategorias.innerHTML = `
                    <p>
                        Não foi possível carregar as categorias.
                    </p>
                `;
            }

            if (containerProdutos) {
                containerProdutos.innerHTML = `
                    <p class="mensagem-produtos">
                        Não foi possível carregar os produtos.
                    </p>
                `;
            }
        });
});
