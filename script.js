/* ====== Корзина ====== */

const STORAGE_KEY = "n1vaxsquad_cart_v1";

function loadCart() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

function updateCartCount() {
  const span = document.getElementById("cart-count");
  if (!span) return;
  span.textContent = loadCart().length;
}

/* Добавить */
function addToCart(id) {
  const cart = loadCart();
  cart.push(id);
  saveCart(cart);
  updateCartCount();
  alert("Товар добавлен в корзину!");
}

/* Удалить */
function removeFromCart(id) {
  const cart = loadCart();
  const idx = cart.indexOf(id);
  if (idx !== -1) cart.splice(idx, 1);
  saveCart(cart);
  updateCartCount();
  renderCartPage();
}

/* ====== HTML карточки ====== */

function createProductCardHTML(p, open = false) {
  return `
    <div class="product-card">
      <div class="product-image">
        <img src="${p.imageUrl}" style="width:100%;height:100%;object-fit:cover;border-radius:6px;">
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

/* ====== Рендер главной ====== */
function renderPopular() {
  const root = document.getElementById("popular-products");
  if (!root) return;

  root.innerHTML = "";
  products.slice(0, 4).forEach(p => {
    root.insertAdjacentHTML("beforeend", createProductCardHTML(p));
  });
}

/* ====== Рендер каталога ====== */
function renderCatalog() {
  const root = document.getElementById("catalog-grid");
  if (!root) return;

  root.innerHTML = "";
  products.forEach(p => {
    root.insertAdjacentHTML("beforeend", createProductCardHTML(p, true));
  });
}

/* ====== Рендер товара ====== */
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
      <div class="product-image" style="height:300px;">
        <img src="${p.imageUrl}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">
      </div>
      <h2 style="margin-top:14px;">${p.name}</h2>
      <p style="color:#9fb8d6;margin-top:8px;">${p.desc}</p>
      <div style="display:flex;align-items:center;gap:12px;margin-top:16px;">
        <div class="price">${p.price} ₴</div>
        <button class="btn btn-add" onclick="addToCart(${p.id})">Добавить в корзину</button>
      </div>
    </div>
  `;
}

/* ====== Рендер корзины ====== */
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
        <img src="${p.imageUrl}" style="width:120px;height:80px;object-fit:cover;border-radius:6px;">
        <div style="flex:1;padding-left:10px;">
          <div style="font-weight:700;">${p.name}</div>
          <div style="color:#9fb8d6;">${p.desc}</div>
        </div>
        <div>
          <div style="font-weight:700;">${p.price} ₴</div>
          <button class="btn btn-remove" style="margin-top:6px;" onclick="removeFromCart(${p.id})">Убрать</button>
        </div>
      </div>
    `);
  });

  root.insertAdjacentHTML("beforeend", `
    <div class="cart-summary">Всего: ${total} ₴</div>
  `);
}

/* ====== Инициализация ====== */
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderPopular();
  renderCatalog();
  renderProductPage();
  renderCartPage();
});
