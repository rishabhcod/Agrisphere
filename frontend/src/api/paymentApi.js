import axiosClient from "./axiosClient";

export const paymentApi = {
  create: (data) => axiosClient.post("/payments", data),
  getMine: () => axiosClient.get("/payments/me"),
  getAll: () => axiosClient.get("/payments"),
  updateStatus: (id, paymentStatus) => axiosClient.put(`/payments/${id}/status`, { paymentStatus }),
};
