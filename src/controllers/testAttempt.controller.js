// Ye test attempt controller hai jo test attempts ko start, submit aur retrieve karta hai.
const testAttemptService = require("../services/testAttempt.service");


// Ye function test attempt ke liye questions ko fetch karta hai.
exports.getQuestions = async (req, res, next) => {
  try {
    const questions = await testAttemptService.getQuestionsForAttempt(req.params.testId);
    res.json(questions);
  } catch (err) {
    next(err);
  }
};


// Ye function ek naya test attempt start karta hai user ke liye.
exports.startTest = async (req, res, next) => {
  try {
    const attempt = await testAttemptService.startAttempt(
      req.user.id,
      req.params.testId
    );

    res.status(201).json({
      attemptId: attempt.id,
      message: "Test started"
    });
  } catch (err) {
    next(err);
  }
};


// Ye function test attempt ko submit karta hai aur result calculate karta hai.
exports.submitTest = async (req, res, next) => {
  try {
    const result = await testAttemptService.submitAttempt(
      req.params.attemptId,
      req.body.answers
    );

    res.json({
      message: "Test submitted successfully",
      result
    });
  } catch (err) {
    next(err);
  }
};


// Ye function user ke sare test attempts ko fetch karta hai.
exports.getUserAttempts = async (req, res, next) => {
  try {
    const attempts = await testAttemptService.getUserAttempts(req.user.id);
    res.json(attempts);
  } catch (err) {
    next(err);
  }
};


// Ye function ek specific test attempt ke details ko fetch karta hai.
exports.getAttemptDetails = async (req, res, next) => {
  try {
    const attempt = await testAttemptService.getAttemptDetails(req.params.attemptId, req.user.id);
    if (!attempt) return res.status(404).json({ message: "Attempt not found" });
    res.json(attempt);
  } catch (err) {
    next(err);
  }
};
