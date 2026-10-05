import api from "./api";

export const sendInvitation = (data) =>
  api.post("/invitations/send", data);

export const getMyInvitations = () =>
  api.get("/invitations/my");

export const acceptInvitation = (id) =>
  api.patch(`/invitations/${id}/accept`);

export const rejectInvitation = (id) =>
  api.patch(`/invitations/${id}/reject`);