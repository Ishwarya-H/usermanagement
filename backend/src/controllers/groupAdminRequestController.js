const GroupAdminRequest = require(
  "../models/GroupAdminRequest"
);

const Membership = require(
  "../models/Membership"
);
const Notification = require(
  "../models/Notification"
);

exports.requestGroupAdmin = async (
  req,
  res
) => {
  try {
    const { groupId } = req.body;

    const existing =
      await GroupAdminRequest.findOne({
        userId: req.user.id,
        groupId,
        status: "Pending",
      });
      
    if (existing) {
      return res.status(400).json({
        message:
          "Request already submitted",
      });
    }

    await GroupAdminRequest.create({
      userId: req.user.id,
      groupId,
    });

    res.json({
      message:
        "Admin access request submitted",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};

exports.getRequests = async (
  req,
  res
) => {
  try {
    const requests =
      await GroupAdminRequest.find({
        groupId: req.params.groupId,
        status: "Pending",
      }).populate(
        "userId",
        "firstName lastName email"
      );

    res.json(requests);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};

exports.approveRequest = async (
  req,
  res
) => {
  try {
    const request =
      await GroupAdminRequest.findById(
        req.params.id
      );

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    request.status = "Approved";

    await request.save();

    const membership =
      await Membership.findOne({
        userId: request.userId,
        groupId: request.groupId,
      });
      console.log("REQUEST:", request);
console.log("MEMBERSHIP FOUND:",

membership
);
    if (!membership) {
      return res.status(404).json({
        message:
          "Membership not found",
      });
    }

    membership.isGroupAdmin = true;

    await membership.save();
    await Notification.create({
  userId: request.userId,
  message:
    "Your Group Admin access request was approved.",
});

    res.json({
      message:
        "Group admin request approved successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};

exports.rejectRequest = async (
  req,
  res
) => {
  try {
    const request =
      await GroupAdminRequest.findById(
        req.params.id
      );

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    request.status = "Rejected";

    await request.save();
    await Notification.create({
  userId: request.userId,
  message:
    "Your Group Admin access request was rejected.",
});

    res.json({
      message:
        "Group admin request rejected",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};