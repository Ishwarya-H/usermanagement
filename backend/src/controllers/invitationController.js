const Invitation = require("../models/Invitation");
const Group = require("../models/Group");
const Membership = require("../models/Membership");
const User = require("../models/User");
const Notification = require("../models/Notification");
const logAudit = require(
  "../utils/auditLogger"
);

exports.sendInvitation = async (req, res) => {
  try {
    const { userId, groupId } = req.body;

    const group = await Group.findById(
  groupId
);

if (!group) {
  return res.status(404).json({
    message: "Group not found",
  });
}

const adminMembership =
  await Membership.findOne({
    userId: req.user.id,
    groupId: group._id,
    isGroupAdmin: true,
    status: "Approved",
  });

const isOwner =
  String(group.groupAdminId) ===
  String(req.user.id);

const isGroupAdmin =
  !!adminMembership;

if (!isOwner && !isGroupAdmin) {
  return res.status(403).json({
    message: "Access denied",
  });
}

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const existingInvitation =
      await Invitation.findOne({
        invitedUserId: userId,
        groupId: group._id,
        status: "Pending",
      });

    if (existingInvitation) {
      return res.status(400).json({
        message: "Invitation already sent",
      });
    }

    const existingMembership =
      await Membership.findOne({
        userId,
        groupId: group._id,
        status: "Approved",
      });

    if (existingMembership) {
      return res.status(400).json({
        message:
          "User is already a member of this group",
      });
    }

    await Invitation.create({
      groupId: group._id,
      groupName: group.groupName,
      groupAdminId: req.user.id,
      invitedUserId: userId,
      status: "Pending",
    });

    await Notification.create({
      userId,
      message: `You received an invitation to join ${group.groupName}.`,
    });

    await logAudit(
      req.user.id,
      "Invitation Sent",
      `Invitation sent for ${group.groupName}`
    );

    res.status(201).json({
      message:
        "Invitation sent successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};

exports.getMyInvitations = async (
  req,
  res
) => {
  try {
    const invitations =
      await Invitation.find({
        invitedUserId: req.user.id,
      }).sort({
        createdAt: -1,
      });

    res.json(invitations);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};

exports.acceptInvitation = async (
  req,
  res
) => {
  try {
    const invitation =
      await Invitation.findById(
        req.params.id
      );

    if (!invitation) {
      return res.status(404).json({
        message: "Invitation not found",
      });
    }

    if (
      String(
        invitation.invitedUserId
      ) !== String(req.user.id)
    ) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    invitation.status = "Accepted";

    await invitation.save();

    const existingMembership =
      await Membership.findOne({
        userId: req.user.id,
        groupId: invitation.groupId,
      });

    if (!existingMembership) {
      await Membership.create({
        userId: req.user.id,
        groupId: invitation.groupId,
        status: "Approved",
      });

      const group =
        await Group.findById(
          invitation.groupId
        );

      if (group) {
        group.memberCount += 1;
        await group.save();
      }
    }

    res.json({
      message:
        "Invitation accepted successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};

exports.rejectInvitation = async (
  req,
  res
) => {
  try {
    const invitation =
      await Invitation.findById(
        req.params.id
      );

    if (!invitation) {
      return res.status(404).json({
        message: "Invitation not found",
      });
    }

    if (
      String(
        invitation.invitedUserId
      ) !== String(req.user.id)
    ) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    invitation.status = "Rejected";

    await invitation.save();

    res.json({
      message:
        "Invitation rejected successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};