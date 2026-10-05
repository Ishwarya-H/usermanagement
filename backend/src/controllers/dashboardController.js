const User = require("../models/User");
const Request = require("../models/Request");
const Group = require("../models/Group");

exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const pendingRequests = await Request.countDocuments({ status: "Pending" });
    const totalGroups = await Group.countDocuments();

    res.json({ totalUsers, pendingRequests, totalGroups });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};