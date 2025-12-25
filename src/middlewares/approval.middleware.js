// Ye approval middleware hai jo teacher aur test approval check karta hai.
const { User, TestSeries } = require("../models");


exports.approvedTeacher = async (req, res, next) => {
  if (req.user.role !== "TEACHER") {
    return res.status(403).json({ message: "Access denied. Not a teacher." });
  }

  if (!req.user.isApproved) {
    return res.status(403).json({ message: "Teacher not approved yet." });
  }

  next();
};


// Ye middleware check karta hai ki test series approved hai ya nahi.
exports.approvedTest = async (req, res, next) => {
  const testId = req.params.id || req.body.testSeriesId;

  if (!testId) {
    return res.status(400).json({ message: "Test ID required" });
  }

  const test = await TestSeries.findByPk(testId);

  if (!test) {
    return res.status(404).json({ message: "Test not found" });
  }

  if (!test.isApproved) {
    return res.status(403).json({ message: "Test not approved yet." });
  }

  req.test = test; 
  next();
};
