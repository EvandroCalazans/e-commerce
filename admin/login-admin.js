document
    .getElementById("formLogin")
    .addEventListener("submit", async (e) => {

        e.preventDefault();

        const email =
            document.getElementById("email").value;

        const senha =
            document.getElementById("senha").value;

        try {

            const resposta = await fetch(
                "/api/admin/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email,
                        senha: senha
                    })
                }
            );

            const dados = await resposta.json();

            if (resposta.ok) {

                // Guarda o token do administrador
                localStorage.setItem(
                    "tokenAdmin",
                    dados.token
                );

                window.location.href =
                    "dashboard.html";

            } else {

                document.getElementById("mensagem").innerHTML =
                    dados.mensagem;

            }

        } catch (erro) {

            console.error(erro);

            document.getElementById("mensagem").innerHTML =
                "Erro ao conectar com servidor";

        }

    });