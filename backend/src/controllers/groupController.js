const Group = require("../models/Group");
const User = require("../models/User");
const Membership = require(
  "../models/Membership"
);
const logAudit = require(
"../utils/auditLogger"
);
const Notification = require(
  "../models/Notification"
);
exports.getGroups = async (req, res) => {
  try {
    const groups = await Group.find();

    res.json(groups);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};

exports.getAvailableGroups = async (req, res) => {
  try {
    const groups = await Group.find({
      isActive: true,
      groupAdminId: {
        $ne: req.user.id,
      },
    }).select(
      "_id groupName groupAdminName memberCount memberLimit allowJoinRequests"
    );

    const availableGroups =
      groups.filter(
        (group) =>
          (group.allowJoinRequests !== false) &&
          (
            group.memberLimit === 0 ||
            group.memberCount <
              group.memberLimit
          )
      );

    res.json(availableGroups);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};
const GroupCreationRequest = require(
  "../models/GroupCreationRequest"
);

exports.createGroup = async (req, res) => {
  try {
    const { groupName } = req.body;

    if (!groupName || !groupName.trim()) {
      return res.status(400).json({
        message: "Group name is required",
      });
    }

    const existingGroup = await Group.findOne({
      groupName: groupName.trim(),
    });

    if (existingGroup) {
      return res.status(400).json({
        message: "Group name already exists",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const ownedGroupsCount =
      await Group.countDocuments({
        groupAdminId: req.user.id,
      });

    // First 3 groups are automatic
    if (ownedGroupsCount < 3) {
      const group = await Group.create({
  groupName: groupName.trim(),
  groupAdminId: user._id,
  groupAdminName: `${user.firstName} ${user.lastName}`,
  groupAdminEmail: user.email,
  memberCount: 1,
});

      return res.status(201).json({
        message: "Group created successfully",
        group,
      });
    }

    // 4th group onwards -> Admin approval
    const existingRequest =
      await GroupCreationRequest.findOne({
        userId: req.user.id,
        groupName: groupName.trim(),
        status: "Pending",
      });

    if (existingRequest) {
      return res.status(400).json({
        message:
          "Group creation request already submitted",
      });
    }

    await GroupCreationRequest.create({
      userId: user._id,
      userName: `${user.firstName} ${user.lastName}`,
      email: user.email,
      groupName: groupName.trim(),
      status: "Pending",
    });

    res.status(201).json({
      message:
        "Group creation request sent to Admin for approval",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};

exports.getMyGroup = async (req, res) => {
  try {
    const group = await Group.findOne({
      groupAdminId: req.user.id,
    });

    if (!group) {
      return res.status(404).json({
        message: "No group found",
      });
    }

    res.json(group);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};

exports.getGroupById = async (req, res) => {
  try {
    console.log("USER:", req.user);

    const group = await Group.findById(
      req.params.groupId
    ).populate(
      "groupAdminId",
      "firstName lastName email"
    );

    if (!group) {
      return res.status(404).json({
        message: "Group not found",
      });
    }

    res.json(group);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};
exports.deactivateGroup = async (req, res) => {
  try {
    const group =
      await Group.findByIdAndUpdate(
        req.params.id,
        {
          isActive: false,
        },
        { new: true }
      );

    const members =
      await Membership.find({
        groupId: group._id,
        status: "Approved",
      });

    // Notify all members
    for (const member of members) {
      await Notification.create({
        userId: member.userId,
        message: `Group ${group.groupName} has been deactivated by Admin.`,
      });
    }

    // Notify group owner/admin
    await Notification.create({
      userId: group.groupAdminId,
      message: `Your group ${group.groupName} has been deactivated by Admin.`,
    });
await logAudit(
  req.user.id,
  "Group Deactivated",
  `${group.groupName} was deactivated`
);
    res.json({
      message:
        "Group deactivated successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};


exports.activateGroup = async (req, res) => {
  try {
    const group =
      await Group.findByIdAndUpdate(
        req.params.id,
        {
          isActive: true,
        },
        { new: true }
      );

    const members =
      await Membership.find({
        groupId: group._id,
        status: "Approved",
      });

    // Notify all members
    for (const member of members) {
      await Notification.create({
        userId: member.userId,
        message: `Group ${group.groupName} has been activated by Admin.`,
      });
    }

    // Notify group owner/admin
    await Notification.create({
      userId: group.groupAdminId,
      message: `Your group ${group.groupName} has been activated by Admin.`,
    });
await logAudit(
  req.user.id,
  "Group Activated",
  `${group.groupName} was activated`
);
    res.json({
      message:
        "Group activated successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};
exports.getOwnedGroups = async (req, res) => {
  try {
    const groups = await Group.find({
      groupAdminId: req.user.id,
    });

    res.json(groups);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};
exports.updateMemberLimit = async (
  req,
  res
) => {
  try {
    const { memberLimit } = req.body;

    const group = await Group.findById(
      req.params.groupId
    );

    if (!group) {
      return res.status(404).json({
        message: "Group not found",
      });
    }

    if (
      String(group.groupAdminId) !==
      String(req.user.id)
    ) {
      return res.status(403).json({
        message: "Only the group owner can update the member limit",
      });
    }

    if (
      memberLimit < group.memberCount
    ) {
      return res.status(400).json({
        message:
          "Limit cannot be less than current member count",
      });
    }

    group.memberLimit =
      Number(memberLimit);

    await group.save();

    res.json({
      message:
        "Member limit updated successfully",
      memberLimit:
        group.memberLimit,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};
exports.updateJoinRequestSetting =async (req, res) => {
    try {
      const { allowJoinRequests } =
        req.body;

      const group =
        await Group.findById(
          req.params.groupId
        );

      if (!group) {
        return res.status(404).json({
          message:
            "Group not found",
        });
      }

      if (
        String(group.groupAdminId) !==
        String(req.user.id)
      ) {
        return res.status(403).json({
          message:
            "Only owner can update settings",
        });
      }

      group.allowJoinRequests =
        allowJoinRequests;

      await group.save();

      res.json({
        message:
          "Setting updated successfully",
      });
    } catch (err) {
      console.error(err);

      res.status(500).json({
        message: "Server error",
      });
    }
  };