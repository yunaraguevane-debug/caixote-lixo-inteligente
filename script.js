
// ======================================
// CAIXOTE DO LIXO INTELIGENTE
// MODO DE DEMONSTRAÇÃO
// ======================================

// Elementos da página
const nivelElemento = document.getElementById("nivel");
const barraElemento = document.getElementById("barra-nivel");
const gasElemento = document.getElementById("gas");
const estadoElemento = document.getElementById("estado");
const estadoSimbolo = document.getElementById("estado-simbolo");
const grafico = document.getElementById("grafico");

const ctx = grafico.getContext("2d");

// Valores iniciais
let nivel = 24;
let gas = 650;

// Histórico do gráfico
const historico = [];

const INTERVALO = 2000;
const MAX_PONTOS = 40;

// ======================================
// ATUALIZAR NÍVEL DE ENCHIMENTO
// ======================================

function atualizarNivel() {

    // O nível aumenta gradualmente
    if (nivel < 100) {
        nivel += 0.2 + Math.random() * 0.3;
    }

    nivel = Math.min(nivel, 100);

    nivelElemento.textContent = nivel.toFixed(1) + "%";
    barraElemento.style.width = nivel + "%";

    if (nivel >= 90) {
        barraElemento.style.background = "#dc5252";
    } else if (nivel >= 70) {
        barraElemento.style.background = "#e5ae43";
    } else {
        barraElemento.style.background = "#56a879";
    }
}

// ======================================
// ATUALIZAR SENSOR MQ-2
// ======================================

function atualizarGas() {

    // Pequenas variações para simular o sensor
    gas += Math.random() * 30 - 15;

    gas = Math.max(300, Math.min(4095, gas));

    gasElemento.textContent = Math.round(gas) + " ADC";
}

// ======================================
// ATUALIZAR ESTADO DO CAIXOTE
// ======================================

function atualizarEstado() {

    if (nivel >= 90 || gas >= 2500) {

        estadoElemento.textContent = "Alerta";
        estadoSimbolo.textContent = "🚨";

    } else if (nivel >= 70 || gas >= 1500) {

        estadoElemento.textContent = "Atenção";
        estadoSimbolo.textContent = "⚠️";

    } else {

        estadoElemento.textContent = "Normal";
        estadoSimbolo.textContent = "🌱";
    }
}

// ======================================
// REGISTAR LEITURAS
// ======================================

function registarLeitura() {

    historico.push({
        tempo: Date.now(),
        nivel: nivel
    });

    if (historico.length > MAX_PONTOS) {
        historico.shift();
    }
}

// ======================================
// DESENHAR GRÁFICO
// ======================================

function desenharGrafico() {

    const largura = grafico.clientWidth;
    const altura = grafico.clientHeight;

    const escala = window.devicePixelRatio || 1;

    grafico.width = largura * escala;
    grafico.height = altura * escala;

    ctx.setTransform(escala, 0, 0, escala, 0, 0);

    ctx.clearRect(0, 0, largura, altura);

    if (historico.length < 2) return;

    const margem = 35;
    const larguraUtil = largura - margem * 2;
    const alturaUtil = altura - margem * 2;

    const inicio = historico[0].tempo;
    const fim = historico[historico.length - 1].tempo;
    const duracao = fim - inicio || 1;

    // Linhas horizontais de referência
    ctx.strokeStyle = "#e7eee8";
    ctx.lineWidth = 1;

    for (let i = 0; i <= 4; i++) {

        const y = margem + (alturaUtil / 4) * i;

        ctx.beginPath();
        ctx.moveTo(margem, y);
        ctx.lineTo(largura - margem, y);
        ctx.stroke();
    }

    // Coordenadas dos pontos
    const pontos = historico.map(leitura => {

        const x = margem +
            ((leitura.tempo - inicio) / duracao) * larguraUtil;

        const y = altura - margem -
            (leitura.nivel / 100) * alturaUtil;

        return { x, y };
    });

    // Área preenchida
    ctx.beginPath();
    ctx.moveTo(pontos[0].x, altura - margem);

    pontos.forEach(ponto => {
        ctx.lineTo(ponto.x, ponto.y);
    });

    ctx.lineTo(pontos[pontos.length - 1].x, altura - margem);
    ctx.closePath();

    const gradiente = ctx.createLinearGradient(0, margem, 0, altura);

    gradiente.addColorStop(0, "rgba(76, 150, 105, 0.25)");
    gradiente.addColorStop(1, "rgba(76, 150, 105, 0.02)");

    ctx.fillStyle = gradiente;
    ctx.fill();

    // Linha curva
    ctx.beginPath();
    ctx.moveTo(pontos[0].x, pontos[0].y);

    for (let i = 1; i < pontos.length; i++) {

        const anterior = pontos[i - 1];
        const atual = pontos[i];

        const meio = (anterior.x + atual.x) / 2;

        ctx.quadraticCurveTo(
            meio,
            anterior.y,
            atual.x,
            atual.y
        );
    }

    ctx.strokeStyle = "#4c9669";
    ctx.lineWidth = 2.5;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.stroke();

    // Eixo temporal
    ctx.fillStyle = "#849087";
    ctx.font = "11px sans-serif";
    ctx.textAlign = "center";

    const etiquetas = 4;

    for (let i = 0; i <= etiquetas; i++) {

        const tempo = inicio + (duracao / etiquetas) * i;
        const data = new Date(tempo);

        const horas = String(data.getHours()).padStart(2, "0");
        const minutos = String(data.getMinutes()).padStart(2, "0");
        const segundos = String(data.getSeconds()).padStart(2, "0");

        const x = margem + (larguraUtil / etiquetas) * i;

        ctx.fillText(
            `${horas}:${minutos}:${segundos}`,
            x,
            altura - 8
        );
    }
}

// ======================================
// ATUALIZAR TODO O SISTEMA
// ======================================

function atualizarSistema() {

    atualizarNivel();
    atualizarGas();
    atualizarEstado();

    registarLeitura();
    desenharGrafico();
}

// ======================================
// INICIAR DEMONSTRAÇÃO
// ======================================

// Criar histórico inicial
for (let i = 0; i < MAX_PONTOS; i++) {

    historico.push({
        tempo: Date.now() - (MAX_PONTOS - i) * INTERVALO,
        nivel: nivel - (MAX_PONTOS - i) * 0.15
    });
}

atualizarSistema();

// Atualizar a cada 2 segundos
setInterval(atualizarSistema, INTERVALO);

// Redesenhar quando o tamanho do ecrã mudar
window.addEventListener("resize", desenharGrafico);
