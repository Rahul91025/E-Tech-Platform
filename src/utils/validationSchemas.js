// Ye validationSchemas utils hai jo validationSchemas operations handle karta hai.
const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("STUDENT", "TEACHER", "ADMIN").default("STUDENT")
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const testSeriesSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  isPaid: Joi.boolean().default(false),
  price: Joi.number().min(0).default(0)
});

const questionSchema = Joi.object({
  questionText: Joi.string().required(),
  options: Joi.object({
    A: Joi.string().required(),
    B: Joi.string().required(),
    C: Joi.string().required(),
    D: Joi.string().required()
  }).required(),
  correctOption: Joi.string().valid("A", "B", "C", "D").required()
});

const testAttemptSchema = Joi.object({
  testSeriesId: Joi.number().integer().required(),
  answers: Joi.array().items(
    Joi.object({
      questionId: Joi.number().integer().required(),
      selectedOption: Joi.string().valid("A", "B", "C", "D").required()
    })
  ).required()
});

const subscriptionSchema = Joi.object({
  plan: Joi.string().required(),
  expiresAt: Joi.date().required()
});

const paymentOrderSchema = Joi.object({
  amount: Joi.number().min(0).required(),
  currency: Joi.string().default("INR"),
  paymentMethod: Joi.string().valid("RAZORPAY", "STRIPE").required(),
  plan: Joi.string().optional()
});

const paymentVerifySchema = Joi.object({
  paymentId: Joi.string().required(),
  orderId: Joi.string().required(),
  signature: Joi.string().required(),
  subscriptionId: Joi.number().integer().required(),
  paymentMethod: Joi.string().valid("RAZORPAY", "STRIPE").required(),
  amount: Joi.number().min(0).optional(),
  currency: Joi.string().optional()
});

module.exports = {
  registerSchema,
  loginSchema,
  testSeriesSchema,
  questionSchema,
  testAttemptSchema,
  subscriptionSchema,
  paymentOrderSchema,
  paymentVerifySchema
};

