// Генерация товаров
const productList = document.getElementById("product-list");

products.forEach(item => {
    const card = document.createElement("div");
    card.classList.add("product-card");
    card.innerHTML = `
        <img src="${item.img}" alt="">
        <h3>${item.name}</h3>
        <p>Цена: ${item.price}$</p>
        <button onclick="addToCart(${item.id})">Добавить в корзину</button>
    `;
    productList.appendChild(card);
});

// Корзина
let cart = [];

function addToCart(id) {
    const product = products.find(p => p.id === id);
    cart.push(product);
    updateCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function updateCart() {
    const cartBox = document.getElementById("cart-items");
    cartBox.innerHTML = "";

    cart.forEach((item, i) => {
        const div = document.createElement("div");
        div.classList.add("cart-item");
        div.innerHTML = `
            <h3>${item.name}</h3>
            <p>Цена: ${item.price}$</p>
            <button onclick="removeFromCart(${i})">Удалить</button>
        `;
        cartBox.appendChild(div);
    });
}

document.getElementById("clear-cart").onclick = () => {
    cart = [];
    updateCart();
};
