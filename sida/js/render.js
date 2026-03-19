import {
  $,
  formatPrice,
  getCartCount,
  getCartTotal,
  getCategories,
  getFilteredProducts,
} from "./shared.js";

export const ui = {
  categoryList: $("category-list"),
  productList: $("product-list"),
  cartItems: $("cart-items"),
  cartTotal: $("cart-total"),
  cartCount: $("cart-count"),
  clearCartBtn: $("clear-cart-btn"),
  checkoutLink: $("checkout-link"),
  cartToggle: $("cart-toggle"),
  cartDropdown: $("cart-dropdown"),
};

const categoryTemplate = (category, selectedCategory) => `
  <button
    class="category-btn ${selectedCategory === category ? "active" : ""}"
    data-category="${category}"
  >
    ${category}
  </button>
`;

const productTemplate = (product) => `
  <div class="product-card">
    <img
      src="${product.image}"
      alt="${product.name}"
      class="product-image"
    />
    <h3>${product.name}</h3>
    <div class="product-category">${(product.categories ?? []).join(", ")}</div>
    <p class="product-description">${product.description}</p>
    <div class="product-price">${formatPrice(product.price)}</div>
    <button data-add="${product.id}">Lägg i kundvagn</button>
  </div>
`;

const cartItemTemplate = (item) => `
  <div class="cart-item">
    <img
      src="${item.image}"
      alt="${item.name}"
      class="cart-item-image"
    />
    <div>
      <div class="cart-item-title">${item.name}</div>
      <div class="cart-item-meta">
        ${formatPrice(item.price)} x ${item.quantity}
      </div>
    </div>
    <div class="cart-item-actions">
      <button data-id="${item.id}" data-change="-1">-</button>
      <span>${item.quantity}</span>
      <button data-id="${item.id}" data-change="1">+</button>
    </div>
  </div>
`;

export const setCartOpen = (open) => {
  ui.cartDropdown.classList.toggle("hidden", !open);
  ui.cartToggle.setAttribute("aria-expanded", String(open));
};

export const renderCategories = (state) => {
  ui.categoryList.innerHTML = getCategories(state.products)
    .map((category) => categoryTemplate(category, state.selectedCategory))
    .join("");
};

export const renderProducts = (state) => {
  const products = getFilteredProducts(
    state.products,
    state.selectedCategory
  );

  ui.productList.innerHTML = products.length
    ? products.map(productTemplate).join("")
    : '<p class="empty-state">No products found in this category.</p>';
};

export const renderCart = (cart) => {
  ui.cartItems.innerHTML = cart.length
    ? cart.map(cartItemTemplate).join("")
    : '<p class="empty-state">Kundvagnen är tom.</p>';

  ui.cartTotal.textContent = formatPrice(getCartTotal(cart));
  ui.cartCount.textContent = getCartCount(cart);
  ui.checkoutLink.classList.toggle("disabled-link", cart.length === 0);
};

export const render = (state) => {
  renderCategories(state);
  renderProducts(state);
  renderCart(state.cart);
};