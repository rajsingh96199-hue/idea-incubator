import api from "./api";

export const getNotifications = () => {
  return api.get("/notifications");
};

export const markAsRead = (id) => {
  return api.put(`/notifications/read/${id}`);
};
