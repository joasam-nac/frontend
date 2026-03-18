let cart = JSON.parse(localStorage.getItem("cart")) || [];

const checkoutCartItems = document.getElementById("checkout-cart-items");
const checkoutTotal = document.getElementById("checkout-total");
const checkoutForm = document.getElementById("checkout-form");
const messageBox = document.getElementById("message");

function formatPrice(price) {
  return `$${price.toFixed(2)}`;
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function renderCheckoutCart() {
  if (cart.length === 0) {
    checkoutCartItems.innerHTML =
      '<p class="empty-state">Your cart is empty. Go back and add products.</p>';
    checkoutTotal.textContent = "$0.00";
    return;
  }

  checkoutCartItems.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
          <div>
            <div class="cart-item-title">${item.name}</div>
            <div class="cart-item-meta">
              ${formatPrice(item.price)} x ${item.quantity}
            </div>
          </div>
          <strong>${formatPrice(item.price * item.quantity)}</strong>
        </div>
      `
    )
    .join("");

  checkoutTotal.textContent = formatPrice(getCartTotal());
}

function showMessage(text, type) {
  messageBox.textContent = text;
  messageBox.className = `message ${type}`;
}

checkoutForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (cart.length === 0) {
    showMessage("Your cart is empty.", "error");
    return;
  }

  const orderData = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    address: document.getElementById("address").value.trim(),
    city: document.getElementById("city").value.trim(),
    postalCode: document.getElementById("postalCode").value.trim(),
    items: cart,
    total: getCartTotal(),
  };

  if (
    !orderData.name ||
    !orderData.email ||
    !orderData.address ||
    !orderData.city ||
    !orderData.postalCode
  ) {
    showMessage("Please fill in all fields.", "error");
    return;
  }

  console.log("Order placed:", orderData);

  showMessage(
    `Thank you ${orderData.name}! Your order total is ${formatPrice(
      orderData.total
    )}.`,
    "success"
  );

  localStorage.removeItem("cart");
  cart = [];
  checkoutForm.reset();
  renderCheckoutCart();

  setTimeout(() => {
    window.location.href = "index.html";
  }, 2000);
});

renderCheckoutCart();