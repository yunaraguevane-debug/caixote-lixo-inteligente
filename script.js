
/* CLI - Caixote do Lixo Inteligente
   Modo de demonstração: valores simulados.
   A integração com o ESP32 será adicionada posteriormente. */

const LIMITE_ENCHIMENTO_AVISO = 70;
const LIMITE_ENCHIMENTO_ALERTA = 90;

// Limites provisórios de demonstração para o MQ-2.
// Não representam ppm nem limites de segurança.
const LIMITE_GAS_AVISO = 1500;
const LIMITE_GAS_ALERTA = 2500;

let nivelEnchimento = 24;
let valorADC = 650;
let historico = [];
let contador = 0;

const elementoNivel = document.getElementById("nivel");
const elementoGas = document.getElementById("gas");
const barraNivel = document.getElementById("barraNivel");
const estadoEnchimento = document.getElementById("estadoEnchimento");
const estadoAr = document.getElementById("estadoAr");
const descricaoAr = document.getElementById("descricaoAr");
const estadoGeral = document.getElementById("estadoGeral");
const descricaoEstado = document.getElementById("descricaoEstado");
const horaLeitura = document.getElementById("horaLeitura");
const textoLigacao = document.getElementById("textoLigacao");
const estadoLigacao = document.getElementById("estadoLigacao");
const avisoDemo = document.getElementById("avisoDemo");


// FORMATAR HORA

