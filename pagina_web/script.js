
// Valores iniciais dos sensores
let nivelEnchimento = 0;
let qualidadeAr = 100;

// Historico para o grafico
let historico = [];

// Atualizar os valores apresentados na pagina
function atualizarPagina() {

    document.getElementById("nivel").textContent =
        nivelEnchimento + "%";

    document.getElementById("gas").textContent =
        qualidadeAr;

    // Verificar o estado do caixote
    let estado = document.getElementById("estado");

    if (nivelEnchimento >= 90 || qualidadeAr > 300) {
        estado.textContent = "ALERTA";
        estado.style.color = "red";
    }
    else if (nivelEnchimento >= 70) {
        estado.textContent = "ATENCAO";
        estado.style.color = "orange";
    }
    else {
        estado.textContent = "NORMAL";
        estado.style.color = "green";
    }
}

// Desenhar o grafico
function desenharGrafico() {

    let canvas = document.getElementById("grafico");
    let ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Eixos do grafico
    ctx.beginPath();
    ctx.moveTo(40, 20);
    ctx.lineTo(40, 260);
    ctx.lineTo(680, 260);
    ctx.strokeStyle = "#555";
    ctx.stroke();

    // Valores do nivel de enchimento
    ctx.beginPath();
    ctx.strokeStyle = "#176b45";
    ctx.lineWidth = 3;

    for (let i = 0; i < historico.length; i++) {

        let x = 40 + i * 40;
        let y = 260 - historico[i] * 2.2;

        if (i === 0) {
            ctx.moveTo(x, y);
        }
        else {
            ctx.lineTo(x, y);
        }
    }

    ctx.stroke();
}

// Simular os dados dos sensores
function simularSensores() {

    nivelEnchimento = Math.floor(Math.random() * 101);
    qualidadeAr = Math.floor(Math.random() * 500);

    historico.push(nivelEnchimento);

    if (historico.length > 16) {
        historico.shift();
    }

    atualizarPagina();
    desenharGrafico();
}

// Atualizar a cada 3 segundos
document.getElementById("ligacao").textContent =
    "Modo de demonstracao - dados simulados";

simularSensores();

setInterval(simularSensores, 3000);
