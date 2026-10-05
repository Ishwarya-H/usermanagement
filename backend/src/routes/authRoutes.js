const express = require("express");
const router = express.Router();
module.exports = router;

const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const groupController = require("../controllers/groupController");
const dashboardController = require("../controllers/dashboardController");
const membershipController = require("../controllers/membershipController");
const invitationController = require("../controllers/invitationController");
const profileController = require("../controllers/profileController");
const groupCreationRequestController = require("../controllers/groupCreationRequestController");
const groupAdminRequestController =require("../controllers/groupAdminRequestController");
const { authenticate } = require("../middleware/authMiddleware");
const notificationController =
  require(
    "../controllers/notificationController"
  );
const {
  authorizeAdmin,
  authorizeGroupAdmin,
} = require("../middleware/adminMiddleware");
const auditLogController =
  require(
    "../controllers/auditLogController"
  );
/* =========================
   AUTH
========================= */

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

/* =========================
   PROFILE
========================= */
router.get(
"/profile",
authenticate,
profileController.getProfile
);
router.put(
  "/profile",
  authenticate,
  profileController.updateProfile
);

router.put(
  "/profile/change-password",
  authenticate,
  profileController.changePassword
);

/* =========================
   ADMIN
========================= */

router.get(
  "/stats",
  authenticate,
  authorizeAdmin,
  dashboardController.getStats
);

router.get(
  "/users",
  authenticate,
  authorizeAdmin,
  userController.getUsers
);

router.patch(
  "/users/:id/deactivate",
  authenticate,
  authorizeAdmin,
  userController.deactivateUser
);

router.patch(
  "/users/:id/activate",
  authenticate,
  authorizeAdmin,
  userController.activateUser
);

router.get(
  "/groups",
  authenticate,
  authorizeAdmin,
  groupController.getGroups
);

/* =========================
   GROUPS
========================= */

router.get(
  "/groups/available",
  authenticate,
  groupController.getAvailableGroups
);

router.post(
  "/groups/create",
  authenticate,
  groupController.createGroup
);

router.get(
  "/groups/my-group",
  authenticate,
  authorizeGroupAdmin,
  groupController.getMyGroup
);

router.get(
  "/groups/owned",
  authenticate,
  groupController.getOwnedGroups
);

router.get(
  "/groups/:groupId",
  authenticate,
  groupController.getGroupById
);

/* =========================
   MEMBERSHIPS
========================= */

// User requests to join group
router.post(
  "/memberships/request",
  authenticate,
  membershipController.requestMembership
);

// User views own requests
router.get(
  "/memberships/my-requests",
  authenticate,
  membershipController.getMyRequests
);

// Group owner views pending requests
router.get(
  "/memberships/pending/:groupId",
  authenticate,
  membershipController.getPendingRequests
);

// Group owner approves request
router.patch(
  "/memberships/:id/approve",
  authenticate,
  membershipController.approveMembership
);

// Group owner rejects request
router.patch(
  "/memberships/:id/reject",
  authenticate,
  membershipController.rejectMembership
);

// Group members list
router.get(
  "/memberships/members/:groupId",
  authenticate,
  membershipController.getGroupMembers
);

// User's groups
router.get(
  "/memberships/my-groups",
  authenticate,
  membershipController.getMyGroups
);

// Remove member
router.delete(
  "/memberships/:id",
  authenticate,
  membershipController.removeMember
);

/* =========================
   INVITATIONS
========================= */

router.post(
  "/invitations/send",
  authenticate,
  invitationController.sendInvitation
);

router.get(
  "/invitations/my",
  authenticate,
  invitationController.getMyInvitations
);

router.patch(
  "/invitations/:id/accept",
  authenticate,
  invitationController.acceptInvitation
);

router.patch(
  "/invitations/:id/reject",
  authenticate,
  invitationController.rejectInvitation
);

/* =========================
   USERS
========================= */

router.get(
  "/users/invite-list",
  authenticate,
  userController.getInviteUsers
);

/* =========================
   GROUP CREATION REQUESTS
========================= */

router.get(
  "/group-creation-requests",
  authenticate,
  authorizeAdmin,
  groupCreationRequestController.getRequests
);

router.patch(
  "/group-creation-requests/:id/approve",
  authenticate,
  authorizeAdmin,
  groupCreationRequestController.approveRequest
);

router.patch(
  "/group-creation-requests/:id/reject",
  authenticate,
  authorizeAdmin,
  groupCreationRequestController.rejectRequest
);
router.post(
  "/group-admin-request",
  authenticate,
  groupAdminRequestController.requestGroupAdmin
);

router.get(
  "/group-admin-request/:groupId",
  authenticate,
  groupAdminRequestController.getRequests
);

router.patch(
  "/group-admin-request/:id/approve",
  authenticate,
  groupAdminRequestController.approveRequest
);

router.patch(
  "/group-admin-request/:id/reject",
  authenticate,
  groupAdminRequestController.rejectRequest
);
router.patch(
  "/groups/:id/deactivate",
  authenticate,
  authorizeAdmin,
  groupController.deactivateGroup
);

router.patch(
  "/groups/:id/activate",
  authenticate,
  authorizeAdmin,
  groupController.activateGroup
);
router.get(
  "/notifications",
  authenticate,
  notificationController.getNotifications
);
router.patch(
"/notifications/:id/read",
authenticate,
notificationController.markAsRead
);
router.get(
  "/audit-logs",
  authenticate,
  authorizeAdmin,
  auditLogController.getAuditLogs
);
router.put(
  "/groups/:groupId/member-limit",
  authenticate,
  groupController.updateMemberLimit
);
router.put(
  "/groups/:groupId/join-setting",
  authenticate,
  groupController.updateJoinRequestSetting
);
module.exports = router;
