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

const pillColors = [
  "bg-red-400 text-white",
  "bg-blue-400 text-white",
  "bg-green-400 text-black",
  "bg-pink-400 text-black",
  "bg-orange-400 text-black",
  "bg-cyan-400 text-black",
];

const categoryTemplate = (category, selectedCategory, index) => `
  <button
    type="button"
    data-category="${category}"
    class="${
      selectedCategory === category
        ? "bg-black text-white"
        : pillColors[index % pillColors.length]
    } rounded-full border-4 border-black px-4 py-2 text-sm font-black shadow-[4px_4px_0_0_#000] transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
  >
    ${category}
  </button>
`;

const cardColors = [
  "bg-pink-200",
  "bg-cyan-200",
  "bg-yellow-200",
  "bg-green-200",
  "bg-orange-200",
  "bg-rose-200",
];

const productTemplate = (product, index) => `
  <article
    class="flex h-full flex-col overflow-hidden rounded-3xl border-4 border-black ${
      cardColors[index % cardColors.length]
    } shadow-[8px_8px_0_0_#000]"
  >
    <div class="border-b-4 border-black bg-white">
      <img
        src="${product.image}"
        alt="${product.name}"
        class="h-56 w-full object-contain p-6"
      />
    </div>

    <div class="flex flex-1 flex-col p-5">
      <p class="text-xs font-black uppercase tracking-wide text-red-600">
        ${(product.categories ?? []).join(", ")}
      </p>

      <h3 class="mt-2 text-lg font-black text-black">
        ${product.name}
      </h3>

      <p class="mt-3 flex-grow text-sm leading-6 text-gray-800">
        ${product.description}
      </p>

      <div class="mt-5 flex items-center justify-between gap-4">
        <p class="text-base font-black text-blue-700">
          ${formatPrice(product.price)}
        </p>

        <button
          type="button"
          data-add="${product.id}"
          class="inline-flex items-center rounded-2xl border-4 border-black bg-blue-500 px-4 py-2 text-sm font-black text-white shadow-[4px_4px_0_0_#000] transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
        >
          Lägg i kundvagn
        </button>
      </div>
    </div>
  </article>
`;

const cartItemTemplate = (item) => `
  <div
    class="flex items-center gap-3 rounded-2xl border-4 border-black bg-white p-3 shadow-[4px_4px_0_0_#000]"
  >
    <img
      src="${item.image}"
      alt="${item.name}"
      class="h-16 w-16 rounded-xl border-2 border-black bg-yellow-100 object-cover"
    />

    <div class="min-w-0 flex-1">
      <div class="truncate text-sm font-black text-black">
        ${item.name}
      </div>
      <div class="mt-1 text-sm text-gray-700">
        ${formatPrice(item.price)} x ${item.quantity}
      </div>
    </div>

    <div class="flex items-center gap-2">
      <button
        type="button"
        data-id="${item.id}"
        data-change="-1"
        aria-label="Minska antal för ${item.name}"
        class="inline-flex h-8 w-8 items-center justify-center rounded-xl border-2 border-black bg-red-400 text-sm font-black text-white"
      >
        -
      </button>

      <span class="min-w-5 text-center text-sm font-black text-black">
        ${item.quantity}
      </span>

      <button
        type="button"
        data-id="${item.id}"
        data-change="1"
        aria-label="Öka antal för ${item.name}"
        class="inline-flex h-8 w-8 items-center justify-center rounded-xl border-2 border-black bg-green-400 text-sm font-black text-black"
      >
        +
      </button>
    </div>
  </div>
`;

export const setCartOpen = (open) => {
  ui.cartDropdown.classList.toggle("hidden", !open);
  ui.cartToggle.setAttribute("aria-expanded", String(open));
};

export const renderCategories = (state) => {
  ui.categoryList.innerHTML = getCategories(state.products)
    .map((category, index) =>
      categoryTemplate(category, state.selectedCategory, index)
    )
    .join("");
};

export const renderProducts = (state) => {
  const products = getFilteredProducts(
    state.products,
    state.selectedCategory
  );

  ui.productList.innerHTML = products.length
    ? products.map((product, index) => productTemplate(product, index)).join("")
    : `
      <p class="rounded-2xl border-4 border-black bg-white p-4 text-sm font-bold italic text-gray-700 shadow-[4px_4px_0_0_#000]">
        Inga produkter hittades i denna kategori.
      </p>
    `;
};

export const renderCart = (cart) => {
  ui.cartItems.innerHTML = cart.length
    ? cart.map(cartItemTemplate).join("")
    : `
      <p class="rounded-2xl border-4 border-black bg-yellow-100 p-4 text-sm font-bold italic text-gray-800 shadow-[4px_4px_0_0_#000]">
        Kundvagnen är tom.
      </p>
    `;

  ui.cartTotal.textContent = formatPrice(getCartTotal(cart));
  ui.cartCount.textContent = getCartCount(cart);

  const isEmpty = cart.length === 0;

  ui.checkoutLink.classList.toggle("pointer-events-none", isEmpty);
  ui.checkoutLink.classList.toggle("opacity-50", isEmpty);
  ui.cartCount.classList.toggle("hidden", getCartCount(cart) === 0);
};

export const render = (state) => {
  renderCategories(state);
  renderProducts(state);
  renderCart(state.cart);
};