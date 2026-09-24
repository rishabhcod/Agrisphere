import axiosClient from "./axiosClient";

export const warehouseApi = {
  getAll: () => axiosClient.get("/warehouses"),
  create: (data) => axiosClient.post("/warehouses", data),

  getMyInventory: () => axiosClient.get("/inventory/me"),
  getAllInventory: () => axiosClient.get("/inventory"),
  addInventory: (data) => axiosClient.post("/inventory", data),
  updateInventory: (id, data) => axiosClient.put(`/inventory/${id}`, data),
};
