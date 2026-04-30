const fosforo        = document.getElementById('match');
const instrucao      = document.getElementById('instruction');
const barraCalor     = document.getElementById('barra-calor');
const progressoCalor = document.getElementById('progresso-calor');
const cabecaFosforo  = document.getElementById('match-head');
const fosforosMini   = document.querySelectorAll('.fosforo-mini');
const msgSemFosforos = document.getElementById('sem-fosforos');
const contadorEl     = document.getElementById('contador-riscadas');

let ultimoTempo      = 0;
let ultimoX          = 0;
let ultimoY          = 0;
let estaAceso        = false;
let calor            = 0;
let ultimoSomRiscado = 0;
let timeoutReset     = null;
let timeoutApagando  = null;

let fosforosRestantes = 5;
let fosforoAtual      = 0;
let contadorRiscadas  = 0;
let emRiscando        = false;
let semFosforos       = false;

const VELOCIDADE_MINIMA = 0.5;
const CALOR_IGNICAO     = 30;

function atualizarBarraCalor() {
  const percentual           = Math.min((calor / CALOR_IGNICAO) * 100, 100);
  progressoCalor.style.width = percentual + '%';
  if (calor > 0 && !estaAceso) {
    barraCalor.classList.add('visivel');
  } else {
    barraCalor.classList.remove('visivel');
  }
}

function atualizarContador() {
  contadorEl.innerText = `${contadorRiscadas} riscada${contadorRiscadas !== 1 ? 's' : ''}`;
  contadorEl.classList.add('visivel');
}

function marcarFosforoQueimado() {
  if (fosforoAtual >= 5) return;

  fosforosMini[fosforoAtual].classList.remove('ativo');
  fosforosMini[fosforoAtual].classList.add('queimado');
  fosforoAtual++;
  fosforosRestantes--;

  contadorRiscadas = 0;
  emRiscando       = false;
  contadorEl.classList.remove('visivel');

  if (fosforosRestantes === 0) {
    semFosforos = true;
    document.body.classList.add('esgotado');
    setTimeout(() => msgSemFosforos.classList.add('visivel'), 800);
  } else {
    fosforosMini[fosforoAtual].classList.add('ativo');
  }
}

function obterPosicao(e) {
  if (e.touches && e.touches.length > 0) {
    return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }
  return { x: e.clientX, y: e.clientY };
}

function tratarMovimento(e) {
  if (estaAceso || semFosforos) return;

  if (e.type === 'touchmove') {
    e.preventDefault();
  }

  if (document.body.classList.contains('extinguished')) {
    document.body.classList.remove('extinguished');
    clearTimeout(timeoutReset);
  }

  const posicao    = obterPosicao(e);
  const tempoAtual = Date.now();

  if (ultimoTempo !== 0) {
    const deltaTempo = tempoAtual - ultimoTempo;

    if (deltaTempo > 0) {
      const dx        = posicao.x - ultimoX;
      const dy        = posicao.y - ultimoY;
      const distancia = Math.sqrt(dx * dx + dy * dy);
      const velocidade = distancia / deltaTempo;

      const centroX       = window.innerWidth / 2;
      const centroY       = window.innerHeight / 2;
      const sobreOFosforo = Math.abs(posicao.x - centroX) < 150 && Math.abs(posicao.y - centroY) < 250;

      if (sobreOFosforo && velocidade > VELOCIDADE_MINIMA) {
        if (!emRiscando) {
          emRiscando = true;
          contadorRiscadas++;
          atualizarContador();
        }
        calor += velocidade;
        criarFaisca(velocidade);

        if (tempoAtual - ultimoSomRiscado > 80) {
          tocarSomRiscado(velocidade);
          ultimoSomRiscado = tempoAtual;
        }

        const tremidaX = (Math.random() - 0.5) * Math.min(velocidade * 2, 10);
        fosforo.style.transform = `translateX(${tremidaX}px) rotate(${tremidaX / 2}deg)`;

        if (calor > CALOR_IGNICAO) {
          acender();
        }
      } else {
        calor = Math.max(0, calor - 2);
        if (calor === 0) {
          emRiscando = false;
          fosforo.style.transform = `translate(0px) rotate(0deg)`;
        }
      }

      atualizarBarraCalor();
    }
  }

  ultimoX     = posicao.x;
  ultimoY     = posicao.y;
  ultimoTempo = tempoAtual;
}

function acender() {
  estaAceso  = true;
  emRiscando = false;
  clearTimeout(timeoutApagando);
  document.body.classList.remove('extinguished');
  document.body.classList.remove('apagando');
  document.body.classList.add('lit');
  fosforo.style.transform    = `translate(0px) rotate(0deg)`;
  instrucao.innerText        = "Clique para apagar";
  progressoCalor.style.width = '0%';
  barraCalor.classList.remove('visivel');
  atualizarContador();
  iniciarBrasas();

  tocarSomIgnicao();

  setTimeout(() => {
    instrucao.style.opacity = '0.5';
  }, 2000);
}

document.addEventListener('mousemove', tratarMovimento);
document.addEventListener('touchmove', tratarMovimento, { passive: false });

document.body.addEventListener('click', () => {
  iniciarAudio();

  if (estaAceso) {
    estaAceso = false;
    calor     = 0;

    instrucao.style.opacity = '1';
    instrucao.innerText     = "Arraste rápido para riscar";

    pararSomFogo();
    pararBrasas();
    document.body.classList.add('apagando');

    timeoutApagando = setTimeout(() => {
      document.body.classList.remove('lit');
      document.body.classList.remove('apagando');
      document.body.classList.add('extinguished');
      tocarSomSilvo();
      marcarFosforoQueimado();

      clearTimeout(timeoutReset);
      timeoutReset = setTimeout(() => {
        if (document.body.classList.contains('extinguished')) {
          document.body.classList.remove('extinguished');
        }
      }, 4000);
    }, 600);
  }
});
