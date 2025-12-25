// Ye testAttempt.routes routes hai jo testAttempt.routes related routes define karta hai.
const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const { subscriptionRequired } = require("../middlewares/subscription.middleware");
const controller = require("../controllers/testAttempt.controller");
const validate = require("../middlewares/validate.middleware");
const Joi = require("joi");

/**
 * Start Test
 */
router.post(
  "/start/:testId",
  auth,
  role("STUDENT"),
  subscriptionRequired,
  controller.startTest
);

/**
 * Submit Test
 */
router.post(
  "/submit/:attemptId",
  auth,
  role("STUDENT"),
  subscriptionRequired,
  validate(
    Joi.object({
      answers: Joi.object().required()
    })
  ),
  controller.submitTest
);

module.exports = router;

