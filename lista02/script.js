const products = [
  { id: 1, name: "Camisa Flamengo I 25/26 s/n Torcedor Adidas Masculina", price: 299.90, image: 'flamengo.jpg' },
  { id: 2, name: "Camisa Borussia Dortmund Blackout 23/24 Jogador Preto", price: 259.90, image: 'bvb.jpg' },
  { id: 3, name: "Camisa de Goleiro Nike Brasil 2022/23 Torcedor Pro Masculina - Preto", price: 359.90, image: 'selecaoBR.jpg' },
  { id: 4, name: "Camisa Real Madrid I 24/25 s/n Torcedor Adidas Masculina", price: 259.90, image: 'realmadrid.jpg' },
  { id: 5, name: "Camisa PSG x Jordan III 23/24 Torcedor Masculina Preta", price: 359.90, image: 'psg.jpg' },
  { id: 6, name: "Camisa Inter de Milão Home 2024/25 - Azul", price: 359.90, image: 'inter.jpg' },
];

let cart = [];

function formatCurrency(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function renderProducts() {
  const list = document.getElementById("product-list");
  list.innerHTML = "";

  products.forEach(product => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${formatCurrency(product.price)}</p>
      <div class="size-buttons" id="size-buttons-${product.id}">
        ${['P', 'M', 'G'].map(size => `
          <button class="size-button" onclick="selectSize(${product.id}, '${size}', this)">${size}</button>
        `).join('')}
      </div>
      <button onclick="addToCart(${product.id})">Adicionar ao carrinho</button>
    `;
    list.appendChild(div);
  });
}

const selectedSizes = {};

function selectSize(productId, size, button) {
  selectedSizes[productId] = size;

  // remover "active" de todos os botões
  document.querySelectorAll(`#size-buttons-${productId} .size-button`).forEach(btn => {
    btn.classList.remove("active");
  });

  // adicionar "active" no clicado
  button.classList.add("active");
}

function addToCart(id) {
  const size = selectedSizes[id];
  if (!size) {
    alert("Selecione um tamanho antes de adicionar ao carrinho.");
    return;
  }

  const product = products.find(p => p.id === id);
  const key = `${id}-${size}`;

  const existingItem = cart.find(item => item.key === key);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ ...product, key, size, quantity: 1 });
  }

  renderCart();
}

function removeItem(key) {
  cart = cart.filter(item => item.key !== key);
  renderCart();
}

function updateQuantity(key, delta) {
  const item = cart.find(i => i.key === key);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    removeItem(key);
  } else {
    renderCart();
  }
}

function clearCart() {
  cart = [];
  renderCart();
}

function checkout() {
  if (cart.length === 0) {
    alert("O carrinho está vazio!");
    return;
  }

  alert("Compra finalizada com sucesso!");
  clearCart();
}

function toggleCart() {
  const cartPanel = document.getElementById("cart-panel");
  cartPanel.classList.toggle("hidden");
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("cart-count").textContent = count;
}

function renderCart() {
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;
    const li = document.createElement("li");
    li.className = "cart-item";
    li.innerHTML = `
      <div class="item-info">
        <img src="${item.image}" alt="${item.name}">
        <div>
          <span>${item.name}</span><br>
          <small>Tamanho: ${item.size}</small>
        </div>
      </div>
      <div class="item-actions">
        <span>${formatCurrency(item.price)}</span>
        <button onclick="updateQuantity('${item.key}', -1)">-</button>
        <span>${item.quantity}</span>
        <button onclick="updateQuantity('${item.key}', 1)">+</button>
        <button class="remove-btn" onclick="removeItem('${item.key}')">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
    cartItems.appendChild(li);
  });

  cartTotal.textContent = formatCurrency(total);
  updateCartCount();
}

renderProducts();
