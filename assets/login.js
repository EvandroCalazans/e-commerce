document.getElementById("loginForm").addEventListener("submit", async e => {
    e.preventDefault();

    const email = document.querySelector("input[type=email]").value;
    const senha = document.querySelector("input[type=password]").value;

    const res = await fetch(
        "http://localhost:3000/api/clientes/login",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                senha
            })
        }
    );

    const data = await res.json();

    if (data.cliente) {
        localStorage.setItem(
            "cliente",
            JSON.stringify(data.cliente)
        );

        alert("Login realizado!");
        window.location = "index.html";
    } else {
        alert(data.mensagem || "Erro no login");
    }
});