export const $ = (id) => document.getElementById(id);

export const getCart = () =>
  JSON.parse(localStorage.getItem("cart") || "[]");

export const saveCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

export const clearCartStorage = () => {
  localStorage.removeItem("cart");
};

export const formatPrice = (price) => {
  const value = Math.round(price * 100) / 100;

  return `${value.toLocaleString("sv-SE", {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  })} kr`;
};

export const getCartTotal = (cart) =>
  cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

export const getCartCount = (cart) =>
  cart.reduce((sum, item) => sum + item.quantity, 0);

export const getCategories = (products) => [
  "allt",
  ...new Set(products.flatMap((p) => p.categories ?? [])),
];

export const getFilteredProducts = (products, category) =>
  category === "allt"
    ? products
    : products.filter((p) => (p.categories ?? []).includes(category));