/* Универсальная логика: корзина (localStorage), рендер страниц, кнопки
   Подключай этот script.js на всех страницах после products.js
*/

const STORAGE_KEY = "n1vaxsquad_cart_v1";

function loadCart() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
  catch { return []; }
}
function saveCart(cart) { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); }

function updateCartCount() {
  const span = document.getElementById("cart-count");
  if (!span) return;
  const cart = loadCart();
  span.textContent = cart.length;
}

/* Добавление товара в корзину */
function addToCart(id) {
  const cart = loadCart();
  cart.push(Number(id));
  saveCart(cart);
  updateCartCount();
  alert("Товар добавлен в корзину");
}

/* Удаление товара (первое вхождение) */
function removeFromCart(id) {
  const cart = loadCart();
  const idx = cart.indexOf(Number(id));
  if (idx === -1) return;
  cart.splice(idx, 1);
  saveCart(cart);
  updateCartCount();
  renderCartPage(); // если мы на странице корзины — обновим отображение
}

/* ====== Рендер — главная (популярные) ====== */
function renderPopular(containerId = "popular-products") {
  const root = document.getElementById(containerId);
  if (!root) return;
  root.innerHTML = "";
  const popular = products.slice(0, 4);
  popular.forEach(p => {
    root.insertAdjacentHTML("beforeend", createProductCardHTML(p, false));
  });
}

/* ====== Рендер — каталог ====== */
function renderCatalog(containerId = "catalog-grid") {
  const root = document.getElementById(containerId);
  if (!root) return;
  root.innerHTML = "";
  products.forEach(p => {
    root.insertAdjacentHTML("beforeend", createProductCardHTML(p, true));
  });
}

/* ====== Рендер — карточка товара (product.html) ====== */
function renderProductPage(containerId = "product-page-box") {
  const box = document.getElementById(containerId);
  if (!box) return;
  const params = new URLSearchParams(location.search);
  const id = Number(params.get("id"));
  const p = products.find(x => x.id === id);
  if (!p) { box.innerHTML = "<p>Товар не найден.</p>"; return; }
  box.innerHTML = `
    <div class="product-page">
      <div class="product-image" style="height:300px;">
        ${p.imageUrl ? `<img src="${p.imageUrl}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">` : "Фото товара"}
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

/* ====== Рендер — корзина ====== */
function renderCartPage(containerId = "cart-items") {
  const root = document.getElementById(containerId);
  if (!root) return;
  const cart = loadCart();
  if (cart.length === 0) { root.innerHTML = "<p>Корзина пуста</p>"; return; }

  root.innerHTML = "";
  let total = 0;
  cart.forEach((id, idx) => {
    const p = products.find(x => x.id === id);
    if (!p) return;
    total += p.price;
    root.insertAdjacentHTML("beforeend", `
      <div class="cart-row">
        <div class="product-image" style="width:140px;height:80px;">${p.imageUrl ? `<img src="${p.imageUrl}" style="width:100%;height:100%;object-fit:cover;border-radius:6px;">` : "Фото"}</div>
        <div>
          <div style="font-weight:800;">${p.name}</div>
          <div style="color:#9fb8d6;">${p.desc}</div>
        </div>
        <div class="cart-right">
          <div style="font-weight:800;">${p.price} ₴</div>
          <div style="margin-top:8px;">
            <button class="btn btn-remove" onclick="removeFromCart(${p.id})">Убрать</button>
          </div>
        </div>
      </div>
    `);
  });

  root.insertAdjacentHTML("beforeend", `<div class="cart-summary">Всего: ${total} ₴</div>`);
}

/* ====== Вспомогательная функция: HTML карточки товара ====== */
function createProductCardHTML(p, withOpenLink = false) {
  return `
    <div class="product-card">
      <div class="product-image">
        ${p.imageUrl ? `<img src="${p.imageUrl}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;border-radius:6px;">` : "Фото товара"}
      </div>
      <div class="product-info" style="flex:1;">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="product-bottom">
          <div class="price">${p.price} ₴</div>
          <div>
            ${withOpenLink ? `<a class="btn btn-open" href="product.html?id=${p.id}">Открыть</a>` : `<button class="btn btn-add" onclick="addToCart(${p.id})">В корзину</button>`}
          </div>
        </div>
      </div>
    </div>
  `;
}

/* ====== Инициализация при загрузке страницы ====== */
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  // Если на главной
  if (document.getElementById("popular-products")) renderPopular("popular-products");
  // Если на каталоге
  if (document.getElementById("catalog-grid")) renderCatalog("catalog-grid");
  // Если на странице товара
  if (document.getElementById("product-page-box")) renderProductPage("product-page-box");
  // Если на странице корзины
  if (document.getElementById("cart-items")) renderCartPage("cart-items");
});
