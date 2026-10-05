import axios from "axios";

export const getNotifications = () =>
  axios.get(
    "http://localhost:5000/api/notifications",
    {
      withCredentials: true,
    }
  );

export const markNotificationAsRead = (
  id
) =>
  axios.patch(
    `http://localhost:5000/api/notifications/${id}/read`,
    {},
    {
      withCredentials: true,
    }
  );