function obterHora() {
    return new Date().toLocaleTimeString("pt-PT", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
}


// ESTADO DO ENCHIMENTO

function atualizarEnchimento() {
    elementoNivel.textContent = nivelEnchimento;
    barraNivel.style.width = nivelEnchimento + "%";

    if (nivelEnchimento >= LIMITE_ENCHIMENTO_ALERTA) {
        barraNivel.style.backgroundColor = "#d94a43";
        estadoEnchimento.textContent = "Nível crítico de enchimento";
    } else if (nivelEnchimento >= LIMITE_ENCHIMENTO_AVISO) {
        barraNivel.style.backgroundColor = "#e0a52d";
        estadoEnchimento.textContent = "Aproxima-se da capacidade máxima";
    } else {
        barraNivel.style.backgroundColor = "#26774d";
        estadoEnchimento.textContent = "Capacidade disponível";
    }
}


// ESTADO DA QUALIDADE DO AR

function atualizarAr() {
    elementoGas.textContent = valorADC;

    if (valorADC >= LIMITE_GAS_ALERTA) {
        estadoAr.textContent = "Alerta";
        estadoAr.style.backgroundColor = "#fde8e6";
        estadoAr.style.color = "#b42318";
        descricaoAr.textContent = "Leitura ADC elevada no modo de demonstração.";
    } else if (valorADC >= LIMITE_GAS_AVISO) {
        estadoAr.textContent = "Atenção";
        estadoAr.style.backgroundColor = "#fff3d6";
        estadoAr.style.color = "#a66a08";
        descricaoAr.textContent = "A leitura ADC ultrapassou o limite de aviso demonstrativo.";
    } else {
        estadoAr.textContent = "Boa";
        estadoAr.style.backgroundColor = "#e6f4e9";
        estadoAr.style.color = "#26774d";
        descricaoAr.textContent = "Leitura abaixo do limite demonstrativo.";
    }
}


// ESTADO GERAL DO SISTEMA

function atualizarEstadoGeral() {
    estadoGeral.className = "estado-geral";

    if (
        nivelEnchimento >= LIMITE_ENCHIMENTO_ALERTA ||
        valorADC >= LIMITE_GAS_ALERTA
    ) {
        estadoGeral.textContent = "ALERTA";
        estadoGeral.classList.add("estado-alerta");
        descricaoEstado.textContent =
            "Nível de enchimento crítico ou leitura de gás acima do limite demonstrativo.";

    } else if (
        nivelEnchimento >= LIMITE_ENCHIMENTO_AVISO ||
        valorADC >= LIMITE_GAS_AVISO
    ) {
        estadoGeral.textContent = "AVISO";
        estadoGeral.classList.add("estado-atencao");
        descricaoEstado.textContent =
            "O caixote necessita de acompanhamento.";

    } else {
        estadoGeral.textContent = "NORMAL";
        estadoGeral.classList.add("estado-normal");
        descricaoEstado.textContent =
            "O caixote encontra-se dentro dos limites demonstrativos.";
    }
}


// ATUALIZAR A PÁGINA

function atualizarPagina() {
    atualizarEnchimento();
    atualizarAr();
    atualizarEstadoGeral();

    horaLeitura.textContent = obterHora();
}


// GERAR UM VALOR PROGRESSIVO DE DEMONSTRAÇÃO

function simularSensores() {
    contador++;

    // O enchimento aumenta gradualmente.
    // Ao chegar perto de 100%, começa um novo ciclo.
    if (nivelEnchimento >= 98) {
        nivelEnchimento = 8;
    } else {
        nivelEnchimento += Math.floor(Math.random() * 4) + 1;
    }

    // Pequenas variações do valor ADC para demonstrar o sensor.
    // Ocasionalmente sobe para mostrar os estados de aviso/alerta.
    if (contador % 12 === 0) {
        valorADC = 1650 + Math.floor(Math.random() * 500);
    } else if (contador % 20 === 0) {
        valorADC = 2600 + Math.floor(Math.random() * 500);
    } else {
        valorADC = Math.max(
            350,
            Math.min(1400, valorADC + Math.floor(Math.random() * 181) - 90)
        );
    }

    guardarLeitura();
    atualizarPagina();
    desenharGrafico();
}


// GUARDAR HISTÓRICO

function guardarLeitura() {
    historico.push({
        nivel: nivelEnchimento,
        hora: obterHora()
    });

    if (historico.length > 15) {
        historico.shift();
    }
}


// DESENHAR O GRÁFICO

function desenharGrafico() {
    const canvas = document.getElementById("grafico");
    const ctx = canvas.getContext("2d");

    const largura = canvas.clientWidth;
    const altura = canvas.clientHeight;
    const escala = window.devicePixelRatio || 1;

    if (largura === 0 || altura === 0) return;

    canvas.width = largura * escala;
    canvas.height = altura * escala;
    ctx.setTransform(escala, 0, 0, escala, 0, 0);
    ctx.clearRect(0, 0, largura, altura);

    const margemEsquerda = 38;
    const margemDireita = 12;
    const margemSuperior = 12;
    const margemInferior = 30;

    const larguraGrafico = largura - margemEsquerda - margemDireita;
    const alturaGrafico = altura - margemSuperior - margemInferior;

    // Linhas horizontais e escala vertical.
    ctx.font = "10px Arial";
    ctx.fillStyle = "#89968d";
    ctx.strokeStyle = "#edf1ed";
    ctx.lineWidth = 1;

    for (let valor = 0; valor <= 100; valor += 20) {
        const y = margemSuperior + alturaGrafico -
            (valor / 100) * alturaGrafico;

        ctx.beginPath();
        ctx.moveTo(margemEsquerda, y);
        ctx.lineTo(largura - margemDireita, y);
        ctx.stroke();

        ctx.fillText(valor + "%", 2, y + 4);
    }

    if (historico.length === 0) return;

    const pontos = historico.map((leitura, indice) => {
        const x = margemEsquerda +
            (indice / Math.max(historico.length - 1, 1)) * larguraGrafico;

        const y = margemSuperior + alturaGrafico -
            (leitura.nivel / 100) * alturaGrafico;

        return { x, y, hora: leitura.hora };
    });

    // Desenhar curva suave.
    function criarCurva() {
        ctx.beginPath();
        ctx.moveTo(pontos[0].x, pontos[0].y);

        for (let i = 0; i < pontos.length - 1; i++) {
            const atual = pontos[i];
            const seguinte = pontos[i + 1];
            const meioX = (atual.x + seguinte.x) / 2;
            const meioY = (atual.y + seguinte.y) / 2;

            ctx.quadraticCurveTo(atual.x, atual.y, meioX, meioY);
        }

        const ultimo = pontos[pontos.length - 1];
        ctx.lineTo(ultimo.x, ultimo.y);
    }

    // Área preenchida sob a curva.
    criarCurva();
    ctx.lineTo(pontos[pontos.length - 1].x, margemSuperior + alturaGrafico);
    ctx.lineTo(pontos[0].x, margemSuperior + alturaGrafico);
    ctx.closePath();

    const gradiente = ctx.createLinearGradient(0, margemSuperior, 0, altura);
    gradiente.addColorStop(0, "rgba(38, 119, 77, 0.22)");
    gradiente.addColorStop(1, "rgba(38, 119, 77, 0.01)");
    ctx.fillStyle = gradiente;
    ctx.fill();

    // Linha principal.
    criarCurva();
    ctx.strokeStyle = "#26774d";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    // Ponto mais recente.
    const ultimo = pontos[pontos.length - 1];

    ctx.beginPath();
    ctx.arc(ultimo.x, ultimo.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#26774d";
    ctx.fill();

    // Eixo temporal: início, meio e última leitura.
    const indices = [
        0,
        Math.floor((pontos.length - 1) / 2),
        pontos.length - 1
    ];

    ctx.fillStyle = "#89968d";
    ctx.font = "9px Arial";
    ctx.textAlign = "center";

    indices.forEach(indice => {
        const ponto = pontos[indice];
        ctx.fillText(ponto.hora, ponto.x, altura - 7);
    });

    ctx.textAlign = "left";
}


// MODO DE DEMONSTRAÇÃO

function iniciarDemonstracao() {
    estadoLigacao.classList.remove("ligado");
    estadoLigacao.classList.add("sem-ligacao");

    textoLigacao.textContent = "Modo demonstração";
    avisoDemo.style.display = "flex";

    // Criar várias leituras iniciais para o gráfico não aparecer vazio.
    for (let i = 0; i < 7; i++) {
        nivelEnchimento += 2;
        valorADC = 650 + i * 25;
        guardarLeitura();
    }

    atualizarPagina();
    desenharGrafico();

    // Continuar a simulação a cada 3 segundos.
    setInterval(simularSensores, 3000);
}


// INICIAR QUANDO A PÁGINA ESTIVER CARREGADA

window.addEventListener("load", iniciarDemonstracao);
window.addEventListener("resize", desenharGrafico);
