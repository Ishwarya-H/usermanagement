const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(
      req.user.id
    ).select("-password");

    res.json(user);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};

exports.updateProfile = async (
  req,
  res
) => {
  try {
    const {
      firstName,
      lastName,
    } = req.body;

    const user =
      await User.findByIdAndUpdate(
        req.user.id,
        {
          firstName,
          lastName,
        },
        {
          new: true,
        }
      ).select("-password");

    res.json({
      message:
        "Profile updated successfully",
      user,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};

exports.changePassword =
  async (req, res) => {
    try {
      const {
        currentPassword,
        newPassword,
      } = req.body;

      const user =
        await User.findById(
          req.user.id
        );

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const isMatch =
        await bcrypt.compare(
          currentPassword,
          user.password
        );

      if (!isMatch) {
        return res.status(400).json({
          message:
            "Current password is incorrect",
        });
      }

      const hashedPassword =
        await bcrypt.hash(
          newPassword,
          10
        );

      user.password =
        hashedPassword;

      await user.save();

      res.json({
        message:
          "Password changed successfully",
      });
    } catch (err) {
      console.error(err);

      res.status(500).json({
        message: "Server error",
      });
    }
  };
