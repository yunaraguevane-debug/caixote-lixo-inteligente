
/* =====================================
   CLI - CAIXOTE DO LIXO INTELIGENTE
   ===================================== */

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
const simboloEstado = document.getElementById("simboloEstado");

const canvas = document.getElementById("grafico");
const ctx = canvas.getContext("2d");

const tempoInicialElemento = document.getElementById("tempoInicial");
const tempoFinalElemento = document.getElementById("tempoFinal");


// VALORES INICIAIS DOS SENSORES

let nivelEnchimento = 24;
let qualidadeAr = 650;


// HISTORICO DO GRAFICO

let historico = [];

const MAX_PONTOS = 40;
const INTERVALO = 3000;


// LIMITES DEMONSTRATIVOS DO MQ-2

// Estes limites são provisórios.
// Devem ser ajustados depois de testar e calibrar o sensor.

const LIMITE_AR_ATENCAO = 1500;
const LIMITE_AR_ALERTA = 2500;


// FORMATAR HORA

function obterHora(data = new Date()) {

    return data.toLocaleTimeString("pt-PT", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
}


// ATUALIZAR O PAINEL

function atualizarPagina() {

    // ENCHIMENTO

    const nivelApresentado = Math.round(nivelEnchimento);

    nivelElemento.textContent = nivelApresentado;

    barra.style.width = nivelEnchimento + "%";

    if (nivelEnchimento >= 90) {

        barra.style.backgroundColor = "#d92d20";

    } else if (nivelEnchimento >= 70) {

        barra.style.backgroundColor = "#e5a000";

    } else {

        barra.style.backgroundColor = "#26774d";
    }


    // QUALIDADE DO AR

    gasElemento.textContent = qualidadeAr;

    if (qualidadeAr >= LIMITE_AR_ALERTA) {

        estadoArElemento.textContent = "Leitura elevada";

        estadoArElemento.style.backgroundColor = "#fde8e6";
        estadoArElemento.style.color = "#b42318";

        descricaoArElemento.textContent =
            "Valor elevado detetado pelo sensor.";

    } else if (qualidadeAr >= LIMITE_AR_ATENCAO) {

        estadoArElemento.textContent = "Atenção";

        estadoArElemento.style.backgroundColor = "#fff3d6";
        estadoArElemento.style.color = "#a66a08";

        descricaoArElemento.textContent =
            "A leitura merece acompanhamento.";

    } else {

        estadoArElemento.textContent = "Leitura baixa";

        estadoArElemento.style.backgroundColor = "#e6f4e9";
        estadoArElemento.style.color = "#26774d";

        descricaoArElemento.textContent =
            "Valor dentro do intervalo demonstrativo.";
    }


    // ESTADO GERAL DO CAIXOTE

    if (
        nivelEnchimento >= 90 ||
        qualidadeAr >= LIMITE_AR_ALERTA
    ) {

        estadoElemento.textContent = "ALERTA";

        estadoElemento.className =
            "estado-geral estado-alerta";

        simboloEstado.textContent = "🚨";

        simboloEstado.className =
            "estado-simbolo simbolo-alerta";

        descricaoEstadoElemento.textContent =
            "É necessária uma intervenção no caixote.";

    } else if (
        nivelEnchimento >= 70 ||
        qualidadeAr >= LIMITE_AR_ATENCAO
    ) {

        estadoElemento.textContent = "ATENÇÃO";

        estadoElemento.className =
            "estado-geral estado-atencao";

        simboloEstado.textContent = "⚠️";

        simboloEstado.className =
            "estado-simbolo simbolo-atencao";

        descricaoEstadoElemento.textContent =
            "Um dos indicadores necessita de acompanhamento.";

    } else {

        estadoElemento.textContent = "NORMAL";

        estadoElemento.className =
            "estado-geral estado-normal";

        simboloEstado.textContent = "🌱";

        simboloEstado.className =
            "estado-simbolo";

        descricaoEstadoElemento.textContent =
            "O caixote encontra-se em estado normal.";
    }


    // HORA DA ULTIMA ATUALIZACAO

    atualizacaoElemento.textContent =
        "Atualizado às " + obterHora();
}


// DESENHAR O GRAFICO

function desenharGrafico() {

    const largura = canvas.clientWidth;
    const altura = canvas.clientHeight;

    if (!largura || !altura) {
        return;
    }

    // Adaptar o canvas ao ecrã e à resolução do dispositivo

    const escala = window.devicePixelRatio || 1;

    canvas.width = Math.round(largura * escala);
    canvas.height = Math.round(altura * escala);

    ctx.setTransform(escala, 0, 0, escala, 0, 0);

    ctx.clearRect(0, 0, largura, altura);


    // MARGENS DO GRAFICO

    const margemEsquerda = 42;
    const margemDireita = 12;
    const margemSuperior = 15;
    const margemInferior = 30;

    const larguraGrafico =
        largura - margemEsquerda - margemDireita;

    const alturaGrafico =
        altura - margemSuperior - margemInferior;


    // ESCALA VERTICAL

    ctx.font = "10px Arial";
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

        ctx.textAlign = "right";

        ctx.fillText(
            valor + "%",
            margemEsquerda - 8,
            y + 4
        );
    }


    // PRECISA DE PELO MENOS DOIS PONTOS

    if (historico.length < 2) {
        return;
    }


    // CALCULAR POSICAO DOS PONTOS EM FUNCAO DO TEMPO

    const primeiroTempo = historico[0].tempo.getTime();

    const ultimoTempo =
        historico[historico.length - 1].tempo.getTime();

    const intervaloTotal = ultimoTempo - primeiroTempo;

    if (intervaloTotal <= 0) {
        return;
    }

    const pontos = historico.map(item => {

        const tempo = item.tempo.getTime();

        const proporcao =
            (tempo - primeiroTempo) / intervaloTotal;

        const x =
            margemEsquerda + proporcao * larguraGrafico;

        const y =
            margemSuperior +
            alturaGrafico -
            (item.valor / 100) * alturaGrafico;

        return { x, y };
    });


    // DESENHAR A CURVA SUAVE

    function desenharCurva() {

        ctx.beginPath();

        ctx.moveTo(
            pontos[0].x,
            pontos[0].y
        );

        for (let i = 0; i < pontos.length - 1; i++) {

            const atual = pontos[i];
            const seguinte = pontos[i + 1];

            const meioX =
                (atual.x + seguinte.x) / 2;

            const meioY =
                (atual.y + seguinte.y) / 2;

            ctx.quadraticCurveTo(
                atual.x,
                atual.y,
                meioX,
                meioY
            );
        }

        const ultimo = pontos[pontos.length - 1];

        ctx.lineTo(
            ultimo.x,
            ultimo.y
        );
    }


    // AREA PREENCHIDA COM GRADIENTE

    desenharCurva();

    const ultimo = pontos[pontos.length - 1];

    ctx.lineTo(
        ultimo.x,
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

    gradiente.addColorStop(
        0,
        "rgba(38, 119, 77, 0.20)"
    );

    gradiente.addColorStop(
        1,
        "rgba(38, 119, 77, 0.01)"
    );

    ctx.fillStyle = gradiente;
    ctx.fill();


    // LINHA PRINCIPAL

    desenharCurva();

    ctx.strokeStyle = "#26774d";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.stroke();


    // ULTIMO PONTO DO GRAFICO

    ctx.beginPath();

    ctx.arc(
        ultimo.x,
        ultimo.y,
        5,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#26774d";
    ctx.fill();

    ctx.beginPath();

    ctx.arc(
        ultimo.x,
        ultimo.y,
        9,
        0,
        Math.PI * 2
    );

    ctx.strokeStyle = "rgba(38, 119, 77, 0.20)";
    ctx.lineWidth = 3;

    ctx.stroke();


    // TEMPO NO EIXO HORIZONTAL

    const indices = [
        0,
        Math.floor((historico.length - 1) / 2),
        historico.length - 1
    ];

    ctx.font = "9px Arial";
    ctx.fillStyle = "#89968d";
    ctx.textAlign = "center";

    indices.forEach(indice => {

        const item = historico[indice];
        const ponto = pontos[indice];

        ctx.fillText(
            obterHora(item.tempo),
            ponto.x,
            altura - 7
        );
    });


    // ATUALIZAR INDICACAO DE TEMPO

    tempoInicialElemento.textContent =
        obterHora(historico[0].tempo);

    tempoFinalElemento.textContent =
        obterHora(historico[historico.length - 1].tempo);
}


// SIMULAR SENSORES

function simularSensores() {

    /*
       O enchimento aumenta lentamente.
       A variação é pequena em cada leitura de 3 segundos.

       O nível não diminui automaticamente.
       Quando chega a 100%, permanece cheio.
    */

    const aumento =
        0.02 + Math.random() * 0.06;

    nivelEnchimento = Math.min(
        100,
        nivelEnchimento + aumento
    );


    // SIMULACAO DO MQ-2

    // Pequenas oscilações na leitura ADC

    const variacaoAr =
        Math.floor(Math.random() * 31) - 15;

    qualidadeAr = Math.max(
        300,
        Math.min(
            4095,
            qualidadeAr + variacaoAr
        )
    );


    // GUARDAR LEITURA E HORA

    historico.push({
        valor: nivelEnchimento,
        tempo: new Date()
    });


    // MANTER APENAS AS ULTIMAS 40 LEITURAS

    if (historico.length > MAX_PONTOS) {
        historico.shift();
    }


    // ATUALIZAR PAGINA

    atualizarPagina();
    desenharGrafico();
}


// CRIAR HISTORICO INICIAL

function iniciarHistorico() {

    const agora = Date.now();

    historico = [];

    for (let i = 0; i < MAX_PONTOS; i++) {

        const valorInicial =
            24 - (MAX_PONTOS - 1 - i) * 0.025;

        const tempoAnterior =
            agora - (MAX_PONTOS - 1 - i) * INTERVALO;

        historico.push({
            valor: Math.max(0, valorInicial),
            tempo: new Date(tempoAnterior)
        });
    }
}


// MODO DE DEMONSTRACAO

ligacaoElemento.textContent =
    "Modo de demonstração · Dados simulados";


// INICIAR SISTEMA

function iniciarSistema() {

    iniciarHistorico();

    atualizarPagina();

    desenharGrafico();

    // Atualizar sensores de 3 em 3 segundos

    setInterval(simularSensores, INTERVALO);
}


// INICIAR QUANDO A PAGINA ESTIVER CARREGADA

window.addEventListener("load", iniciarSistema);


// REDIMENSIONAR GRAFICO

window.addEventListener("resize", desenharGrafico);
