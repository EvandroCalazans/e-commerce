document.addEventListener("DOMContentLoaded", () => {
    const clienteLogado = document.getElementById("cliente-logado");
    const linkLogin = document.getElementById("link-login");
    const linkCadastro = document.getElementById("link-cadastro");
    const linkSair = document.getElementById("link-sair");
    const clienteSalvo = localStorage.getItem("cliente");

    // ==========================
    // CLIENTE NÃO LOGADO
    // ==========================

    if (!clienteSalvo) {
        if (clienteLogado) {
            clienteLogado.style.display = "none";
        }

        if (linkSair) {
            linkSair.style.display = "none";
        }

        return;
    }

    // ==========================
    // CLIENTE LOGADO
    // ==========================

    try {
        const cliente = JSON.parse(clienteSalvo);

        if (cliente && cliente.nome) {
            if (clienteLogado) {
                const primeiroNome =
                    cliente.nome.trim().split(" ")[0];

                clienteLogado.textContent =
                    "Olá, " + primeiroNome + "!";

                clienteLogado.style.display = "block";
            }

            // Esconde Entrar e Cadastrar

            if (linkLogin) {
                linkLogin.style.display = "none";
            }

            if (linkCadastro) {
                linkCadastro.style.display = "none";
            }

            // Mostra Sair

            if (linkSair) {
                linkSair.style.display = "inline-block";
            }
        }
    } catch (erro) {
        console.error("Erro ao carregar cliente:", erro);
    }

    // ==========================
    // SAIR
    // ==========================

    if (linkSair) {
        linkSair.addEventListener("click", e => {
            e.preventDefault();

            localStorage.removeItem("cliente");
            window.location.href = "index.html";
        });
    }
});