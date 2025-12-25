// Ye subscription.routes routes hai jo subscription.routes related routes define karta hai.
const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const { subscriptionSchema, paymentOrderSchema, paymentVerifySchema } = require("../utils/validationSchemas");
const controller = require("../controllers/subscription.controller");

router.post("/", auth, validate(subscriptionSchema), controller.createSubscription);
router.get("/", auth, controller.getUserSubscriptions);
router.get("/check", auth, controller.checkSubscription);
router.put("/:id/cancel", auth, controller.cancelSubscription);

// Payment routes
router.post("/payment/order", auth, validate(paymentOrderSchema), controller.createPaymentOrder);
router.post("/payment/verify", auth, validate(paymentVerifySchema), controller.verifyPayment);

module.exports = router;

