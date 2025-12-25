// Ye admin controller hai jo dashboard, users, teachers aur test series manage karta hai.
const adminService = require("../services/admin.service");

exports.getDashboard = async (req, res, next) => {
  try {
    const stats = await adminService.getDashboardStats();
    res.json(stats);
  } catch (e) {
    next(e);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const data = await adminService.getAllUsers(page, limit);
    res.json(data);
  } catch (e) {
    next(e);
  }
};

exports.approveTeacher = async (req, res, next) => {
  try {
    const teacher = await adminService.approveTeacher(req.params.id, req.user.id);
    res.json({ message: "Teacher approved", teacher });
  } catch (e) {
    next(e);
  }
};

exports.getTestSeries = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const data = await adminService.getAllTestSeries(page, limit);
    res.json(data);
  } catch (e) {
    next(e);
  }
};

exports.approveTestSeries = async (req, res, next) => {
  try {
    const test = await adminService.approveTestSeries(req.params.id, req.user.id);
    res.json({ message: "Test series approved", test });
  } catch (e) {
    next(e);
  }
};

exports.getAnalytics = async (req, res, next) => {
  try {
    const analytics = await adminService.getAnalytics();
    res.json(analytics);
  } catch (e) {
    next(e);
  }
};

exports.getRevenue = async (req, res, next) => {
  try {
    const revenue = await adminService.getRevenue();
    res.json({ totalRevenue: revenue });
  } catch (e) {
    next(e);
  }
};

exports.blockUser = async (req, res, next) => {
  try {
    const user = await adminService.blockUser(req.params.id, req.user.id);
    res.json({ message: "User blocked", user });
  } catch (e) {
    next(e);
  }
};
