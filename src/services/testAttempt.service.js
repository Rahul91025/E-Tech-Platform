// Ye testAttempt.service service hai jo testAttempt.service related operations handle karta hai.
const { TestAttempt, Question, TestSeries } = require("../models");

/**
 * Get questions for a test without correct answers
 */
exports.getQuestionsForAttempt = async (testSeriesId) => {
  const questions = await Question.findAll({
    where: { testSeriesId },
    attributes: ['id', 'questionText', 'options']
  });

  return questions.map(q => ({
    id: q.id,
    questionText: q.questionText,
    options: q.options
  }));
};

/**
 * Start a test attempt
 */
exports.startAttempt = async (userId, testSeriesId) => {
  // Check subscription for paid tests
  const testSeries = await TestSeries.findByPk(testSeriesId);
  if (!testSeries) throw new Error("Test series not found");

  if (testSeries.isPaid) {
    const subscriptionService = require("../services/subscription.service");
    const hasSubscription = await subscriptionService.checkActiveSubscription(userId);
    if (!hasSubscription) {
      throw new Error("Subscription required for paid content");
    }
  }

  // Check if user already has an in-progress attempt
  const existingAttempt = await TestAttempt.findOne({
    where: { userId, testSeriesId, status: "IN_PROGRESS" }
  });

  if (existingAttempt) {
    throw new Error("You already have an in-progress attempt for this test");
  }

  const totalQuestions = await Question.count({
    where: { testSeriesId }
  });

  if (totalQuestions === 0)
    throw new Error("No questions available for this test");

  return TestAttempt.create({
    userId,
    testSeriesId,
    totalQuestions
  });
};

/**
 * Submit test answers & evaluate
 */
exports.submitAttempt = async (attemptId, answers) => {
  const attempt = await TestAttempt.findByPk(attemptId);
  if (!attempt) throw new Error("Attempt not found");

  if (attempt.status === "COMPLETED")
    throw new Error("Test already submitted");

  const questions = await Question.findAll({
    where: { testSeriesId: attempt.testSeriesId }
  });

  let correct = 0;

  questions.forEach((q) => {
    const userAnswer = answers[q.id];
    if (userAnswer && userAnswer === q.correctOption) {
      correct++;
    }
  });

  const score = Math.round((correct / questions.length) * 100);

  attempt.score = score;
  attempt.correctAnswers = correct;
  attempt.status = "COMPLETED";
  await attempt.save();

  return {
    score,
    correct,
    total: questions.length
  };
};

/**
 * Get user attempts
 */
exports.getUserAttempts = async (userId) => {
  return TestAttempt.findAll({
    where: { userId },
    include: [{ model: TestSeries, attributes: ['title', 'isPaid'] }],
    order: [['createdAt', 'DESC']]
  });
};

/**
 * Get attempt details
 */
exports.getAttemptDetails = async (attemptId, userId) => {
  return TestAttempt.findOne({
    where: { id: attemptId, userId },
    include: [{ model: TestSeries, attributes: ['title', 'description'] }]
  });
};

