import axiosClient from "./axiosClient";

export const procurementApi = {
  getSuppliers: () => axiosClient.get("/suppliers"),
  getInputItems: () => axiosClient.get("/input-items"),

  createOrder: (data) => axiosClient.post("/procurement-orders", data),
  getMyOrders: () => axiosClient.get("/procurement-orders/me"),

  // supplier side
  createSupplierProfile: (data) => axiosClient.post("/suppliers/profile", data),
  getMySupplierProfile: () => axiosClient.get("/suppliers/me"),
  getMyInputItems: () => axiosClient.get("/suppliers/me/input-items"),
  addInputItem: (data) => axiosClient.post("/suppliers/me/input-items", data),
  deleteInputItem: (id) => axiosClient.delete(`/suppliers/me/input-items/${id}`),
  getIncomingOrders: () => axiosClient.get("/procurement-orders/incoming"),
  updateOrderStatus: (id, status) => axiosClient.put(`/procurement-orders/${id}/status`, { status }),

  getAllOrders: () => axiosClient.get("/procurement-orders"),
};
