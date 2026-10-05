import api from "./api";

export const getUsers = () =>
  api.get("/users");

export const getInviteUsers = () =>
  api.get("/users/invite-list");

export const activateUser = (id) =>
  api.patch(`/users/${id}/activate`);

export const deactivateUser = (id) =>
  api.patch(`/users/${id}/deactivate`);

export const getProfile = () =>
  api.get("/profile");

export const updateProfile = (
  data
) =>
  api.put(
    "/profile",
    data
  );

export const changePassword = (
  data
) =>
  api.put(
    "/profile/change-password",
    data
  );