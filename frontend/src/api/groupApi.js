import api from "./api";

export const getGroups = () =>
  api.get("/groups");

export const getAvailableGroups = () =>
  api.get("/groups/available");

export const getOwnedGroups = () =>
  api.get("/groups/owned");

export const getGroupById = (groupId) =>
  api.get(`/groups/${groupId}`);

export const createGroup = (data) =>
  api.post("/groups/create", data);

export const getMyGroups = () =>
  api.get("/memberships/my-groups");
export const requestJoinGroup = (
  groupId
) =>
  api.post(
    "/memberships/request",
    {
      groupId,
    }
  );

export const getPendingRequests = (
  groupId
) =>
  api.get(
    `/memberships/pending/${groupId}`
  );

export const approveJoinRequest = (
  id
) =>
  api.patch(
    `/memberships/${id}/approve`
  );

export const rejectJoinRequest = (
  id
) =>
  api.patch(
    `/memberships/${id}/reject`
  );

  export const requestGroupAdmin =
  (groupId) =>
    api.post(
      "/group-admin-request",
      { groupId }
    );

export const getAdminRequests =
  (groupId) =>
    api.get(
      `/group-admin-request/${groupId}`
    );

export const approveAdminRequest =
  (id) =>
    api.patch(
      `/group-admin-request/${id}/approve`
    );

export const rejectAdminRequest =
  (id) =>
    api.patch(
      `/group-admin-request/${id}/reject`
    );
export const deactivateGroup = (id) =>
  api.patch(`/groups/${id}/deactivate`);

export const activateGroup = (id) =>
  api.patch(`/groups/${id}/activate`);