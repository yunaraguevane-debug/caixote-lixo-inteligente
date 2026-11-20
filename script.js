
const nivelElemento = document.getElementById("nivel");
const barraNivel = document.getElementById("barraNivel");
const estadoEnchimento = document.getElementById("estadoEnchimento");
const valorAr = document.getElementById("valorAr");
const estadoAr = document.getElementById("estadoAr");
const estadoGeral = document.getElementById("estadoGeral");
const descricaoEstado = document.getElementById("descricaoEstado");
const statusIcon = document.getElementById("statusIcon");
const statusPill = document.getElementById("statusPill");
const statusBanner = document.getElementById("statusBanner");
const horaLeitura = document.getElementById("horaLeitura");

const canvas = document.getElementById("grafico");
const ctx = canvas.getContext("2d");

let nivel = 24;
let gas = 650;

const historico = [];
const MAX_PONTOS = 20;

function horaAtual() {
  return new Date().toLocaleTimeString("pt-PT", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}

function adicionarLeitura() {
  historico.push({
    hora: horaAtual(),
    valor: nivel
  });

  if (historico.length > MAX_PONTOS) {
    historico.shift();
  }
}

function atualizarEnchimento() {
  nivelElemento.textContent = nivel;
  barraNivel.style.width = nivel + "%";

  if (nivel >= 90) {
    barraNivel.style.background = "#dc6868";
    estadoEnchimento.textContent = "Lixeira cheia";
    estadoEnchimento.style.color = "#dc6868";
  } else if (nivel >= 70) {
    barraNivel.style.background = "#e8a34b";
    estadoEnchimento.textContent = "Atenção";
    estadoEnchimento.style.color = "#c58a39";
  } else {
    barraNivel.style.background = "#56ae7b";
    estadoEnchimento.textContent = "Nível baixo";
    estadoEnchimento.style.color = "#23795b";
  }
}

function atualizarQualidadeAr() {
  valorAr.textContent = gas;

  if (gas >= 2500) {
    estadoAr.innerHTML = '<span class="air-dot"></span> Qualidade crítica';
    estadoAr.style.color = "#dc6868";
    estadoAr.querySelector(".air-dot").style.background = "#dc6868";
  } else if (gas >= 1500) {
    estadoAr.innerHTML = '<span class="air-dot"></span> Atenção à qualidade';
    estadoAr.style.color = "#c58a39";
    estadoAr.querySelector(".air-dot").style.background = "#e8a34b";
  } else {
    estadoAr.innerHTML = '<span class="air-dot"></span> Boa qualidade';
    estadoAr.style.color = "#23795b";
    estadoAr.querySelector(".air-dot").style.background = "#56ae7b";
  }
}

function atualizarEstadoGeral() {
  const alertaEnchimento = nivel >= 90;
  const avisoEnchimento = nivel >= 70;
  const alertaAr = gas >= 2500;
  const avisoAr = gas >= 1500;

  if (alertaEnchimento || alertaAr) {
    estadoGeral.textContent = "Atenção necessária";
    descricaoEstado.textContent = "Foi detetada uma condição de alerta.";
    statusIcon.textContent = "🚨";
    statusPill.textContent = "ALERTA";
    statusPill.style.background = "#713c3c";
    statusPill.style.color = "#ffd0d0";
    statusBanner.style.borderLeft = "4px solid #dc6868";
  } else if (avisoEnchimento || avisoAr) {
    estadoGeral.textContent = "Atenção";
    descricaoEstado.textContent = "Um dos indicadores precisa de ser acompanhado.";
    statusIcon.textContent = "⚠️";
    statusPill.textContent = "AVISO";
    statusPill.style.background = "#70562e";
    statusPill.style.color = "#ffe0a8";
    statusBanner.style.borderLeft = "4px solid #e8a34b";
  } else {
    estadoGeral.textContent = "Tudo sob controlo";
    descricaoEstado.textContent = "Os indicadores encontram-se em níveis normais.";
    statusIcon.textContent = "🌱";
    statusPill.textContent = "NORMAL";
    statusPill.style.background = "#285b43";
    statusPill.style.color = "#a9edc3";
    statusBanner.style.borderLeft = "4px solid #56ae7b";
  }
}

function atualizarHora() {
  horaLeitura.textContent = horaAtual();
}

function atualizarInterface() {
  atualizarEnchimento();
  atualizarQualidadeAr();
  atualizarEstadoGeral();
  atualizarHora();
}

function simularSensores() {
  // Simulação do nível de enchimento
  nivel += Math.floor(Math.random() * 5);

  if (nivel > 100) {
    nivel = 8;
  }

  // Simulação da leitura do MQ-2
  const variacao = Math.floor(Math.random() * 301) - 150;
  gas += variacao;

  gas = Math.max(300, Math.min(3000, gas));

  // Ocasionalmente, simula uma alteração maior na leitura
  if (Math.random() < 0.12) {
    gas = Math.floor(1400 + Math.random() * 1500);
  }

  adicionarLeitura();
  atualizarInterface();
  desenharGrafico();
}

function desenharGrafico() {
  const largura = canvas.clientWidth;
  const altura = canvas.clientHeight;

  if (!largura || !altura) return;

  const dpr = window.devicePixelRatio || 1;

  canvas.width = largura * dpr;
  canvas.height = altura * dpr;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, largura, altura);

  const margem = { top: 12, right: 12, bottom: 30, left: 35 };
  const graficoLargura = largura - margem.left - margem.right;
  const graficoAltura = altura - margem.top - margem.bottom;

  // Linhas horizontais e escala
  ctx.font = "10px Manrope";
  ctx.fillStyle = "#91a097";
  ctx.textAlign = "right";

  [0, 25, 50, 75, 100].forEach(valor => {
    const y = margem.top + graficoAltura * (1 - valor / 100);

    ctx.beginPath();
    ctx.strokeStyle = "#edf1ed";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 5]);
    ctx.moveTo(margem.left, y);
    ctx.lineTo(largemDireita(), y);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillText(valor + "%", margem.left - 8, y + 3);
  });

  function largemDireita() {
    return largura - margem.right;
  }

  if (historico.length < 2) return;

  const pontos = historico.map((item, indice) => ({
    x: margem.left + (indice / (MAX_PONTOS - 1)) * graficoLargura,
    y: margem.top + graficoAltura * (1 - item.valor / 100),
    valor: item.valor
  }));

  // Área preenchida
  const gradiente = ctx.createLinearGradient(0, margem.top, 0, altura);
  gradiente.addColorStop(0, "rgba(49, 150, 107, 0.23)");
  gradiente.addColorStop(1, "rgba(49, 150, 107, 0.01)");

  ctx.beginPath();
  ctx.moveTo(pontos[0].x, margem.top + graficoAltura);

  pontos.forEach(ponto => {
    ctx.lineTo(ponto.x, ponto.y);
  });

  ctx.lineTo(pontos[pontos.length - 1].x, margem.top + graficoAltura);
  ctx.closePath();
  ctx.fillStyle = gradiente;
  ctx.fill();

  // Linha curva
  ctx.beginPath();
  ctx.moveTo(pontos[0].x, pontos[0].y);

  for (let i = 1; i < pontos.length; i++) {
    const anterior = pontos[i - 1];
    const atual = pontos[i];
    const meioX = (anterior.x + atual.x) / 2;

    ctx.quadraticCurveTo(
      anterior.x,
      anterior.y,
      meioX,
      (anterior.y + atual.y) / 2
    );
  }

  const ultimo = pontos[pontos.length - 1];
  ctx.lineTo(ultimo.x, ultimo.y);

  ctx.strokeStyle = "#31966b";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.stroke();

  // Ponto da leitura mais recente
  ctx.beginPath();
  ctx.arc(ultimo.x, ultimo.y, 5, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(ultimo.x, ultimo.y, 3, 0, Math.PI * 2);
  ctx.fillStyle = "#23795b";
  ctx.fill();

  // Horas no eixo horizontal
  ctx.fillStyle = "#91a097";
  ctx.font = "9px Manrope";
  ctx.textAlign = "center";

  const indices = [0, Math.floor((historico.length - 1) / 2), historico.length - 1];

  indices.forEach(indice => {
    const ponto = pontos[indice];
    if (ponto) {
      ctx.fillText(historico[indice].hora, ponto.x, altura - 7);
    }
  });
}

function iniciarDashboard() {
  // Leituras iniciais para o gráfico não aparecer vazio
  for (let i = 0; i < 10; i++) {
    nivel = Math.max(0, Math.min(100, 20 + Math.floor(Math.random() * 15)));
    adicionarLeitura();
  }

  nivel = 24;
  atualizarInterface();
  desenharGrafico();

  // Atualização automática a cada 3 segundos
  setInterval(simularSensores, 3000);
}

window.addEventListener("load", iniciarDashboard);
window.addEventListener("resize", desenharGrafico);
