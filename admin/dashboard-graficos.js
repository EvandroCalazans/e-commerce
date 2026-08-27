document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("tokenAdmin");
    const configAuth = {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    };

    // ==========================================
    // VARIÁVEIS GLOBAIS DOS GRÁFICOS
    // ==========================================

    let graficoStatus = null;
    let graficoProdutos = null;
    let dadosProdutos = [];

    // ==========================================
    // CARREGAR GRÁFICO DE STATUS DOS PEDIDOS
    // ==========================================

    function carregarGraficoStatus() {
        fetch("/api/pedidos", configAuth)
            .then(res => res.json())
            .then(pedidos => {
                let pendentes = 0;
                let pagos = 0;
                let enviados = 0;
                let finalizados = 0;
                let cancelados = 0;

                pedidos.forEach(pedido => {
                    switch (pedido.status) {
                        case "Pendente":
                            pendentes++;
                            break;
                        case "Pago":
                            pagos++;
                            break;
                        case "Enviado":
                            enviados++;
                            break;
                        case "Entregue":
                            finalizados++;
                            break;
                        case "Cancelado":
                            cancelados++;
                            break;
                    }
                });

                criarGraficoStatus([
                    pendentes,
                    pagos,
                    enviados,
                    finalizados,
                    cancelados
                ]);
            })
            .catch(erro => {
                console.error(
                    "Erro ao carregar gráfico de status:",
                    erro
                );
            });
    }

    // ==========================================
    // CRIAR GRÁFICO DE STATUS
    // ==========================================

    function criarGraficoStatus(valores) {
        const canvas = document.getElementById("graficoStatus");

        if (!canvas) {
            return;
        }

        if (graficoStatus) {
            graficoStatus.destroy();
        }

        const ctx = canvas.getContext("2d");

        graficoStatus = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: [
                    "Pendente",
                    "Pago",
                    "Enviado",
                    "Entregues",
                    "Cancelado"
                ],
                datasets: [{
                    data: valores,
                    backgroundColor: [
                        "#f1c40f",
                        "#2ecc71",
                        "#3498db",
                        "#16a085",
                        "#e74c3c"
                    ],
                    hoverOffset: 15
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                resizeDelay: 300,
                layout: {
                    padding: {
                        left: 30,
                        right: 30,
                        top: 10,
                        bottom: 120
                    }
                },
                interaction: {
                    mode: "nearest",
                    intersect: true
                },
                animation: {
                    animateRotate: true,
                    animateScale: true
                },
                plugins: {
                    legend: {
                        display: true,
                        position: "bottom",
                        labels: {
                            padding: 15,
                            font: {
                                size: 13
                            }
                        }
                    },
                    tooltip: {
                        enabled: true,
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.raw}`;
                            }
                        }
                    },
                    datalabels: {
                        color: "#fff",
                        font: {
                            weight: "bold",
                            size: 14
                        },
                        formatter: function(valor) {
                            return valor > 0 ? valor : "";
                        }
                    }
                }
            }
        });
    }

    // ==========================================
    // CARREGAR PRODUTOS MAIS VENDIDOS
    // ==========================================

    function carregarGraficoProdutos() {
        fetch(
            "/api/pedidos/produtos-vendidos",
            configAuth
        )
            .then(res => res.json())
            .then(produtos => {
                dadosProdutos = produtos;
                criarGraficoProdutos("bar");
            })
            .catch(erro => {
                console.error(
                    "Erro ao carregar gráfico de produtos:",
                    erro
                );
            });
    }

    // ==========================================
    // CRIAR GRÁFICO DE PRODUTOS
    // ==========================================

    function criarGraficoProdutos(tipo) {
        const canvas = document.getElementById("graficoProdutos");

        if (!canvas) {
            return;
        }

        if (graficoProdutos !== null) {
            graficoProdutos.destroy();
            graficoProdutos = null;
        }

        const container = document.getElementById(
            "containerGraficoProdutos"
        );

        const ctx = canvas.getContext("2d");

        let configuracao = {
            labels: dadosProdutos.map(
                produto => produto.produto
            ),
            datasets: [{
                label: "Quantidade vendida",
                data: dadosProdutos.map(
                    produto => Number(produto.total_vendido)
                ),
                borderWidth: 3,
                pointRadius: 6,
                pointHoverRadius: 8,
                tension: 0.3,
                backgroundColor: [
                    "#3498db",
                    "#2ecc71",
                    "#f1c40f",
                    "#9b59b6",
                    "#e67e22",
                    "#1abc9c",
                    "#e74c3c",
                    "#34495e",
                    "#16a085",
                    "#95a5a6"
                ]
            }]
        };

        const opcoes = {
            responsive: true,
            maintainAspectRatio: false,
            resizeDelay: 300,
            layout: {
                padding: {
                    left: 60,
                    right: 30,
                    top: 10,
                    bottom: 60
                }
            },
            plugins: {
                legend: {
                    display: tipo === "pie" || tipo === "doughnut",
                    position: "bottom",
                    labels: {
                        padding: 20,
                        font: {
                            size: 14
                        }
                    }
                },
                datalabels: {
                    color: "#333",
                    font: {
                        weight: "bold",
                        size: 14
                    },
                    anchor: "end",
                    align: "top"
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    },
                    title: {
                        display: true,
                        text: "Quantidade vendida"
                    }
                },
                y: {
                    ticks: {
                        autoSkip: false
                    }
                }
            }
        };

        if (tipo === "pie" || tipo === "doughnut") {
            opcoes.scales = {};
            opcoes.plugins.datalabels = {
                color: "#fff",
                font: {
                    weight: "bold",
                    size: 14
                },
                formatter: function(valor) {
                    return valor;
                }
            };
        }

        if (tipo === "line") {
            configuracao.datasets[0].borderColor = "#3498db";
            configuracao.datasets[0].borderWidth = 5;
            configuracao.datasets[0].pointRadius = 7;
            configuracao.datasets[0].pointHoverRadius = 10;
            configuracao.datasets[0].fill = false;
        }

        if (tipo === "bar") {
            opcoes.indexAxis = "y";
        }

        graficoProdutos = new Chart(ctx, {
            type: tipo,
            data: configuracao,
            options: opcoes
        });
    }

    // ==========================================
    // ALTERAR TIPO DE VISUALIZAÇÃO
    // ==========================================

    const seletor = document.getElementById(
        "tipoGraficoProdutos"
    );

    if (seletor) {
        seletor.addEventListener(
            "change",
            evento => {
                criarGraficoProdutos(
                    evento.target.value
                );
            }
        );
    }

    // ==========================================
    // INICIALIZAÇÃO DOS GRÁFICOS
    // ==========================================

    carregarGraficoStatus();
    carregarGraficoProdutos();
});