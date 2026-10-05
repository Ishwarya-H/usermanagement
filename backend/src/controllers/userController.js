const User = require("../models/User");
const logAudit = require(
  "../utils/auditLogger"
);

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select(
      "firstName lastName email role isActive"
    );

    res.json(users);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};

exports.deactivateUser = async (req, res) => {
  try {
    const user = await User.findById(
      req.params.id
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role === "admin") {
      return res.status(400).json({
        message:
          "Cannot deactivate an admin user",
      });
    }

    user.isActive = false;

    await user.save();

    await logAudit(
      req.user.id,
      "User Deactivated",
      `${user.email} was deactivated`
    );

    res.json({
      message:
        "User deactivated successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};

exports.activateUser = async (req, res) => {
  try {
    const user = await User.findById(
      req.params.id
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.isActive = true;

    await user.save();

    await logAudit(
      req.user.id,
      "User Activated",
      `${user.email} was activated`
    );

    res.json({
      message:
        "User activated successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};

exports.getIndividualUsers = async (req, res) => {
  try {
    const users = await User.find({
      role: "individual",
      isActive: true,
    }).select(
      "firstName lastName email role"
    );

    res.json(users);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};

exports.getInviteUsers = async (req, res) => {
  try {
    const users = await User.find({
      role: "individual",
      isActive: true,
      _id: {
        $ne: req.user.id,
      },
    }).select(
      "firstName lastName email role isActive"
    );

    res.json(users);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};
