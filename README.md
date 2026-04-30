# 🔥 Fósforo Interativo

Simulação interativa de um fósforo no browser. Risque, acenda e apague — com física de chama, faíscas, brasas e áudio procedural gerado em tempo real.

---

## Demo

> Abra o `index.html` no browser e arraste o mouse sobre o fósforo.

---

## Como usar

1. **Arraste** o mouse rapidamente sobre o fósforo para riscar
2. Quanto mais rápido riscar, mais calor acumula (barra de calor visível na base)
3. Ao atingir a temperatura de ignição, o fósforo **acende automaticamente**
4. **Clique** em qualquer lugar para apagar
5. Você tem **5 fósforos** — acompanhe o estoque no canto inferior esquerdo

---

## Funcionalidades

- **Chama realista** com três camadas (zona azul, cone branco e envelope laranja)
- **Faíscas** ao riscar, proporcionais à velocidade do movimento
- **Brasas** subindo da chama enquanto ela queima
- **Barra de calor** indicando o progresso até a ignição
- **Som procedural** via Web Audio API — o som de riscada fica mais grave conforme aquece
- **Som de ignição** e **silvo de fumaça** ao apagar
- **Sombra projetada** que muda com a chama acesa
- **Fumaça animada** ao apagar
- **Caixa com 5 fósforos** — cada um queima e escurece individualmente
- **Contador de riscadas** por fósforo
- Suporte a **toque (mobile)**

---

## Tecnologias

| Tecnologia | Uso |
|---|---|
| HTML5 | Estrutura |
| CSS3 | Animações, pseudo-elementos, custom properties |
| JavaScript (ES6+) | Lógica de interação e física |
| Web Audio API | Som procedural em tempo real |

---

## Estrutura de pastas

```
fosforo-interativo/
├── index.html
├── src/
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── audio.js       — Web Audio API (sons de riscada, ignição e silvo)
│       ├── particulas.js  — Faíscas e brasas
│       └── main.js        — Estado, lógica e event listeners
└── assets/
    └── sounds/
```

---

## Rodando localmente

Sem dependências. Apenas abra o arquivo:

```bash
# Com Live Server (VS Code) ou qualquer servidor local
# Ou simplesmente abra o index.html no browser
```

> Em alguns browsers, o Web Audio API requer interação do usuário antes de iniciar — por isso o som começa no primeiro toque ou clique.
