# 💱 Cambio — Câmbio de Moedas Globais

Site simples e moderno para acompanhar a evolução das taxas de câmbio de várias moedas globais.

## Funcionalidades

- 📊 **Grid de taxas** — visualização rápida de cotações para moedas populares (EUR, GBP, JPY, BRL, CHF, CAD, etc.)
- 🔄 **Conversor de moedas** — converta entre quaisquer pares com taxas dinâmicas
- 🔄 **Botão de refresh** — atualiza as taxas manualmente
- ⏱️ **Auto-refresh** — taxas atualizadas automaticamente a cada 60 segundos

## Tecnologias

- HTML5, CSS3 (customizado, sem frameworks) e JavaScript puro
- Fontes: Inter (Google Fonts)
- API: [Open Exchange Rates API](https://open.er-api.com) (gratuita, sem chave)

## Como rodar

Basta abrir o `index.html` no navegador, ou usar um servidor estático:

```bash
# Opção 1: abrir direto
open index.html

# Opção 2: servidor simples
npx serve .
```

## Estrutura

```
currency-tracker/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
└── README.md
```

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
