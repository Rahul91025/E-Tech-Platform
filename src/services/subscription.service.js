// Ye subscription.service service hai jo subscription.service related operations handle karta hai.
const { Subscription } = require("../models");
const { razorpay, stripe } = require("../config");

exports.createSubscription = async (userId, plan) => {
  // Cancel any existing active subscription
  await Subscription.update(
    { status: "CANCELLED" },
    { where: { userId, status: "ACTIVE" } }
  );

  return Subscription.create({
    userId,
    plan,
    expiresAt: new Date(Date.now() + 30 * 86400000) // 30 days
  });
};

exports.getUserSubscriptions = async (userId) => {
  return Subscription.findAll({
    where: { userId },
    order: [['createdAt', 'DESC']]
  });
};

exports.checkActiveSubscription = async (userId) => {
  const subscription = await Subscription.findOne({
    where: {
      userId,
      status: "ACTIVE",
      expiresAt: { [require("sequelize").Op.gt]: new Date() }
    }
  });
  return !!subscription;
};

exports.cancelSubscription = async (subscriptionId, userId) => {
  const subscription = await Subscription.findOne({
    where: { id: subscriptionId, userId, status: "ACTIVE" }
  });

  if (!subscription) throw new Error("Subscription not found");

  subscription.status = "CANCELLED";
  await subscription.save();
};

// Payment processing methods
exports.createRazorpayOrder = async (amount, currency = "INR") => {
  const options = {
    amount: amount * 100, // Razorpay expects amount in paisa
    currency,
    receipt: `receipt_${Date.now()}`,
  };

  const order = await razorpay.orders.create(options);
  return order;
};

exports.verifyRazorpayPayment = async (paymentId, orderId, signature) => {
  const crypto = require("crypto");
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(orderId + "|" + paymentId)
    .digest("hex");

  return expectedSignature === signature;
};

exports.createStripePaymentIntent = async (amount, currency = "inr") => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // Stripe expects amount in cents
    currency,
    metadata: { integration_check: "accept_a_payment" },
  });

  return paymentIntent;
};

exports.confirmStripePayment = async (paymentIntentId) => {
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  return paymentIntent.status === "succeeded";
};

exports.activateSubscription = async (subscriptionId, paymentDetails) => {
  const subscription = await Subscription.findByPk(subscriptionId);
  if (!subscription) throw new Error("Subscription not found");

  subscription.status = "ACTIVE";
  subscription.paymentId = paymentDetails.paymentId;
  subscription.orderId = paymentDetails.orderId;
  subscription.amount = paymentDetails.amount;
  subscription.currency = paymentDetails.currency;

  await subscription.save();
  return subscription;
};

