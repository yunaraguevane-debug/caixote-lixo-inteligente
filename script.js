
// VALORES DOS SENSORES
let nivelEnchimento = 0;
let qualidadeAr = 100;

// HISTORICO DO GRAFICO
let historico = [];

// ELEMENTOS DA PAGINA
const nivelElemento = document.getElementById("nivel");
const gasElemento = document.getElementById("gas");
const estadoElemento = document.getElementById("estado");
const ligacaoElemento = document.getElementById("ligacao");

// ATUALIZAR OS VALORES E O ESTADO
function atualizarPagina() {

    nivelElemento.textContent = nivelEnchimento + "%";
    gasElemento.textContent = qualidadeAr;

    // Atualizar a barra de enchimento
let barra = document.getElementById("barraNivel");

barra.style.width = nivelEnchimento + "%";

// Alterar a cor conforme o enchimento
if (nivelEnchimento >= 90) {
    barra.style.backgroundColor = "#d92d20";
}
else if (nivelEnchimento >= 70) {
    barra.style.backgroundColor = "#e5a000";
}
else {
    barra.style.backgroundColor = "#176b45";
}

    if (nivelEnchimento >= 90 || qualidadeAr > 300) {
        estadoElemento.textContent = "ALERTA";
        estadoElemento.style.color = "#b42318";
        estadoElemento.style.backgroundColor = "#fee4e2";
    }
    else if (nivelEnchimento >= 70) {
        estadoElemento.textContent = "ATENCAO";
        estadoElemento.style.color = "#b54708";
        estadoElemento.style.backgroundColor = "#fef0c7";
    }
    else {
        estadoElemento.textContent = "NORMAL";
        estadoElemento.style.color = "#067647";
        estadoElemento.style.backgroundColor = "#dcfae6";
    }
}

// DESENHAR O GRAFICO
function desenharGrafico() {

    let canvas = document.getElementById("grafico");
    let ctx = canvas.getContext("2d");

    let largura = canvas.width;
    let altura = canvas.height;

    ctx.clearRect(0, 0, largura, altura);

    let margemEsquerda = 45;
    let margemDireita = 20;
    let margemSuperior = 20;
    let margemInferior = 40;

    let larguraGrafico = largura - margemEsquerda - margemDireita;
    let alturaGrafico = altura - margemSuperior - margemInferior;

    // GRELHA E ESCALA
    ctx.font = "12px Arial";
    ctx.fillStyle = "#718078";
    ctx.strokeStyle = "#e5ece7";
    ctx.lineWidth = 1;

    for (let valor = 0; valor <= 100; valor += 20) {

        let y = margemSuperior + alturaGrafico -
                (valor / 100) * alturaGrafico;

        ctx.beginPath();
        ctx.moveTo(margemEsquerda, y);
        ctx.lineTo(largura - margemDireita, y);
        ctx.stroke();

        ctx.fillText(valor + "%", 5, y + 4);
    }

    if (historico.length === 0) {
        return;
    }

    // COORDENADAS DOS PONTOS
    let pontos = [];

    for (let i = 0; i < historico.length; i++) {

        let x = margemEsquerda;

        if (historico.length > 1) {
            x += (i / (historico.length - 1)) * larguraGrafico;
        }

        let y = margemSuperior + alturaGrafico -
                (historico[i] / 100) * alturaGrafico;

        pontos.push({x: x, y: y});
    }

    // AREA SOB A LINHA
    ctx.beginPath();
    ctx.moveTo(pontos[0].x, margemSuperior + alturaGrafico);

    for (let i = 0; i < pontos.length; i++) {
        ctx.lineTo(pontos[i].x, pontos[i].y);
    }

    ctx.lineTo(
        pontos[pontos.length - 1].x,
        margemSuperior + alturaGrafico
    );

    ctx.closePath();
    ctx.fillStyle = "rgba(23, 107, 69, 0.10)";
    ctx.fill();

    // LINHA DO GRAFICO
    ctx.beginPath();
    ctx.strokeStyle = "#176b45";
    ctx.lineWidth = 3;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    for (let i = 0; i < pontos.length; i++) {

        if (i === 0) {
            ctx.moveTo(pontos[i].x, pontos[i].y);
        }
        else {
            ctx.lineTo(pontos[i].x, pontos[i].y);
        }
    }

    ctx.stroke();

    // PONTOS DE MEDICAO
    for (let i = 0; i < pontos.length; i++) {

        ctx.beginPath();
        ctx.arc(pontos[i].x, pontos[i].y, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#176b45";
        ctx.fill();
    }
}

// SIMULAR OS SENSORES
function simularSensores() {

    nivelEnchimento = Math.floor(Math.random() * 101);
    qualidadeAr = Math.floor(Math.random() * 500);

    historico.push(nivelEnchimento);

    if (historico.length > 20) {
        historico.shift();
    }

    atualizarPagina();
    desenharGrafico();
}

// INDICAR QUE OS DADOS SAO SIMULADOS
ligacaoElemento.textContent = "Modo de demonstracao - dados simulados";

// INICIAR O SISTEMA
simularSensores();

setInterval(simularSensores, 3000);
