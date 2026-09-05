import api from "./api";

export const registerUser = (data)=>{
    return api.post("/auth/register", data)
}

export const loginUser = (data) => {
  return api.post("/auth/login", data);
};

export const updatePassword = (data, token) => {
  return api.put(
    "/auth/update-password",
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};