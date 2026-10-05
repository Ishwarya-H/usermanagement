const Request = require("../models/Request");
const User = require("../models/User");
const Group = require("../models/Group");
const Notification = require(
  "../models/Notification"
);
exports.getRequests = async (req, res) => {
  try {
    const pendingRequests = await Request.find({
      status: "Pending",
    });

    res.json(pendingRequests);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};

exports.approveRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    if (request.status === "Approved") {
      return res.status(400).json({
        message: "Request already approved",
      });
    }

    if (request.status === "Rejected") {
      return res.status(400).json({
        message: "Rejected request cannot be approved",
      });
    }

    request.status = "Approved";
    request.rejectionReason = "";
    request.actionedBy = req.user.email;
    request.actionedAt = new Date();

    await request.save();

    await User.findByIdAndUpdate(
      request.userId,
      {
        role: "groupAdmin",
      }
    );
    const existingGroup = await Group.findOne({
  groupName: request.groupName,
});

if (existingGroup) {
  return res.status(400).json({
    message: "Group name already exists",
  });
}
    await Group.create({
      groupName: request.groupName,
      groupAdminId: request.userId,
      groupAdminName: request.userName,
      memberCount: 1,
    });

    res.json({
      message: "Request Approved Successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};

exports.rejectRequest = async (req, res) => {
  try {
    const { rejectionReason } = req.body;

    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    if (request.status === "Approved") {
      return res.status(400).json({
        message: "Approved request cannot be rejected",
      });
    }

    if (request.status === "Rejected") {
      return res.status(400).json({
        message: "Request already rejected",
      });
    }

    if (!rejectionReason || !rejectionReason.trim()) {
      return res.status(400).json({
        message: "Rejection reason is required",
      });
    }

    request.status = "Rejected";
    request.rejectionReason = rejectionReason.trim();
    request.actionedBy = req.user.email;
    request.actionedAt = new Date();

    await request.save();

    res.json({
      message: "Request Rejected Successfully",
      request,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};