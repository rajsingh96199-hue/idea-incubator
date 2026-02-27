import api from "./api";

// Fetch approved ideas (visible to investor)
export const getApprovedIdeas = () => api.get("/investor/approved");

// Express interest in an idea
export const expressInterest = (ideaId) => api.post(`/investor/interest/${ideaId}`);
export default {
  getApprovedIdeas,
  expressInterest
};
