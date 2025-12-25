// Ye subscription middleware hai jo active subscription check karta hai.
const subscriptionService = require("../services/subscription.service");

const subscriptionRequired = async (req, res, next) => {
  try {
    const hasActive = await subscriptionService.checkActiveSubscription(req.user.id);
    if (!hasActive) {
      return res.status(403).json({ message: "Active subscription required" });
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  subscriptionRequired
};
