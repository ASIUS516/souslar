const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Xəta baş verdi");
  }
  return data;
}

export const api = {
  getSettings: () => request("/settings"),
  updateSettings: (settings) =>
    request("/settings", { method: "PUT", body: JSON.stringify(settings) }),

  getCategories: () => request("/categories"),
  createCategory: (data) =>
    request("/categories", { method: "POST", body: JSON.stringify(data) }),
  updateCategory: (id, data) =>
    request(`/categories/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteCategory: (id) => request(`/categories/${id}`, { method: "DELETE" }),

  getProducts: () => request("/products"),
  getProduct: (id) => request(`/products/${id}`),
  createProduct: (data) =>
    request("/products", { method: "POST", body: JSON.stringify(data) }),
  updateProduct: (id, data) =>
    request(`/products/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteProduct: (id) => request(`/products/${id}`, { method: "DELETE" }),
  uploadImage: (base64) =>
    request("/products/upload-image", {
      method: "POST",
      body: JSON.stringify({ image: base64 })
    }),

  createOrder: (data) =>
    request("/orders", { method: "POST", body: JSON.stringify(data) }),
  getOrders: () => request("/orders"),
  updateOrderStatus: (id, status) =>
    request(`/orders/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status })
    }),
  deleteOrder: (id) => request(`/orders/${id}`, { method: "DELETE" }),

  login: (username, password) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password })
    }),
  logout: () => request("/auth/logout", { method: "POST" }),
  me: () => request("/auth/me"),
  changePassword: (currentPassword, newPassword) =>
    request("/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword })
    })
};

export { API_URL };
