const Membership = require("../models/Membership");
const Group = require("../models/Group");
const GroupAdminRequest = require(
  "../models/GroupAdminRequest"
);

const Notification = require(
  "../models/Notification"
);
const logAudit = require(
  "../utils/auditLogger"
);
/* =========================
   JOIN REQUESTS
========================= */

exports.requestMembership = async (req, res) => {
  try {
    const { groupId } = req.body;
    const userId = req.user.id;

    const group = await Group.findById(groupId);

    if (!group) {
      if (!group.allowJoinRequests) {
  return res.status(400).json({
    message:
      "Join requests are disabled for this group",
  });
}
      return res.status(404).json({
        message: "Group not found",
      });
    }

    if (
      String(group.groupAdminId) ===
      String(req.user.id)
    ) {
      return res.status(400).json({
        message:
          "You cannot request to join your own group",
      });
    }

    // Member limit validation
    if (
      group.memberLimit > 0 &&
      group.memberCount >= group.memberLimit
    ) {
      return res.status(400).json({
        message:
          "Group member limit reached",
      });
    }

    const existing = await Membership.findOne({
      userId,
      groupId,
      status: {
        $in: ["Pending", "Approved"],
      },
    });

    if (existing) {
      return res.status(400).json({
        message:
          existing.status === "Pending"
            ? "You already have a pending request for this group"
            : "You are already a member of this group",
      });
    }

    const membership = await Membership.create({
      userId,
      groupId,
      status: "Pending",
    });

    await logAudit(
      req.user.id,
      "Join Request Submitted",
      `${group.groupName} join request submitted`
    );

    await Notification.create({
      userId: group.groupAdminId,
      message: `${req.user.email} requested to join ${group.groupName}.`,
    });

    res.status(201).json({
      message:
        "Join request submitted successfully",
      membership,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};

exports.getMyRequests = async (req, res) => {
  try {
    const memberships = await Membership.find({
      userId: req.user.id,
    })
      .populate("groupId", "groupName")
      .sort({
        createdAt: -1,
      });

    const formatted = memberships.map(
      (m) => ({
        id: m._id,
        groupName: m.groupId
          ? m.groupId.groupName
          : "Unknown Group",
        status: m.status,
        rejectionReason:
          m.rejectionReason,
        createdAt: m.createdAt,
      })
    );

    res.json(formatted);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};

exports.getPendingRequests = async (
  req,
  res
) => {
  try {
    const requests = await Membership.find({
      groupId: req.params.groupId,
      status: "Pending",
    })
      .populate(
        "userId",
        "firstName lastName email"
      )
      .sort({
        createdAt: -1,
      });

    res.json(requests);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};

exports.approveMembership = async (
  req,
  res
) => {
  try {
    const membership =
      await Membership.findById(
        req.params.id
      );

    if (!membership) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    const group =
      await Group.findById(
        membership.groupId
      );
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

    membership.status = "Approved";
    if (
  group.memberLimit > 0 &&
  group.memberCount >= group.memberLimit
) {
  return res.status(400).json({
    message:
      "Group member limit reached",
  });
}
    await membership.save();

    group.memberCount += 1;

    await group.save();

    console.log(
      "BEFORE AUDIT LOG"
    );

    await logAudit(
      req.user.id,
      "Membership Approved",
      `${group.groupName} membership approved`
    );

    console.log(
      "AFTER AUDIT LOG"
    );

    await Notification.create({
      userId: membership.userId,
      message: `Your request to join ${group.groupName} was approved.`,
    });

    res.json({
      message:
        "Membership request approved",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};

exports.rejectMembership = async (
  req,
  res
) => {
  try {
    const membership =
      await Membership.findById(
        req.params.id
      );

    if (!membership) {
      return res.status(404).json({
        message:
          "Request not found",
      });
    }

    membership.status = "Rejected";

await membership.save();
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
const group =
  await Group.findById(
    membership.groupId
  );

await logAudit(
  req.user.id,
  "Membership Rejected",
  `${group.groupName} membership rejected`
);

await Notification.create({
  userId: membership.userId,
  message: `Your request to join ${group.groupName} was rejected.`,
});

    res.json({
      message:
        "Membership request rejected",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};

/* =========================
   GROUP MEMBERS
========================= */

exports.getGroupMembers = async (
  req,
  res
) => {
  try {
    const { groupId } = req.params;

    const members = await Membership.find({
      groupId,
      status: "Approved",
    }).populate(
      "userId",
      "firstName lastName email isActive"
    );

    const adminRequests =
      await GroupAdminRequest.find({
        groupId,
        status: "Pending",
      });

    const formatted = members.map(
      (m) => {
        const adminRequest =
          adminRequests.find(
            (r) =>
              String(r.userId) ===
              String(m.userId._id)
          );

        return {
          id: m._id,
          name: `${m.userId.firstName} ${m.userId.lastName}`,
          email: m.userId.email,
          status: m.userId.isActive
            ? "Active"
            : "Inactive",
          isGroupAdmin:
            m.isGroupAdmin || false,
          adminRequestStatus:
            adminRequest?.status ||
            null,
          adminRequestId:
            adminRequest?._id ||
            null,
        };
      }
    );

    res.json(formatted);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};

exports.removeMember = async (
  req,
  res
) => {
  try {
    const membership =
      await Membership.findById(
        req.params.id
      );

    if (!membership) {
      return res.status(404).json({
        message:
          "Member not found",
      });
    }

    const group =
      await Group.findById(
        membership.groupId
      );

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
    await Membership.findByIdAndDelete(
      req.params.id
    );

    if (group.memberCount > 0) {
      group.memberCount -= 1;
      await group.save();
    }

    res.json({
      message:
        "Member removed successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};

exports.getMyGroups = async (
  req,
  res
) => {
  try {
    const memberships =
      await Membership.find({
        userId: req.user.id,
        status: "Approved",
      }).populate("groupId");

    const groups = memberships.map(
  (membership) => ({
    ...membership.groupId.toObject(),
    isGroupAdmin:
      membership.isGroupAdmin,
  })
);

    res.json(groups);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};