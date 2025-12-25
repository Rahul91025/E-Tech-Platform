// Ye test.service service hai jo test.service related operations handle karta hai.
const { TestSeries, Question, User } = require("../models");
const { paginate } = require("../utils/pagination");
const subscriptionService = require("./subscription.service");

exports.listTests = async (page, limit, user) => {
  const hasSubscription = await subscriptionService.checkActiveSubscription(user.id);
  const where = hasSubscription ? {} : { isPaid: false };
  return TestSeries.findAndCountAll({
    ...paginate(page, limit),
    where
  });
};

exports.getTestSeriesById = async (id, user) => {
  const testSeries = await TestSeries.findByPk(id);
  if (!testSeries) return null;

  if (user.role === "STUDENT") {
    if (testSeries.status !== "PUBLISHED") {
      throw new Error("Test not available");
    }
    if (testSeries.isPaid) {
      const hasSubscription = await subscriptionService.checkActiveSubscription(user.id);
      if (!hasSubscription) {
        throw new Error("Subscription required for paid content");
      }
    }
    return testSeries;
  }

  if (user.role === "TEACHER") {
    if (testSeries.createdBy !== user.id) {
      throw new Error("Unauthorized");
    }
  }

  // For teachers/admins, include questions
  const questions = await Question.findAll({
    where: { testSeriesId: id }
  });
  return { ...testSeries.toJSON(), questions };
};

exports.createTestSeries = async (data, userId) => {
  return TestSeries.create({ ...data, createdBy: userId });
};

exports.updateTestSeries = async (id, data, user) => {
  const testSeries = await TestSeries.findByPk(id);
  if (!testSeries) throw new Error("Test series not found");
  if (testSeries.createdBy !== user.id) throw new Error("Unauthorized");
  if (user.role === "TEACHER" && testSeries.status !== "DRAFT") throw new Error("Cannot update published test");
  return testSeries.update(data);
};

exports.deleteTestSeries = async (id, userId) => {
  const testSeries = await TestSeries.findByPk(id);
  if (!testSeries) throw new Error("Test series not found");
  if (testSeries.createdBy !== userId) throw new Error("Unauthorized");
  await testSeries.destroy();
};

exports.approveTestSeries = async (id) => {
  const testSeries = await TestSeries.findByPk(id);
  if (!testSeries) throw new Error("Test series not found");
  testSeries.status = "PUBLISHED";
  await testSeries.save();
  return testSeries;
};

exports.getQuestionsForTest = async (id) => {
  return Question.findAll({
    where: { testSeriesId: id }
  });
};

