const products = [
  {
    id: 1,
    name: "Java Basics Book",
    category: "Books",
    price: 19.99,
  },
  {
    id: 2,
    name: "Wireless Mouse",
    category: "Electronics",
    price: 24.99,
  },
  {
    id: 3,
    name: "Laptop Stand",
    category: "Accessories",
    price: 34.99,
  },
  {
    id: 4,
    name: "Mechanical Keyboard",
    category: "Electronics",
    price: 79.99,
  },
  {
    id: 5,
    name: "Notebook",
    category: "Books",
    price: 7.99,
  },
  {
    id: 6,
    name: "USB-C Hub",
    category: "Accessories",
    price: 29.99,
  },
];

let selectedCategory = "All";
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const categoryList = document.getElementById("category-list");
const productList = document.getElementById("product-list");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");
const clearCartBtn = document.getElementById("clear-cart-btn");
const checkoutLink = document.getElementById("checkout-link");
const cartToggle = document.getElementById("cart-toggle");
const cartDropdown = document.getElementById("cart-dropdown");

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function formatPrice(price) {
  return `$${price.toFixed(2)}`;
}

function getCategories() {
  return ["All", ...new Set(products.map((product) => product.category))];
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function getCartCount() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function openCart() {
  cartDropdown.classList.remove("hidden");
  cartToggle.setAttribute("aria-expanded", "true");
}

function closeCart() {
  cartDropdown.classList.add("hidden");
  cartToggle.setAttribute("aria-expanded", "false");
}

function toggleCart() {
  if (cartDropdown.classList.contains("hidden")) {
    openCart();
  } else {
    closeCart();
  }
}

function renderCategories() {
  const categories = getCategories();

  categoryList.innerHTML = categories
    .map(
      (category) => `
        <button
          class="category-btn ${selectedCategory === category ? "active" : ""}"
          data-category="${category}"
        >
          ${category}
        </button>
      `
    )
    .join("");

  document.querySelectorAll(".category-btn").forEach((button) => {
    button.addEventListener("click", () => {
      selectedCategory = button.dataset.category;
      renderCategories();
      renderProducts();
    });
  });
}

function renderProducts() {
  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  productList.innerHTML = filteredProducts
    .map(
      (product) => `
        <div class="product-card">
          <h3>${product.name}</h3>
          <div class="product-category">${product.category}</div>
          <div class="product-price">${formatPrice(product.price)}</div>
          <button data-id="${product.id}">Add to Cart</button>
        </div>
      `
    )
    .join("");

  document.querySelectorAll(".product-card button").forEach((button) => {
    button.addEventListener("click", () => {
      addToCart(Number(button.dataset.id));
    });
  });
}

function addToCart(productId) {
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    const product = products.find((item) => item.id === productId);

    if (!product) {
      return;
    }

    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  renderCart();
}

function changeQuantity(productId, amount) {
  const item = cart.find((product) => product.id === productId);

  if (!item) {
    return;
  }

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter((product) => product.id !== productId);
  }

  saveCart();
  renderCart();
}

function clearCart() {
  cart = [];
  saveCart();
  renderCart();
}

function renderCart() {
  if (cart.length === 0) {
    cartItems.innerHTML =
      '<p class="empty-state">Your cart is currently empty.</p>';
  } else {
    cartItems.innerHTML = cart
      .map(
        (item) => `
          <div class="cart-item">
            <div>
              <div class="cart-item-title">${item.name}</div>
              <div class="cart-item-meta">
                ${formatPrice(item.price)} x ${item.quantity}
              </div>
            </div>
            <div class="cart-item-actions">
              <button data-action="decrease" data-id="${item.id}">-</button>
              <span>${item.quantity}</span>
              <button data-action="increase" data-id="${item.id}">+</button>
            </div>
          </div>
        `
      )
      .join("");
  }

  cartTotal.textContent = formatPrice(getCartTotal());
  cartCount.textContent = getCartCount();

  if (cart.length === 0) {
    checkoutLink.classList.add("disabled-link");
  } else {
    checkoutLink.classList.remove("disabled-link");
  }

  document.querySelectorAll(".cart-item-actions button").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = Number(button.dataset.id);
      const action = button.dataset.action;

      changeQuantity(productId, action === "increase" ? 1 : -1);
    });
  });
}

cartToggle.addEventListener("click", (event) => {
  event.stopPropagation();
  toggleCart();
});

cartDropdown.addEventListener("click", (event) => {
  event.stopPropagation();
});

document.addEventListener("click", () => {
  closeCart();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeCart();
  }
});

clearCartBtn.addEventListener("click", clearCart);

checkoutLink.addEventListener("click", (event) => {
  if (cart.length === 0) {
    event.preventDefault();
  }
});

renderCategories();
renderProducts();
renderCart();