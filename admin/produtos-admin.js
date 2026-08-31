document.addEventListener("DOMContentLoaded", () => {

    const formulario =
        document.getElementById("formProduto");

    const tabela =
        document.querySelector(
            "#tabelaProdutos tbody"
        );

    const colunasOrdenaveis =
        document.querySelectorAll(
            ".coluna-ordenavel"
        );

    let idEditando = null;

    let produtosCarregados = [];

    let colunaAtual = "id";

    let ordemAtual = "asc";

    // ==========================
    // SALVAR OU ATUALIZAR
    // ==========================

    formulario.addEventListener("submit", (e) => {

        e.preventDefault();

        const produto = {
            nome:
                document.getElementById("nome").value,

            categoria:
                document.getElementById("categoria").value,

            preco:
                document.getElementById("preco").value,

            estoque:
                document.getElementById("estoque").value,

            imagem:
                document.getElementById("imagem").value,

            descricao:
                document.getElementById("descricao").value
        };

        let url = "/api/produtos";
        let metodo = "POST";

        if (idEditando !== null) {

            url =
                `/api/produtos/${idEditando}`;

            metodo = "PUT";
        }

        fetch(url, {
            method: metodo,

            headers: {
                "Content-Type": "application/json",

                "Authorization":
                    `Bearer ${localStorage.getItem(
                        "tokenAdmin"
                    )}`
            },

            body:
                JSON.stringify(produto)
        })

            .then(res => res.json())

            .then(resultado => {

                alert(
                    resultado.mensagem
                );

                formulario.reset();

                idEditando = null;

                document.querySelector(
                    "button[type='submit']"
                ).textContent =
                    "Salvar Produto";

                carregarProdutos();
            })

            .catch(erro => {

                console.error(
                    "Erro:",
                    erro
                );
            });
    });

    // ==========================
    // LISTAR PRODUTOS
    // ==========================

    function carregarProdutos() {

        fetch("/api/produtos")

            .then(res => res.json())

            .then(produtos => {

                produtosCarregados =
                    produtos;

                ordenarProdutos();
            })

            .catch(erro => {

                console.error(
                    "Erro ao carregar produtos:",
                    erro
                );
            });
    }

    // ==========================
    // ORDENAR PRODUTOS
    // ==========================

    function ordenarProdutos() {

        const produtosOrdenados =
            [...produtosCarregados];

        produtosOrdenados.sort(
            (a, b) => {

                let valorA =
                    a[colunaAtual];

                let valorB =
                    b[colunaAtual];

                if (
                    colunaAtual === "id"
                ) {

                    valorA =
                        Number(valorA);

                    valorB =
                        Number(valorB);

                    return ordemAtual === "asc"
                        ? valorA - valorB
                        : valorB - valorA;
                }

                valorA =
                    String(
                        valorA || ""
                    );

                valorB =
                    String(
                        valorB || ""
                    );

                const resultado =
                    valorA.localeCompare(
                        valorB,
                        "pt-BR",
                        {
                            sensitivity:
                                "base"
                        }
                    );

                return ordemAtual === "asc"
                    ? resultado
                    : -resultado;
            }
        );

        mostrarProdutos(
            produtosOrdenados
        );
    }

    // ==========================
    // MOSTRAR PRODUTOS
    // ==========================

    function mostrarProdutos(produtos) {

        tabela.innerHTML = "";

        produtos.forEach(p => {

            tabela.innerHTML += `
                <tr>
                    <td>${p.id}</td>

                    <td>${p.nome}</td>

                    <td>
                        ${p.categoria || "-"}
                    </td>

                    <td>
                        R$ ${Number(p.preco)
                            .toFixed(2)
                            .replace(".", ",")}
                    </td>

                    <td>
                        ${p.estoque}
                    </td>

                    <td>
                        <button
                            onclick="editarProduto(${p.id})"
                        >
                            Editar
                        </button>

                        <button
                            onclick="excluirProduto(${p.id})"
                        >
                            Excluir
                        </button>
                    </td>
                </tr>
            `;
        });
    }

    // ==========================
    // CLIQUE PARA ORDENAR
    // ==========================

    colunasOrdenaveis.forEach(coluna => {

        coluna.addEventListener(
            "click",
            () => {

                const novaColuna =
                    coluna.dataset.ordenar;

                if (
                    colunaAtual ===
                    novaColuna
                ) {

                    ordemAtual =
                        ordemAtual === "asc"
                            ? "desc"
                            : "asc";

                } else {

                    colunaAtual =
                        novaColuna;

                    ordemAtual =
                        "asc";
                }

                ordenarProdutos();
            }
        );
    });

    // ==========================
    // EDITAR
    // ==========================

    window.editarProduto = function(id) {

        fetch("/api/produtos")

            .then(res => res.json())

            .then(produtos => {

                const produto =
                    produtos.find(
                        p => p.id == id
                    );

                if (!produto) {
                    return;
                }

                document.getElementById(
                    "nome"
                ).value =
                    produto.nome;

                document.getElementById(
                    "categoria"
                ).value =
                    produto.categoria || "";

                document.getElementById(
                    "preco"
                ).value =
                    produto.preco;

                document.getElementById(
                    "estoque"
                ).value =
                    produto.estoque;

                document.getElementById(
                    "imagem"
                ).value =
                    produto.imagem || "";

                document.getElementById(
                    "descricao"
                ).value =
                    produto.descricao || "";

                idEditando = id;

                document.querySelector(
                    "button[type='submit']"
                ).textContent =
                    "Atualizar Produto";

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            });
    };

    // ==========================
    // EXCLUIR
    // ==========================

    window.excluirProduto = function(id) {

        if (!confirm(
            "Deseja excluir este produto?"
        )) {
            return;
        }

        fetch(`/api/produtos/${id}`, {
            method: "DELETE",

            headers: {
                "Authorization":
                    `Bearer ${localStorage.getItem(
                        "tokenAdmin"
                    )}`
            }
        })

            .then(res => res.json())

            .then(resultado => {

                alert(
                    resultado.mensagem
                );

                carregarProdutos();
            });
    };

    // ==========================
    // INICIAR
    // ==========================

    carregarProdutos();

});