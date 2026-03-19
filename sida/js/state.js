export const state = {
  products: [],
  selectedCategory: "allt",
  cart: JSON.parse(localStorage.getItem("cart") || "[]"),
};

export const saveCart = () => {
  localStorage.setItem("cart", JSON.stringify(state.cart));
};