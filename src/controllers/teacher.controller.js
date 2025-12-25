// Ye teacher controller hai jo questions add, test update aur analytics handle karta hai.
const testService = require("../services/test.service");
const { Question } = require("../models");

// Ye function ek naya question add karta hai test series mein, jo teacher ke dwara diya gaya data use karta hai.
exports.addQuestion = async (req, res, next) => {
  try {
    const question = await Question.create({
      ...req.body,
      testSeriesId: req.params.testId
    });
    res.status(201).json(question);
  } catch (e) {
    next(e);
  }
};

// Ye function test series ko update karta hai, jaise title, description, etc., teacher ke dwara.
exports.updateTest = async (req, res, next) => {
  try {
    const data = await testService.updateTestSeries(req.params.id, req.body, req.user);
    res.json(data);
  } catch (e) {
    next(e);
  }
};

// Ye function teacher ke test series ke liye analytics data provide karta hai, jaise attempts count aur average score.
exports.getAnalytics = async (req, res, next) => {
  try {

    const { TestAttempt, TestSeries } = require("../models");
    const analytics = await TestAttempt.findAll({
      include: [{
        model: TestSeries,
        where: { createdBy: req.user.id },
        attributes: ['title']
      }],
      attributes: [
        [require("sequelize").fn('COUNT', require("sequelize").col('TestAttempt.id')), 'attempts'],
        [require("sequelize").fn('AVG', require("sequelize").col('score')), 'avgScore']
      ],
      group: ['TestSeries.id', 'TestSeries.title']
    });
    res.json(analytics);
  } catch (e) {
    next(e);
  }
};
