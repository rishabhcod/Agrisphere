import axiosClient from "./axiosClient";

export const cropApi = {
  getAll: () => axiosClient.get("/crops"),
  create: (data) => axiosClient.post("/crops", data),

  getMyPlans: () => axiosClient.get("/crop-plans/me"),
  createPlan: (data) => axiosClient.post("/crop-plans", data),
  updatePlan: (id, data) => axiosClient.put(`/crop-plans/${id}`, data),
  deletePlan: (id) => axiosClient.delete(`/crop-plans/${id}`),
};
