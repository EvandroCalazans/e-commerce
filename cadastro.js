console.log("CADASTRO.JS CARREGADO");


document
.getElementById("cadastroForm")
.addEventListener(
"submit",
async (e) => {


    e.preventDefault();


    const nome =
    document.getElementById("nome").value;


    const email =
    document.getElementById("email").value;


    const senha =
    document.getElementById("senha").value;



    try {


        const resposta =
        await fetch(
            "http://localhost:3000/api/clientes/cadastro",
            {

                method: "POST",

                headers: {

                    "Content-Type":
                    "application/json"

                },

                body: JSON.stringify({

                    nome,

                    email,

                    senha

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