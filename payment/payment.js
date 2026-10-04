const TAX_RATE = 0.08;

const METHODS = {
  card: { name: 'Card', pay: 'by card' },
  crypto: { name: 'Crypto', pay: 'with crypto' },
  gpay: { name: 'Google Pay', pay: 'with Google Pay' },
};

const COINS = {
  BTC: 'Bitcoin (BTC)',
  ETH: 'Ethereum (ETH)',
  USDT: 'Tether (USDT)',
};

function readStore(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch (error) {
    return fallback;
  }
}

function writeStore(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
  }
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[ch]));
}

function formatPrice(value) {
  return '$' + Number(value).toFixed(2);
}

const methodTabs = document.getElementById('method-tabs');
const panels = document.querySelectorAll('[data-panel]');
const formEl = document.getElementById('payment-form');
const submitBtn = document.getElementById('submit-btn');
const emailEl = document.getElementById('pay-email');
const coinEl = document.getElementById('coin');
const coinNote = document.getElementById('coin-note');
const receiptEl = document.getElementById('receipt');
const successEl = document.getElementById('success');

const user = readStore('md_user', null);

const lines = readStore('md_cart', []);
const subtotal = lines.reduce((sum, line) => sum + line.price * line.qty, 0);
const tax = subtotal * TAX_RATE;
const total = subtotal + tax;

let orderNumber = readStore('md_order', null);
if (!orderNumber) {
  orderNumber = 'MD' + Math.random().toString(36).slice(2, 8).toUpperCase();
  writeStore('md_order', orderNumber);
}

let method = 'card';

function paymentName() {
  return method === 'crypto' ? `Crypto (${coinEl.value})` : METHODS[method].name;
}

function renderReceipt() {
  const profileName = user ? [user.name, user.surname].filter(Boolean).join(' ') : 'Guest';
  const email = emailEl.value.trim() || (user && user.email) || '—';

  const itemsHtml = lines.length
    ? lines.map((line, index) => `
        <div class="receipt__row receipt__item">
          <span>${index + 1}. ${escapeHtml(line.name)}${line.qty > 1 ? ' ×' + line.qty : ''}</span>
          <span>${formatPrice(line.price * line.qty)}</span>
        </div>`).join('')
    : '<p>Your cart is empty.</p>';

  receiptEl.innerHTML = `
    <div class="receipt__brand"><strong>MINEDROP</strong><span>Merch Store</span></div>
    <hr>
    <div class="receipt__row"><span>Time</span><span id="clock"></span></div>
    <div class="receipt__row"><span>Order number</span><span>${orderNumber}</span></div>
    <div class="receipt__row"><span>Profile name</span><span>${escapeHtml(profileName)}</span></div>
    <div class="receipt__row"><span>Email</span><span>${escapeHtml(email)}</span></div>
    <div class="receipt__row"><span>Payment</span><span>${paymentName()}</span></div>
    <hr>
    ${itemsHtml}
    <hr>
    <div class="receipt__row"><span>Tax (${Math.round(TAX_RATE * 100)}%)</span><span>${formatPrice(tax)}</span></div>
    <div class="receipt__row receipt__total"><span>Total</span><span>${formatPrice(total)}</span></div>`;

  updateClock();
}

function updateClock() {
  const clock = document.getElementById('clock');
  if (clock) clock.textContent = new Date().toLocaleTimeString('en-GB');
}
setInterval(updateClock, 1000);

function updateForm() {
  methodTabs.querySelectorAll('[data-method]').forEach((tab) => {
    tab.setAttribute('aria-pressed', tab.dataset.method === method);
  });

  panels.forEach((panel) => {
    const isActive = panel.dataset.panel === method;
    panel.hidden = !isActive;
    panel.querySelectorAll('input, select').forEach((field) => { field.disabled = !isActive; });
  });

  coinNote.textContent = `You are paying with ${COINS[coinEl.value]}.`;

  submitBtn.disabled = lines.length === 0;
  submitBtn.textContent = lines.length
    ? `Pay ${formatPrice(total)} ${METHODS[method].pay}`
    : 'Your cart is empty';

  renderReceipt();
}

methodTabs.addEventListener('click', (event) => {
  const tab = event.target.closest('[data-method]');
  if (!tab) return;
  method = tab.dataset.method;
  updateForm();
});

coinEl.innerHTML = Object.entries(COINS)
  .map(([symbol, label]) => `<option value="${symbol}">${label}</option>`)
  .join('');
coinEl.addEventListener('change', updateForm);

emailEl.addEventListener('input', renderReceipt);

document.getElementById('card-number').addEventListener('input', (event) => {
  const digits = event.target.value.replace(/\D/g, '').slice(0, 16);
  event.target.value = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
});

document.getElementById('card-exp').addEventListener('input', (event) => {
  const digits = event.target.value.replace(/\D/g, '').slice(0, 4);
  event.target.value = digits.length > 2 ? `${digits.slice(0, 2)} / ${digits.slice(2)}` : digits;
});

formEl.addEventListener('submit', (event) => {
  event.preventDefault();
  if (lines.length === 0) return;

  writeStore('md_cart', []);
  writeStore('md_order', null);

  formEl.hidden = true;
  methodTabs.hidden = true;
  successEl.hidden = false;
  successEl.innerHTML = `
    <strong>Thank you for your order!</strong><br>
    Order ${orderNumber} is confirmed. This is a demo store, so no payment was made.`;
});

if (user && user.email) emailEl.value = user.email;
updateForm();
