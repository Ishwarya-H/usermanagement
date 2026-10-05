const AuditLog = require(
  "../models/AuditLog"
);

exports.getAuditLogs = async (
  req,
  res
) => {
  try {
    const logs =
      await AuditLog.find()
        .populate(
          "performedBy",
          "firstName lastName email"
        )
        .sort({
          createdAt: -1,
        });

    res.json(logs);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};