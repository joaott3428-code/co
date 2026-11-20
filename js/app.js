(() => {
  'use strict';

  // API pública, sem chave, CORS liberado
  const API_URL = 'https://open.er-api.com/v6/latest/USD';

  // Moedas exibidas no grid (código, nome, símbolo)
  const CURRENCIES = {
    USD: { name: 'Dólar Americano', symbol: '$' },
    EUR: { name: 'Euro', symbol: '€' },
    GBP: { name: 'Libra Esterlina', symbol: '£' },
    JPY: { name: 'Iene Japonês', symbol: '¥' },
    BRL: { name: 'Real Brasileiro', symbol: 'R$' },
    CHF: { name: 'Franco Suíço', symbol: 'Fr' },
    CAD: { name: 'Dólar Canadense', symbol: 'C$' },
    AUD: { name: 'Dólar Australiano', symbol: 'A$' },
    CNY: { name: 'Yuan Chinês', symbol: '¥' },
    INR: { name: 'Rupia Indiana', symbol: '₹' },
    MXN: { name: 'Peso Mexicano', symbol: '$' },
    ARS: { name: 'Peso Argentino', symbol: '$' },
  };

  const grid = document.getElementById('rates-grid');
  const refreshBtn = document.getElementById('refresh-btn');
  const amountInput = document.getElementById('amount-input');
  const fromSelect = document.getElementById('from-currency');
  const toSelect = document.getElementById('to-currency');
  const swapBtn = document.getElementById('swap-btn');
  const resultValue = document.getElementById('result-value');
  const resultCode = document.getElementById('result-code');
  const rateDisplay = document.getElementById('rate-display');
  const timestamp = document.getElementById('timestamp');

  let rates = {};
  let lastUpdated = null;

  const fmt = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });

  const fmtRate = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  });

  function populateSelects() {
    const codes = Object.keys(CURRENCIES);
    for (const code of codes) {
      const opt1 = document.createElement('option');
      opt1.value = code;
      opt1.textContent = `${code} — ${CURRENCIES[code].name}`;
      fromSelect.appendChild(opt1);

      const opt2 = document.createElement('option');
      opt2.value = code;
      opt2.textContent = `${code} — ${CURRENCIES[code].name}`;
      toSelect.appendChild(opt2);
    }
    fromSelect.value = 'USD';
    toSelect.value = 'BRL';
  }

  function renderGrid() {
    grid.innerHTML = '';
    for (const [code, info] of Object.entries(CURRENCIES)) {
      if (code === 'USD') continue;
      const rate = rates[code];
      if (rate === undefined) continue;

      const card = document.createElement('div');
      card.className = 'rate-card';
      card.innerHTML = `
        <div class="code">${info.name} (${code})</div>
        <div class="rate">${fmtRate.format(rate)}</div>
        <div class="change up">1 USD = ${fmtRate.format(rate)} ${code}</div>
      `;
      grid.appendChild(card);
    }
  }

  function convert() {
    const amount = parseFloat(amountInput.value) || 0;
    const from = fromSelect.value;
    const to = toSelect.value;

    if (from === 'USD') {
      var result = amount * (rates[to] || 0);
    } else if (to === 'USD') {
      var result = amount / (rates[from] || 1);
    } else {
      const usdAmount = amount / (rates[from] || 1);
      var result = usdAmount * (rates[to] || 0);
    }

    resultValue.textContent = fmtRate.format(result);
    resultCode.textContent = to;

    const perUnit = (rates[to] || 0) / (rates[from] || 1);
    rateDisplay.textContent = `1 ${from} = ${fmtRate.format(perUnit)} ${to}`;
  }

  function updateTimestamp(timeStr) {
    try {
      const date = new Date(timeStr);
      if (isNaN(date)) return;
      const rel = Math.round((Date.now() - date.getTime()) / 60000);
      if (rel < 1) {
        timestamp.textContent = 'Taxas atualizadas agora mesmo';
      } else if (rel < 60) {
        timestamp.textContent = `Taxas atualizadas há ${rel} min`;
      } else {
        timestamp.textContent = `Taxas atualizadas há ${Math.round(rel / 60)} h`;
      }
    } catch {
      timestamp.textContent = '';
    }
  }

  async function loadRates() {
    grid.innerHTML = '<div class="loading">Carregando taxas…</div>';
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      if (data.result !== 'success') throw new Error(data['error-type'] || 'Erro na API');
      rates = data.rates;
      lastUpdated = data.time_last_update_utc;
      renderGrid();
      updateTimestamp(lastUpdated);
      convert();
    } catch (err) {
      grid.innerHTML = `<div class="error">Erro ao carregar taxas: ${err.message}</div>`;
    }
  }

  populateSelects();
  loadRates();

  refreshBtn.addEventListener('click', loadRates);
  amountInput.addEventListener('input', convert);
  fromSelect.addEventListener('change', convert);
  toSelect.addEventListener('change', convert);

  swapBtn.addEventListener('click', () => {
    const f = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = f;
    convert();
  });

  // Atualiza a cada 60s
  setInterval(loadRates, 60000);
})();