const AuditLog = require("../models/AuditLog");

const logAudit = async (
  performedBy,
  action,
  details
) => {
  try {
    console.log(
      "AUDIT CALLED:",
      performedBy,
      action,
      details
    );

    const log = await AuditLog.create({
      performedBy,
      action,
      details,
    });

    console.log(
      "AUDIT SAVED:",
      log
    );
  } catch (err) {
    console.error(
      "Audit Log Error:",
      err
    );
  }
};

module.exports = logAudit;