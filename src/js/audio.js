let ctxAudio;
let fonteRuidoFogo;
let ganhoFogo;

const audioIgnicao = new Audio('assets/sounds/salamisound-4119921-matchstick-burn-without.mp3');
audioIgnicao.preload = 'auto';

function iniciarAudio() {
  if (!ctxAudio) {
    ctxAudio = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (ctxAudio.state === 'suspended') {
    ctxAudio.resume();
  }
}

function tocarSomRiscado(intensidade) {
  iniciarAudio();
  if (!ctxAudio) return;

  const tamanhoBuffer = ctxAudio.sampleRate * 0.05;
  const buffer        = ctxAudio.createBuffer(1, tamanhoBuffer, ctxAudio.sampleRate);
  const dados         = buffer.getChannelData(0);
  for (let i = 0; i < tamanhoBuffer; i++) {
    dados[i] = Math.random() * 2 - 1;
  }

  const fonteRuido  = ctxAudio.createBufferSource();
  fonteRuido.buffer = buffer;

  const nivelCalor = Math.min(calor / CALOR_IGNICAO, 1);
  const filtro = ctxAudio.createBiquadFilter();
  filtro.type = 'bandpass';
  filtro.frequency.value = 1100 - (nivelCalor * 500) + (Math.min(intensidade, 5) * 200);

  const noGanho = ctxAudio.createGain();
  const volume  = 0.2 + nivelCalor * 0.25;
  noGanho.gain.setValueAtTime(volume, ctxAudio.currentTime);
  noGanho.gain.exponentialRampToValueAtTime(0.01, ctxAudio.currentTime + 0.04 + nivelCalor * 0.03);

  fonteRuido.connect(filtro);
  filtro.connect(noGanho);
  noGanho.connect(ctxAudio.destination);

  fonteRuido.start();
}

function tocarSomIgnicao() {
  iniciarAudio();
  if (!ctxAudio) return;

  // Toca o MP3 real de ignição
  audioIgnicao.currentTime = 0;
  audioIgnicao.volume      = 0.9;
  audioIgnicao.play().catch(() => {});

  // Som procedural de chama contínua (fallback / camada de fundo)
  const oscilador = ctxAudio.createOscillator();
  oscilador.type = 'sine';
  oscilador.frequency.setValueAtTime(150, ctxAudio.currentTime);
  oscilador.frequency.exponentialRampToValueAtTime(10, ctxAudio.currentTime + 0.5);

  const ganhoOscilador = ctxAudio.createGain();
  ganhoOscilador.gain.setValueAtTime(1, ctxAudio.currentTime);
  ganhoOscilador.gain.exponentialRampToValueAtTime(0.01, ctxAudio.currentTime + 0.5);

  oscilador.connect(ganhoOscilador);
  ganhoOscilador.connect(ctxAudio.destination);
  oscilador.start();
  oscilador.stop(ctxAudio.currentTime + 0.5);

  const tamanhoBuffer = ctxAudio.sampleRate * 2;
  const buffer        = ctxAudio.createBuffer(1, tamanhoBuffer, ctxAudio.sampleRate);
  const dados         = buffer.getChannelData(0);
  for (let i = 0; i < tamanhoBuffer; i++) {
    dados[i] = Math.random() * 2 - 1;
  }

  fonteRuidoFogo        = ctxAudio.createBufferSource();
  fonteRuidoFogo.buffer = buffer;
  fonteRuidoFogo.loop   = true;

  const filtro = ctxAudio.createBiquadFilter();
  filtro.type = 'lowpass';
  filtro.frequency.value = 300;

  ganhoFogo = ctxAudio.createGain();
  ganhoFogo.gain.setValueAtTime(0, ctxAudio.currentTime);
  ganhoFogo.gain.linearRampToValueAtTime(0.4, ctxAudio.currentTime + 1);

  fonteRuidoFogo.connect(filtro);
  filtro.connect(ganhoFogo);
  ganhoFogo.connect(ctxAudio.destination);

  fonteRuidoFogo.start();
}

function tocarSomSilvo() {
  iniciarAudio();
  if (!ctxAudio) return;

  const tamanhoBuffer = ctxAudio.sampleRate * 0.3;
  const buffer        = ctxAudio.createBuffer(1, tamanhoBuffer, ctxAudio.sampleRate);
  const dados         = buffer.getChannelData(0);
  for (let i = 0; i < tamanhoBuffer; i++) {
    dados[i] = Math.random() * 2 - 1;
  }

  const fonteRuido = ctxAudio.createBufferSource();
  fonteRuido.buffer = buffer;

  const filtro = ctxAudio.createBiquadFilter();
  filtro.type = 'highpass';
  filtro.frequency.value = 2000;

  const noGanho = ctxAudio.createGain();
  noGanho.gain.setValueAtTime(0.3, ctxAudio.currentTime);
  noGanho.gain.exponentialRampToValueAtTime(0.01, ctxAudio.currentTime + 0.3);

  fonteRuido.connect(filtro);
  filtro.connect(noGanho);
  noGanho.connect(ctxAudio.destination);

  fonteRuido.start();
}

function pararSomFogo() {
  audioIgnicao.pause();
  audioIgnicao.currentTime = 0;

  if (fonteRuidoFogo && ganhoFogo) {
    ganhoFogo.gain.linearRampToValueAtTime(0, ctxAudio.currentTime + 0.3);
    setTimeout(() => {
      if (fonteRuidoFogo) {
        try { fonteRuidoFogo.stop(); } catch (_) {}
        fonteRuidoFogo = null;
      }
    }, 300);
  }
}
