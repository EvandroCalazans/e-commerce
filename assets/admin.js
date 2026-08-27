if (!localStorage.getItem('token')) {
    window.location.href = 'login.html';
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}

const token = localStorage.getItem('token');

// carregar produtos
function carregarProdutos() {
    fetch('http://localhost:3000/api/produtos')
        .then(res => res.json())
        .then(data => {

            const container = document.getElementById('lista-produtos');
            container.innerHTML = '';

            data.forEach(p => {
                container.innerHTML += `
                    <div>
                        <h3>${p.nome}</h3>
                        <p>R$ ${p.preco}</p>

                        <button onclick="deletar(${p.id})">
                            Excluir
                        </button>
                    </div>
                `;
            });

        });
}

// criar produto
document.getElementById('formProduto').addEventListener('submit', (e) => {
    e.preventDefault();

    fetch('http://localhost:3000/api/produtos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
            nome: nome.value,
            preco: preco.value,
            descricao: descricao.value,
            imagem: imagem.value
        })
    }).then(() => {
        carregarProdutos();
    });
});

// deletar produto
function deletar(id) {
    fetch(`http://localhost:3000/api/produtos/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }).then(() => {
        carregarProdutos();
    });
}

carregarProdutos();