// Ye middleware check karta hai ki user ke paas required role hai ya nahi.
module.exports = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    return res.status(403).json({ message: "Forbidden" });
  next();
};
