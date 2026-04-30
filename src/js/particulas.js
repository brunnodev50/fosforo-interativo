let ultimaFaisca    = 0;
let intervaloBrasas = null;

function criarFaisca(velocidade) {
  const agora = Date.now();
  if (agora - ultimaFaisca < 45) return;
  ultimaFaisca = agora;

  const rect       = cabecaFosforo.getBoundingClientRect();
  const origemX    = rect.left + rect.width / 2;
  const origemY    = rect.top + rect.height / 2;
  const quantidade = Math.min(Math.floor(velocidade * 1.2), 6);
  const cores      = ['#ffcc00', '#ff9900', '#ff6600', '#ffe066', '#ffffff'];

  for (let i = 0; i < quantidade; i++) {
    const faisca = document.createElement('div');
    faisca.classList.add('faisca');

    const angulo    = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.2;
    const distancia = 12 + Math.random() * 38;
    const dx        = Math.cos(angulo) * distancia;
    const dy        = Math.sin(angulo) * distancia;
    const tamanho   = 1.5 + Math.random() * 2;
    const cor       = cores[Math.floor(Math.random() * cores.length)];

    faisca.style.cssText = `left:${origemX}px;top:${origemY}px;width:${tamanho}px;height:${tamanho}px;background:${cor};box-shadow:0 0 3px ${cor};`;
    faisca.style.setProperty('--dx', dx + 'px');
    faisca.style.setProperty('--dy', dy + 'px');

    document.body.appendChild(faisca);
    setTimeout(() => faisca.remove(), 420);
  }
}

function criarBrasa() {
  if (!estaAceso) return;
  if (document.querySelectorAll('.brasa').length > 18) return;

  const chama = document.querySelector('.flame');
  const rect  = chama.getBoundingClientRect();
  if (rect.width === 0) return;

  const brasa   = document.createElement('div');
  brasa.classList.add('brasa');

  const origemX = rect.left + rect.width / 2 + (Math.random() - 0.5) * 18;
  const origemY = rect.top  + rect.height * 0.2;
  const bx      = (Math.random() - 0.5) * 55;
  const by      = -(45 + Math.random() * 75);
  const tamanho = 1.5 + Math.random() * 2.5;
  const duracao = 1200 + Math.random() * 1400;
  const cores   = ['#ffcc44', '#ff9900', '#ff6600', '#ffee88', '#ffbb22'];
  const cor     = cores[Math.floor(Math.random() * cores.length)];

  brasa.style.cssText = `left:${origemX}px;top:${origemY}px;width:${tamanho}px;height:${tamanho}px;background:${cor};box-shadow:0 0 ${tamanho * 2}px ${cor};`;
  brasa.style.setProperty('--bx',  bx  + 'px');
  brasa.style.setProperty('--by',  by  + 'px');
  brasa.style.setProperty('--dur', duracao + 'ms');

  document.body.appendChild(brasa);
  setTimeout(() => brasa.remove(), duracao + 50);
}

function iniciarBrasas() {
  if (intervaloBrasas) return;
  intervaloBrasas = setInterval(() => {
    criarBrasa();
    if (Math.random() > 0.55) criarBrasa();
  }, 220);
}

function pararBrasas() {
  clearInterval(intervaloBrasas);
  intervaloBrasas = null;
}
