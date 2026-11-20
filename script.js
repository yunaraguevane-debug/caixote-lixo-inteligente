
/* =====================================
   CLI - CAIXOTE DO LIXO INTELIGENTE
   ===================================== */

// VALORES DEMONSTRATIVOS DOS SENSORES

let nivelEnchimento = 0;
let qualidadeAr = 100;

// HISTORICO DO GRAFICO

let historico = [];

// ELEMENTOS HTML

const nivelElemento = document.getElementById("nivel");
const gasElemento = document.getElementById("gas");
const estadoElemento = document.getElementById("estado");
const estadoArElemento = document.getElementById("estadoAr");
const descricaoArElemento = document.getElementById("descricaoAr");
const descricaoEstadoElemento = document.getElementById("descricaoEstado");
const ligacaoElemento = document.getElementById("ligacao");
const atualizacaoElemento = document.getElementById("atualizacao");
const barra = document.getElementById("barraNivel");

// LIMITES DEMONSTRATIVOS
// Estes valores terão de ser ajustados após calibrar o MQ-2.

const LIMITE_AR_ATENCAO = 150;
const LIMITE_AR_ALERTA = 300;


// ATUALIZAR O PAINEL

function atualizarPagina() {

    // Atualizar valores

    nivelElemento.textContent = nivelEnchimento;
    gasElemento.textContent = qualidadeAr;

    // Atualizar barra de enchimento

    barra.style.width = nivelEnchimento + "%";

    if (nivelEnchimento >= 90) {
        barra.style.backgroundColor = "#d92d20";
    } else if (nivelEnchimento >= 70) {
        barra.style.backgroundColor = "#e5a000";
    } else {
        barra.style.backgroundColor = "#26774d";
    }

    // Atualizar qualidade do ar

    if (qualidadeAr >= LIMITE_AR_ALERTA) {

        estadoArElemento.textContent = "Má";
        estadoArElemento.style.backgroundColor = "#fde8e6";
        estadoArElemento.style.color = "#b42318";

        descricaoArElemento.textContent = "Valor elevado detetado";

    } else if (qualidadeAr >= LIMITE_AR_ATENCAO) {

        estadoArElemento.textContent = "Atenção";
        estadoArElemento.style.backgroundColor = "#fff3d6";
        estadoArElemento.style.color = "#a66a08";

        descricaoArElemento.textContent = "É necessário acompanhar os valores";

    } else {

        estadoArElemento.textContent = "Boa";
        estadoArElemento.style.backgroundColor = "#e6f4e9";
        estadoArElemento.style.color = "#26774d";

        descricaoArElemento.textContent = "Valores dentro do intervalo demonstrativo";
    }

    // Atualizar estado geral do caixote

    if (
        nivelEnchimento >= 90 ||
        qualidadeAr >= LIMITE_AR_ALERTA
    ) {

        estadoElemento.textContent = "ALERTA";
        estadoElemento.className = "estado-geral estado-alerta";

        descricaoEstadoElemento.textContent =
            "É necessária uma intervenção.";

    } else if (
        nivelEnchimento >= 70 ||
        qualidadeAr >= LIMITE_AR_ATENCAO
    ) {

        estadoElemento.textContent = "ATENÇÃO";
        estadoElemento.className = "estado-geral estado-atencao";

        descricaoEstadoElemento.textContent =
            "O caixote necessita de acompanhamento.";

    } else {

        estadoElemento.textContent = "NORMAL";
        estadoElemento.className = "estado-geral estado-normal";

        descricaoEstadoElemento.textContent =
            "O caixote encontra-se em estado normal.";
    }

    // Atualizar hora

    const agora = new Date();

    atualizacaoElemento.textContent =
        "Atualizado às " +
        agora.toLocaleTimeString("pt-PT", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
}


// DESENHAR GRAFICO CURVILINEO

function desenharGrafico() {

    const canvas = document.getElementById("grafico");
    const ctx = canvas.getContext("2d");

    // Adaptar o canvas ao tamanho do ecrã

    const largura = canvas.clientWidth;
    const altura = canvas.clientHeight;
    const escala = window.devicePixelRatio || 1;

    canvas.width = largura * escala;
    canvas.height = altura * escala;

    ctx.setTransform(escala, 0, 0, escala, 0, 0);

    ctx.clearRect(0, 0, largura, altura);

    const margemEsquerda = 42;
    const margemDireita = 12;
    const margemSuperior = 15;
    const margemInferior = 20;

    const larguraGrafico =
        largura - margemEsquerda - margemDireita;

    const alturaGrafico =
        altura - margemSuperior - margemInferior;

    // Linhas horizontais e escala

    ctx.font = "11px Arial";
    ctx.fillStyle = "#89968d";
    ctx.strokeStyle = "#edf1ed";
    ctx.lineWidth = 1;

    for (let valor = 0; valor <= 100; valor += 20) {

        const y =
            margemSuperior +
            alturaGrafico -
            (valor / 100) * alturaGrafico;

        ctx.beginPath();
        ctx.moveTo(margemEsquerda, y);
        ctx.lineTo(largura - margemDireita, y);
        ctx.stroke();

        ctx.fillText(valor + "%", 3, y + 4);
    }

    if (historico.length === 0) {
        return;
    }

    // Calcular posição dos pontos

    const pontos = [];

    for (let i = 0; i < historico.length; i++) {

        const x = margemEsquerda +
            (i / Math.max(historico.length - 1, 1)) *
            larguraGrafico;

        const y = margemSuperior +
            alturaGrafico -
            (historico[i] / 100) * alturaGrafico;

        pontos.push({ x, y });
    }

    // Criar linha curva com curvas de Bézier

    function desenharCurva() {

        ctx.beginPath();
        ctx.moveTo(pontos[0].x, pontos[0].y);

        for (let i = 0; i < pontos.length - 1; i++) {

            const pontoAtual = pontos[i];
            const proximoPonto = pontos[i + 1];

            const meioX =
                (pontoAtual.x + proximoPonto.x) / 2;

            const meioY =
                (pontoAtual.y + proximoPonto.y) / 2;

            ctx.quadraticCurveTo(
                pontoAtual.x,
                pontoAtual.y,
                meioX,
                meioY
            );
        }

        const ultimo = pontos[pontos.length - 1];

        ctx.lineTo(ultimo.x, ultimo.y);
    }

    // Preencher área por baixo da curva

    desenharCurva();

    ctx.lineTo(
        pontos[pontos.length - 1].x,
        margemSuperior + alturaGrafico
    );

    ctx.lineTo(
        pontos[0].x,
        margemSuperior + alturaGrafico
    );

    ctx.closePath();

    const gradiente = ctx.createLinearGradient(
        0,
        margemSuperior,
        0,
        altura
    );

    gradiente.addColorStop(0, "rgba(38, 119, 77, 0.20)");
    gradiente.addColorStop(1, "rgba(38, 119, 77, 0.01)");

    ctx.fillStyle = gradiente;
    ctx.fill();

    // Desenhar linha principal

    desenharCurva();

    ctx.strokeStyle = "#26774d";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    // Desenhar último ponto

    const ultimo = pontos[pontos.length - 1];

    ctx.beginPath();
    ctx.arc(ultimo.x, ultimo.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#26774d";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(ultimo.x, ultimo.y, 9, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(38, 119, 77, 0.20)";
    ctx.lineWidth = 3;
    ctx.stroke();
}


// SIMULAR SENSORES

function simularSensores() {

    // Valores aleatórios para testar a interface.
    // Posteriormente serão substituídos pelos dados do ESP32.

    nivelEnchimento = Math.floor(Math.random() * 101);

    qualidadeAr = Math.floor(Math.random() * 500);

    // Guardar histórico do enchimento

    historico.push(nivelEnchimento);

    // Manter apenas os últimos 20 valores

    if (historico.length > 20) {
        historico.shift();
    }

    atualizarPagina();
    desenharGrafico();
}


// INDICAR MODO DE DEMONSTRAÇÃO

ligacaoElemento.textContent =
    "Modo de demonstração · Dados simulados";


// INICIAR SISTEMA

simularSensores();

setInterval(simularSensores, 3000);


// ATUALIZAR GRAFICO QUANDO A JANELA MUDA DE TAMANHO

window.addEventListener("resize", desenharGrafico);
