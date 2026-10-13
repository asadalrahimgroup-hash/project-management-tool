const requireSystemAdministrator = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  const allowedRoles = ["System Administrator"];

  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      error: "Access denied. The Admin Console and administrative functions are strictly restricted to the System Administrator account."
    });
  }

  next();
};

module.exports = requireSystemAdministrator;
