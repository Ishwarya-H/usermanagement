const Group = require("../models/Group");
const GroupCreationRequest = require(
  "../models/GroupCreationRequest"
);

exports.getRequests = async (req, res) => {
  try {
    const requests =
      await GroupCreationRequest.find({
        status: "Pending",
      });

    res.json(requests);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};

exports.approveRequest = async (req, res) => {
  try {
    const request =
      await GroupCreationRequest.findById(
        req.params.id
      );

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    request.status = "Approved";

    await request.save();

    await Group.create({
  groupName: request.groupName,
  groupAdminId: request.userId,
  groupAdminName: request.userName,
  groupAdminEmail: request.email,
  memberCount: 1,
});

    res.json({
      message:
        "Group creation request approved",
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

    const request =
      await GroupCreationRequest.findById(
        req.params.id
      );

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    request.status = "Rejected";
    request.rejectionReason =
      rejectionReason || "";

    await request.save();

    res.json({
      message:
        "Group creation request rejected",
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Server error",
    });

  }
};