import {
  $,
  clearCartStorage,
  formatPrice,
  getCart,
  getCartTotal,
  saveCart,
} from "./shared.js";

let cart = getCart();

const ui = {
  items: $("checkout-cart-items"),
  total: $("checkout-total"),
  form: $("checkout-form"),
  message: $("message"),
};

const getValue = (id) => $(id).value.trim();

const showMessage = (text, type) => {
  ui.message.textContent = text;
  ui.message.className = `message ${type}`;
};

function increaseQuantity(itemId) {
  cart = cart.map((item) =>
    String(item.id) === String(itemId)
      ? { ...item, quantity: item.quantity + 1 }
      : item
  );

  saveCart(cart);
  renderCheckoutCart();
}

function decreaseQuantity(itemId) {
  cart = cart
    .map((item) =>
      String(item.id) === String(itemId)
        ? { ...item, quantity: item.quantity - 1 }
        : item
    )
    .filter((item) => item.quantity > 0);

  if (!cart.length) {
    clearCartStorage();
  } else {
    saveCart(cart);
  }

  renderCheckoutCart();
}

function renderCheckoutCart() {
  if (!cart.length) {
    clearCartStorage();
    window.location.href = "./index.html";
    return;
  }

  ui.items.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
          <div>
            <div class="cart-item-title">${item.name}</div>
            <div class="cart-item-meta">${formatPrice(item.price)}</div>
          </div>

          <div class="cart-item-actions">
            <button
              type="button"
              class="quantity-btn"
              data-action="decrease"
              data-id="${item.id}"
              aria-label="Minska antal för ${item.name}"
            >
              −
            </button>

            <span>${item.quantity}</span>

            <button
              type="button"
              class="quantity-btn"
              data-action="increase"
              data-id="${item.id}"
              aria-label="Öka antal för ${item.name}"
            >
              +
            </button>

            <strong>${formatPrice(item.price * item.quantity)}</strong>
          </div>
        </div>
      `
    )
    .join("");

  ui.total.textContent = formatPrice(getCartTotal(cart));
}

function getOrderData() {
  return {
    name: getValue("name"),
    email: getValue("email"),
    address: getValue("address"),
    city: getValue("city"),
    postalCode: getValue("postalCode"),
    items: cart,
    total: getCartTotal(cart),
  };
}

function isValidOrder(order) {
  return (
    order.name &&
    order.email &&
    order.address &&
    order.city &&
    order.postalCode
  );
}

ui.items.addEventListener("click", (event) => {
  const button = event.target.closest(".quantity-btn");

  if (!button) {
    return;
  }

  const { action, id } = button.dataset;

  if (action === "increase") {
    increaseQuantity(id);
  }

  if (action === "decrease") {
    decreaseQuantity(id);
  }
});

ui.form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!cart.length) {
    showMessage("Kassan är tom.", "error");
    return;
  }

  const order = getOrderData();

  if (!isValidOrder(order)) {
    showMessage("Fyll i alla fält för att lägga beställningen.", "error");
    return;
  }

  console.log("Order placed:", order);

  showMessage(
    `Tack ${order.name}! Din beställning på ${formatPrice(
      order.total
    )} är lagd.`,
    "success"
  );

  clearCartStorage();
  cart = [];
  ui.form.reset();

  setTimeout(() => {
    window.location.href = "./index.html";
  }, 2000);
});

renderCheckoutCart();