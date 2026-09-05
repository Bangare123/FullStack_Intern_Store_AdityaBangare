import api from "./api";

export const getAdminDashboard = () => {
  return api.get("/admin/dashboard");
};

export const getUsers = (params = {}) => {
  return api.get("/admin/users", {
    params,
  });
};
export const createUser = (data) => {
  return api.post("/admin/users", data);
};

export const getUserDetails = (userId) => {
  return api.get(`/admin/users/${userId}`);
};

export const getAdminStores = (params = {}) => {
  return api.get("/admin/stores", {
    params,
  });
};

export const createStore = (data) => {
  return api.post("/admin/stores", data);
};

export const getStoreOwners = () => {
  return api.get("/admin/owners");
};