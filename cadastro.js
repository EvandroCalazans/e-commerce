console.log("CADASTRO.JS CARREGADO");

document
    .getElementById("cadastroForm")
    .addEventListener("submit", async (e) => {

        e.preventDefault();

        const nome =
            document.getElementById("nome").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const senha =
            document.getElementById("senha").value;

        const telefone =
            document.getElementById("telefone").value.trim();

        const cep =
            document.getElementById("cep").value.trim();

        const logradouro =
            document.getElementById("logradouro").value.trim();

        const numero =
            document.getElementById("numero").value.trim();

        const complemento =
            document.getElementById("complemento").value.trim();

        const bairro =
            document.getElementById("bairro").value.trim();

        const cidade =
            document.getElementById("cidade").value.trim();

        const estado =
            document.getElementById("estado").value.trim().toUpperCase();

        try {
            const resposta =
                await fetch(
                    "http://localhost:3000/api/clientes/cadastro",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            nome,
                            email,
                            senha,
                            telefone,
                            cep,
                            logradouro,
                            numero,
                            complemento,
                            bairro,
                            cidade,
                            estado
                        })
                    }
                );

            const dados =
                await resposta.json();

            console.log(
                "Resposta servidor:",
                dados
            );

            alert(
                dados.mensagem
            );

            if (resposta.ok) {
                document
                    .getElementById("cadastroForm")
                    .reset();
            }

        } catch (erro) {
            console.error(
                "ERRO NO CADASTRO:",
                erro
            );

            alert(
                "Erro ao conectar com o servidor"
            );
        }
    });

// ==========================
// NAVEGAÇÃO COM ENTER
// ==========================

const camposCadastro = [
    "nome",
    "email",
    "senha",
    "telefone",
    "cep",
    "logradouro",
    "numero",
    "complemento",
    "bairro",
    "cidade",
    "estado"
];

camposCadastro.forEach((id, indice) => {

    const campo = document.getElementById(id);

    if (!campo) return;

    campo.addEventListener("keydown", (e) => {

        if (e.key !== "Enter") return;

        e.preventDefault();

        const proximoIndice = indice + 1;

        if (proximoIndice < camposCadastro.length) {

            const proximoCampo =
                document.getElementById(
                    camposCadastro[proximoIndice]
                );

            if (proximoCampo) {
                proximoCampo.focus();
            }

        } else {

            document
                .getElementById("cadastroForm")
                .requestSubmit();
        }
    });
});