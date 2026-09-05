import api from "./api";

export const getOwnerDashboard = () => {
  return api.get("/owner/dashboard");
};