import { getCart, saveCart } from "./shared.js";
import {
  render,
  renderCart,
  renderCategories,
  renderProducts,
  setCartOpen,
  ui,
} from "./render.js";

const state = {
  products: [],
  selectedCategory: "allt",
  cart: getCart(),
};

async function loadItems() {
  try {
    const response = await fetch("./items.json");

    if (!response.ok) {
      throw new Error("Could not load items.json");
    }

    state.products = await response.json();
    render(state);
  } catch (error) {
    console.error("Error loading items:", error);
    ui.productList.innerHTML =
      '<p class="empty-state">Could not load products.</p>';
  }
}

function addToCart(id) {
  const product = state.products.find((p) => p.id === id);

  if (!product) {
    return;
  }

  const item = state.cart.find((p) => p.id === id);

  if (item) {
    item.quantity += 1;
  } else {
    state.cart.push({ ...product, quantity: 1 });
  }

  saveCart(state.cart);
  renderCart(state.cart);
}

function changeQuantity(id, delta) {
  const item = state.cart.find((p) => p.id === id);

  if (!item) {
    return;
  }

  item.quantity += delta;
  state.cart = state.cart.filter((p) => p.quantity > 0);

  saveCart(state.cart);
  renderCart(state.cart);
}

function clearCart() {
  state.cart = [];
  saveCart(state.cart);
  renderCart(state.cart);
}

function setupEvents() {
  ui.categoryList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");

    if (!button) {
      return;
    }

    state.selectedCategory = button.dataset.category;
    renderCategories(state);
    renderProducts(state);
  });

  ui.productList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-add]");

    if (!button) {
      return;
    }

    addToCart(Number(button.dataset.add));
  });

  ui.cartItems.addEventListener("click", (event) => {
    const button = event.target.closest("[data-change]");

    if (!button) {
      return;
    }

    changeQuantity(Number(button.dataset.id), Number(button.dataset.change));
  });

  ui.clearCartBtn.addEventListener("click", clearCart);

  ui.checkoutLink.addEventListener("click", (event) => {
    if (!state.cart.length) {
      event.preventDefault();
    }
  });

  ui.cartToggle.addEventListener("click", (event) => {
    event.stopPropagation();

    const isHidden = ui.cartDropdown.classList.contains("hidden");
    setCartOpen(isHidden);
  });

  ui.cartDropdown.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  document.addEventListener("click", () => {
    setCartOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setCartOpen(false);
    }
  });
}

setupEvents();
loadItems();