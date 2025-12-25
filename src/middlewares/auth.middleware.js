// Ye auth middleware hai jo JWT authentication handle karta hai.
const jwt = require("jsonwebtoken");

// Ye middleware JWT token ko verify karta hai aur user ko request mein attach karta hai.
module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  req.user = jwt.verify(token, process.env.JWT_SECRET);
  next();
};
