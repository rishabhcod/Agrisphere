import axiosClient from "./axiosClient";

export const equipmentApi = {
  getAvailable: () => axiosClient.get("/equipment"),
  getMine: () => axiosClient.get("/equipment/me"),
  create: (data) => axiosClient.post("/equipment", data),

  book: (equipmentId, data) => axiosClient.post(`/equipment/${equipmentId}/bookings`, data),
  getMyBookings: () => axiosClient.get("/bookings/me"),
  getBookingsForEquipment: (equipmentId) => axiosClient.get(`/equipment/${equipmentId}/bookings`),
  updateBookingStatus: (id, status) => axiosClient.put(`/bookings/${id}/status`, { status }),
};
