import axiosClient from "./axiosClient";

export const farmerApi = {
  createProfile: (data) => axiosClient.post("/farmers/profile", data),
  getMyProfile: () => axiosClient.get("/farmers/me"),
  updateMyProfile: (data) => axiosClient.put("/farmers/me", data),
  getAllFarmers: () => axiosClient.get("/farmers"),

  getMyLandParcels: () => axiosClient.get("/farmers/me/land-parcels"),
  addLandParcel: (data) => axiosClient.post("/farmers/me/land-parcels", data),
  updateLandParcel: (id, data) => axiosClient.put(`/farmers/me/land-parcels/${id}`, data),
  deleteLandParcel: (id) => axiosClient.delete(`/farmers/me/land-parcels/${id}`),
};
