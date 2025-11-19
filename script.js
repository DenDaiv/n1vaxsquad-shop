function loadCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
  const span = document.getElementById("cart-count");
  if (span) span.textContent = loadCart().length;
}

function addToCart(id) {
  const cart = loadCart();
  cart.push(id);
  saveCart(cart);
  updateCartCount();
  alert("Товар добавлен в корзину");
}

function createProductCard(p, link = false, big = false) {
  const sizeClass = big ? " big" : "";
  return `
    <div class="product-card${sizeClass}">
      <div class="product-image${sizeClass}">${p.imageText}</div>
      <h3>${p.name}</h3>
      <p class="product-desc">${p.desc}</p>
      <div class="product-bottom">
        <span class="price">${p.price} ₴</span>
        ${link 
            ? `<a class="btn-add" href="product.html?id=${p.id}">Открыть</a>`
            : `<button class="btn-add" data-id="${p.id}">В корзину</button>`}
      </div>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();

  // Главная — популярные
  const pop = document.getElementById("popular-products");
  if (pop) products.slice(0,4).forEach(p => pop.innerHTML += createProductCard(p));

  // Каталог
  const cat = document.getElementById("catalog-grid");
  if (cat) products.forEach(p => cat.innerHTML += createProductCard(p, true));

  // Страница товара
  const box = document.getElementById("product-page-box");
  if (box) {
    const id = Number(new URLSearchParams(location.search).get("id"));
    const p = products.find(x => x.id === id);
    box.innerHTML = p ? createProductCard(p, false, true) : "<p>Товар не найден.</p>";
  }

  // Корзина
  const cartBox = document.getElementById("cart-items");
  if (cartBox) {
    const cart = loadCart();
    if (cart.length === 0) {
      cartBox.innerHTML = "<p>Корзина пуста</p>";
    } else {
      let total = 0;
      cart.forEach(id => {
        const p = products.find(x => x.id === id);
        if (!p) return;
        total += p.price;
        cartBox.innerHTML += createProductCard(p, false);
      });

      cartBox.innerHTML += `<div class="cart-summary">Всего: ${total} ₴</div>`;
    }
  }

  // Кнопки "В корзину"
  document.querySelectorAll("[data-id]").forEach(btn => {
    btn.onclick = () => addToCart(Number(btn.dataset.id));
  });
});
