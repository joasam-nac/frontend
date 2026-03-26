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
  ui.message.className =
    type === "success"
      ? "mt-4 rounded-2xl border-4 border-black bg-green-300 p-3 text-sm font-bold text-black shadow-[4px_4px_0_0_#000]"
      : "mt-4 rounded-2xl border-4 border-black bg-red-300 p-3 text-sm font-bold text-black shadow-[4px_4px_0_0_#000]";
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidPostalCode = (postalCode) =>
  /^[0-9A-Za-z\s-]{3,10}$/.test(postalCode);

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
        <div
          class="flex items-center justify-between gap-4 rounded-2xl border-4 border-black bg-white p-4 shadow-[4px_4px_0_0_#000]"
        >
          <div class="min-w-0">
            <div class="truncate text-sm font-black text-black">
              ${item.name}
            </div>
            <div class="mt-1 text-sm text-gray-700">
              ${formatPrice(item.price)}
            </div>
          </div>

          <div class="flex items-center gap-3">
            <button
              type="button"
              data-action="decrease"
              data-id="${item.id}"
              aria-label="Minska antal för ${item.name}"
              class="inline-flex h-8 w-8 items-center justify-center rounded-xl border-2 border-black bg-red-400 text-sm font-black text-white"
            >
              −
            </button>

            <span class="min-w-5 text-center text-sm font-black text-black">
              ${item.quantity}
            </span>

            <button
              type="button"
              data-action="increase"
              data-id="${item.id}"
              aria-label="Öka antal för ${item.name}"
              class="inline-flex h-8 w-8 items-center justify-center rounded-xl border-2 border-black bg-green-400 text-sm font-black text-black"
            >
              +
            </button>

            <strong class="text-sm font-black text-blue-700">
              ${formatPrice(item.price * item.quantity)}
            </strong>
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

function validateOrder(order) {
  if (!order.name) {
    return "Fyll i ditt namn.";
  }

  if (!order.email) {
    return "Fyll i din e-post.";
  }

  if (!isValidEmail(order.email)) {
    return "Ange en giltig e-postadress.";
  }

  if (!order.address) {
    return "Fyll i din adress.";
  }

  if (!order.city) {
    return "Fyll i din stad.";
  }

  if (!order.postalCode) {
    return "Fyll i ditt postnummer.";
  }

  if (!isValidPostalCode(order.postalCode)) {
    return "Ange ett giltigt postnummer.";
  }

  return null;
}

ui.items.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");

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
  const validationError = validateOrder(order);

  if (validationError) {
    showMessage(validationError, "error");
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