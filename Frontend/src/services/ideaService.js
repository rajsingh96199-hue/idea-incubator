import axios from "axios";

const API = "http://localhost:5000/api";

const authHeader = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

// ✅ STUDENT: Get own ideas
export const getMyIdeas = async () => {
  const res = await axios.get(`${API}/ideas/my`, {
    headers: authHeader(),
  });
  return res.data;
};

// ✅ STUDENT: Create idea  ← THIS WAS MISSING
export const addIdea = async (data) => {
  const res = await axios.post(`${API}/ideas/create`, data, {
    headers: authHeader(),
  });
  return res.data;
};

