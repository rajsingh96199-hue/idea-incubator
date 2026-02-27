import axios from "axios";

let activeRequests = 0;
let setGlobalLoading = null;

export const registerLoader = (setLoading) => {
  setGlobalLoading = setLoading;
};

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  activeRequests++;
  setGlobalLoading?.(true);

  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => {
    activeRequests--;
    if (activeRequests === 0) setGlobalLoading?.(false);
    return response;
  },
  (error) => {
    activeRequests--;
    if (activeRequests === 0) setGlobalLoading?.(false);
    return Promise.reject(error);
  }
);

export default api;
