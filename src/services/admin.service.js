// Ye admin service hai jo admin related operations handle karta hai.
const { User, TestSeries, Subscription, TestAttempt } = require("../models");
const { Op } = require("sequelize");

// Pricing for revenue calculation
const PRICING = {
  BASIC: 9.99,
  PREMIUM: 19.99
};

// Helper to log admin actions
const logAdminAction = (adminId, action, details) => {
  console.log(`ADMIN ACTION: User ${adminId} performed ${action} - ${JSON.stringify(details)}`);
};

exports.getDashboardStats = async () => {
  const totalUsers = await User.count();
  const totalTeachers = await User.count({ where: { role: "TEACHER" } });
  const approvedTeachers = await User.count({ where: { role: "TEACHER", isApproved: true } });
  const totalTestSeries = await TestSeries.count();
  const approvedTestSeries = await TestSeries.count({ where: { isApproved: true } });
  const totalSubscriptions = await Subscription.count({ where: { status: "ACTIVE" } });

  return {
    totalUsers,
    totalTeachers,
    approvedTeachers,
    totalTestSeries,
    approvedTestSeries,
    totalSubscriptions
  };
};

exports.getAllUsers = async (page, limit) => {
  const offset = (page - 1) * limit;
  const { count, rows } = await User.findAndCountAll({
    limit,
    offset,
    attributes: { exclude: ['password'] },
    order: [['createdAt', 'DESC']]
  });

  return {
    users: rows,
    pagination: {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit)
    }
  };
};

exports.approveTeacher = async (teacherId, adminId) => {
  if (adminId == teacherId) {
    throw new Error("Cannot approve yourself");
  }

  const teacher = await User.findByPk(teacherId);
  if (!teacher || teacher.role !== "TEACHER") {
    throw new Error("Teacher not found");
  }

  teacher.isApproved = true;
  await teacher.save();

  logAdminAction(adminId, "APPROVE_TEACHER", { teacherId });

  return teacher;
};

exports.getAllTestSeries = async (page, limit) => {
  const offset = (page - 1) * limit;
  const { count, rows } = await TestSeries.findAndCountAll({
    limit,
    offset,
    include: [{ model: User, as: 'teacher', attributes: ['name', 'email'] }],
    order: [['createdAt', 'DESC']]
  });

  return {
    testSeries: rows,
    pagination: {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit)
    }
  };
};

exports.approveTestSeries = async (testId, adminId) => {
  const test = await TestSeries.findByPk(testId);
  if (!test) {
    throw new Error("Test series not found");
  }

  test.isApproved = true;
  await test.save();

  logAdminAction(adminId, "APPROVE_TEST_SERIES", { testId });

  return test;
};

exports.getAnalytics = async () => {
  const totalUsers = await User.count();
  const activeUsers = await User.count({ where: { isActive: true } });
  const totalTestAttempts = await TestAttempt.count();
  const totalRevenue = await this.getRevenue();

  // Monthly growth (simplified)
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const newUsersLastMonth = await User.count({ where: { createdAt: { [Op.gte]: lastMonth } } });

  return {
    totalUsers,
    activeUsers,
    totalTestAttempts,
    totalRevenue,
    newUsersLastMonth
  };
};

exports.getRevenue = async () => {
  const activeSubscriptions = await Subscription.findAll({
    where: {
      status: "ACTIVE",
      expiresAt: { [Op.gt]: new Date() }
    }
  });

  let totalRevenue = 0;
  activeSubscriptions.forEach(sub => {
    totalRevenue += PRICING[sub.plan] || 0;
  });

  return totalRevenue;
};

// Additional method for blocking users (soft delete)
exports.blockUser = async (userId, adminId) => {
  if (adminId == userId) {
    throw new Error("Cannot block yourself");
  }

  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error("User not found");
  }

  user.isActive = false;
  await user.save();

  logAdminAction(adminId, "BLOCK_USER", { userId });

  return user;
};
