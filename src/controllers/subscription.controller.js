// Ye subscription.controller hai jo subscription.controller related operations handle karta hai.
const subscriptionService = require("../services/subscription.service");

exports.createSubscription = async (req, res, next) => {
  try {
    const subscription = await subscriptionService.createSubscription(
      req.user.id,
      req.body.plan
    );
    res.json({ message: "Subscription created", subscription });
  } catch (e) {
    next(e);
  }
};

exports.getUserSubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await subscriptionService.getUserSubscriptions(
      req.user.id
    );
    res.json(subscriptions);
  } catch (e) {
    next(e);
  }
};

exports.checkSubscription = async (req, res, next) => {
  try {
    const hasActive = await subscriptionService.checkActiveSubscription(
      req.user.id
    );
    res.json({ hasActiveSubscription: hasActive });
  } catch (e) {
    next(e);
  }
};

exports.cancelSubscription = async (req, res, next) => {
  try {
    await subscriptionService.cancelSubscription(req.params.id, req.user.id);
    res.json({ message: "Subscription cancelled" });
  } catch (e) {
    next(e);
  }
};


exports.createPaymentOrder = async (req, res, next) => {
  try {
    const { amount, currency, paymentMethod } = req.body;

    let order;
    if (paymentMethod === "RAZORPAY") {
      order = await subscriptionService.createRazorpayOrder(amount, currency);
    } else if (paymentMethod === "STRIPE") {
      order = await subscriptionService.createStripePaymentIntent(amount, currency);
    } else {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    
    const subscription = await subscriptionService.createSubscription(
      req.user.id,
      req.body.plan || "premium"
    );

    res.json({
      order,
      subscriptionId: subscription.id,
      paymentMethod
    });
  } catch (e) {
    next(e);
  }
};

exports.verifyPayment = async (req, res, next) => {
  try {
    const { paymentId, orderId, signature, subscriptionId, paymentMethod } = req.body;

    let isVerified = false;
    if (paymentMethod === "RAZORPAY") {
      isVerified = await subscriptionService.verifyRazorpayPayment(paymentId, orderId, signature);
    } else if (paymentMethod === "STRIPE") {
      isVerified = await subscriptionService.confirmStripePayment(paymentId);
    }

    if (!isVerified) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    
    const subscription = await subscriptionService.activateSubscription(subscriptionId, {
      paymentId,
      orderId,
      amount: req.body.amount,
      currency: req.body.currency || "INR",
      paymentMethod
    });

    res.json({
      message: "Payment verified and subscription activated",
      subscription
    });
  } catch (e) {
    next(e);
  }
};

