import api from "./api";

export const getStores = (params = {}) => {
  return api.get("/stores", {
    params,
  });
};

export const rateStore = (storeId, rating) => {
  return api.post(`/stores/${storeId}/rating`, {
    rating,
  });
};