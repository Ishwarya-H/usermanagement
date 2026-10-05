exports.authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }
  next();
};

exports.authorizeGroupAdmin = (req, res, next) => {
  if (req.user.role !== "groupAdmin") {
    return res.status(403).json({ message: "Access denied. Group Admin only." });
  }
  next();
};