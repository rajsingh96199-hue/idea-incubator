import api from "./api";
import toast from "react-hot-toast";

export const login = async (data) => {
  try {
    const res = await api.post("/auth/login", data);
    localStorage.setItem("token", res.data.token);
    toast.success("Login Successful 🎉");
    return res;
  } catch (err) {
    toast.error(err.response?.data?.error || "Login failed ❌");
    throw err;
  }
};

export const register = async (data) => {
  try {
    const res = await api.post("/auth/register", data);
    toast.success("Account Created! 🎓 Now Login");
    return res;
  } catch (err) {
    toast.error(err.response?.data?.error || "Registration failed ❌");
    throw err;
  }
};

export const profile = () => api.get("/auth/profile");
