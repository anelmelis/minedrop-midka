const PREORDERS = [
  { id: 'pre-jacket', name: 'Explorer Jacket', desc: 'Water-resistant jacket for rainy days.', price: 69, image: 'images/explr.jpg' },
  { id: 'pre-hoodie', name: 'Night Shift Hoodie', desc: 'Heavyweight hoodie with a soft lining.', price: 54, image: 'images/night.jpg' },
  { id: 'pre-pajamas', name: 'Camp Pajamas', desc: 'Cozy two-piece set for long nights.', price: 42, image: 'images/campPJ.jpg' },
];

const PREVIOUS = [
  { id: 'prev-spring', name: 'Spring Collection 2026', desc: 'Limited tees and caps from last season.', price: 29, image: 'images/spring.jpg' },
  { id: 'prev-winter', name: 'Winter Collection 2025', desc: 'Knit beanies and scarves from last winter.', price: 33, image: 'images/winter.jpg' },
];

const CART_KEY = 'md_cart';

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (error) {
    return [];
  }
}

function saveCart(lines) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(lines));
  } catch (error) {
  }
}

const Cart = {
  add(item) {
    const lines = loadCart();
    const line = lines.find((l) => l.id === item.id);
    if (line) line.qty += 1;
    else lines.push({ id: item.id, name: item.name, price: item.price, qty: 1 });
    saveCart(lines);
  },
  change(id, delta) {
    const lines = loadCart();
    const line = lines.find((l) => l.id === id);
    if (!line) return;
    line.qty += delta;
    saveCart(lines.filter((l) => l.qty > 0));
  },
  remove(id) {
    saveCart(loadCart().filter((l) => l.id !== id));
  },
  qty(id) {
    const line = loadCart().find((l) => l.id === id);
    return line ? line.qty : 0;
  },
  count() {
    return loadCart().reduce((sum, l) => sum + l.qty, 0);
  },
  total() {
    return loadCart().reduce((sum, l) => sum + l.price * l.qty, 0);
  },
};

function formatPrice(value) {
  return '$' + Number(value).toFixed(2);
}

function photoHtml(src, alt) {
  const img = src ? `<img src="${src}" alt="${alt}" loading="lazy">` : '';
  return `<div class="photo">${img}</div>`;
}

let toastTimer;
function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2200);
}

const trackEl = document.getElementById('preorder-track');
const previousEl = document.getElementById('previous-grid');
const cartListEl = document.getElementById('cart-list');
const cartCountEl = document.getElementById('cart-count');
const cartTotalEl = document.getElementById('cart-total');
const payLink = document.getElementById('pay-link');

let centerIndex = 0; // какая карточка сейчас в центре карусели

function preorderCard(product, isCenter) {
  const qty = Cart.qty(product.id);
  const badge = qty ? `<span class="card__badge">In cart: ${qty}</span>` : '';

  return `
    <article class="card ${isCenter ? '' : 'is-side'}">
      <div class="card__media">${photoHtml(product.image, product.name)}${badge}</div>
      <div class="card__body">
        <h3 class="card__name">${product.name}</h3>
        <p class="card__desc">${product.desc}</p>
        <p class="card__price">${formatPrice(product.price)}</p>
      </div>
      <div class="card__actions">
        <button class="btn btn--small" type="button" data-action="remove" data-id="${product.id}" ${qty ? '' : 'disabled'}>Remove</button>
        <button class="btn btn--small btn--primary" type="button" data-action="preorder" data-id="${product.id}">Pre-order</button>
      </div>
    </article>`;
}

function renderCarousel() {
  const n = PREORDERS.length;
  const indexes = [(centerIndex - 1 + n) % n, centerIndex, (centerIndex + 1) % n];
  trackEl.innerHTML = indexes
    .map((index, position) => preorderCard(PREORDERS[index], position === 1))
    .join('');
}

function renderPrevious() {
  previousEl.innerHTML = PREVIOUS.map((item) => `
    <article class="collection">
      <div class="collection__head">
        <div>
          <h3>${item.name}</h3>
          <p>${item.desc}</p>
        </div>
        <span class="collection__price">${formatPrice(item.price)}</span>
      </div>
      <div class="collection__body">
        ${photoHtml(item.image, item.name)}
        <button class="arrow" type="button" data-id="${item.id}" aria-label="Add ${item.name} to cart">→</button>
      </div>
    </article>`).join('');
}

function renderCart() {
  const lines = loadCart();

  cartListEl.innerHTML = lines.length
    ? lines.map((line) => `
        <li class="cart__item">
          <span class="cart__name">${line.name}</span>
          <span class="qty">
            <button class="qty__btn" type="button" data-cart="minus" data-id="${line.id}" aria-label="Decrease quantity of ${line.name}">−</button>
            <span>${line.qty}</span>
            <button class="qty__btn" type="button" data-cart="plus" data-id="${line.id}" aria-label="Increase quantity of ${line.name}">+</button>
          </span>
          <span class="cart__price">${formatPrice(line.price * line.qty)}</span>
          <button class="cart__remove" type="button" data-cart="remove" data-id="${line.id}" aria-label="Remove ${line.name} from cart">×</button>
        </li>`).join('')
    : '<li class="cart__empty">Your cart is empty.</li>';

  const count = Cart.count();
  cartCountEl.textContent = `${count} ${count === 1 ? 'item' : 'items'}`;
  cartTotalEl.textContent = formatPrice(Cart.total());

  payLink.classList.toggle('is-disabled', count === 0);
  payLink.setAttribute('aria-disabled', count === 0);
}

function refresh() {
  renderCarousel();
  renderCart();
}

document.getElementById('prev-btn').addEventListener('click', () => {
  centerIndex = (centerIndex - 1 + PREORDERS.length) % PREORDERS.length;
  renderCarousel();
});

document.getElementById('next-btn').addEventListener('click', () => {
  centerIndex = (centerIndex + 1) % PREORDERS.length;
  renderCarousel();
});

trackEl.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const id = button.dataset.id;

  if (button.dataset.action === 'preorder') {
    Cart.add(PREORDERS.find((p) => p.id === id));
    showToast('Added to cart');
  } else {
    Cart.remove(id);
    showToast('Removed from cart');
  }
  refresh();
});

previousEl.addEventListener('click', (event) => {
  const button = event.target.closest('[data-id]');
  if (!button) return;
  Cart.add(PREVIOUS.find((p) => p.id === button.dataset.id));
  showToast('Added to cart');
  renderCart();
});

cartListEl.addEventListener('click', (event) => {
  const button = event.target.closest('[data-cart]');
  if (!button) return;
  const id = button.dataset.id;

  if (button.dataset.cart === 'plus') Cart.change(id, 1);
  if (button.dataset.cart === 'minus') Cart.change(id, -1);
  if (button.dataset.cart === 'remove') Cart.remove(id);
  refresh();
});

payLink.addEventListener('click', (event) => {
  if (Cart.count() === 0) {
    event.preventDefault();
    showToast('Your cart is empty');
  }
});

renderCarousel();
renderPrevious();
renderCart();
