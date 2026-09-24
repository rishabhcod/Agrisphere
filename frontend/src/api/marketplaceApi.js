import axiosClient from "./axiosClient";

export const marketplaceApi = {
  getActiveListings: () => axiosClient.get("/marketplace-listings"),
  getMyListings: () => axiosClient.get("/marketplace-listings/me"),
  createListing: (data) => axiosClient.post("/marketplace-listings", data),
  deleteListing: (id) => axiosClient.delete(`/marketplace-listings/${id}`),

  createBuyerProfile: (data) => axiosClient.post("/buyers/profile", data),
  getMyBuyerProfile: () => axiosClient.get("/buyers/me"),

  buy: (data) => axiosClient.post("/orders", data),
  getMyOrders: () => axiosClient.get("/orders/me"),
  getIncomingOrders: () => axiosClient.get("/orders/incoming"),
};
