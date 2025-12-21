/* ================== CART STORAGE ================== */
const STORAGE_KEY = "n1vaxsquad_cart_v1";

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

function updateCartCount() {
  const span = document.getElementById("cart-count");
  if (span) span.textContent = loadCart().length;
}

/* ================== CART ACTIONS ================== */
function addToCart(id) {
  const cart = loadCart();
  cart.push(id);
  saveCart(cart);
  updateCartCount();
  alert("Товар добавлен в корзину");
}

function removeFromCart(id) {
  const cart = loadCart();
  const index = cart.indexOf(id);
  if (index !== -1) cart.splice(index, 1);
  saveCart(cart);
  updateCartCount();
  renderCartPage();
}

/* ================== PRODUCT CARD ================== */
function createProductCardHTML(p, open = false) {
  return `
    <div class="product-card">
      <div class="product-image">
        <img src="${p.imageUrl}">
      </div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="product-bottom">
          <div class="price">${p.price} ₴</div>
          ${
            open
              ? `<a class="btn btn-open" href="product.html?id=${p.id}">Открыть</a>`
              : `<button class="btn btn-add" onclick="addToCart(${p.id})">В корзину</button>`
          }
        </div>
      </div>
    </div>
  `;
}

/* ================== MAIN PAGE ================== */
function renderPopular() {
  const root = document.getElementById("popular-products");
  if (!root) return;

  root.innerHTML = "";
  products.slice(0, 4).forEach(p => {
    root.insertAdjacentHTML("beforeend", createProductCardHTML(p));
  });
}

/* ================== CATALOG ================== */
function renderCatalog() {
  const root = document.getElementById("catalog-grid");
  if (!root) return;

  root.innerHTML = "";
  products.forEach(p => {
    root.insertAdjacentHTML("beforeend", createProductCardHTML(p, true));
  });
}

/* ================== PRODUCT PAGE ================== */
function renderProductPage() {
  const box = document.getElementById("product-page-box");
  if (!box) return;

  const id = Number(new URLSearchParams(location.search).get("id"));
  const p = products.find(x => x.id === id);

  if (!p) {
    box.innerHTML = "<p>Товар не найден</p>";
    return;
  }

  box.innerHTML = `
    <div class="product-page">
      <div class="product-image large">
        <img src="${p.imageUrl}">
      </div>
      <h2>${p.name}</h2>
      <p class="desc">${p.desc}</p>
      <div class="product-bottom">
        <div class="price">${p.price} ₴</div>
        <button class="btn btn-add" onclick="addToCart(${p.id})">Добавить в корзину</button>
      </div>
    </div>
  `;
}

/* ================== CART PAGE ================== */
function renderCartPage() {
  const root = document.getElementById("cart-items");
  if (!root) return;

  const cart = loadCart();
  if (!cart.length) {
    root.innerHTML = "<p>Корзина пуста</p>";
    return;
  }

  root.innerHTML = "";
  let total = 0;

  cart.forEach(id => {
    const p = products.find(x => x.id === id);
    if (!p) return;

    total += p.price;

    root.insertAdjacentHTML("beforeend", `
      <div class="cart-row">
        <img class="cart-image" src="${p.imageUrl}">
        <div class="cart-info">
          <div class="cart-title">${p.name}</div>
          <div class="cart-price">${p.price} ₴</div>
        </div>
        <button class="btn btn-remove" onclick="removeFromCart(${p.id})">✕</button>
      </div>
    `);
  });

  root.insertAdjacentHTML("beforeend", `
    <div class="cart-summary">Итого: ${total} ₴</div>
  `);
}

/* ================== CHECKOUT ================== */
function renderCheckout() {
  const totalBox = document.getElementById("checkout-total");
  const form = document.getElementById("checkout-form");
  if (!totalBox || !form) return;

  const cart = loadCart();
  let total = 0;

  cart.forEach(id => {
    const p = products.find(x => x.id === id);
    if (p) total += p.price;
  });

  totalBox.textContent = `К оплате: ${total} ₴`;

  form.addEventListener("submit", e => {
    e.preventDefault();
    alert("Заказ успешно оформлен!");
    localStorage.removeItem(STORAGE_KEY);
    location.href = "index.html";
  });
}

/* ================== INIT ================== */
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderPopular();
  renderCatalog();
  renderProductPage();
  renderCartPage();
  renderCheckout();
});
