// Ye config file hai jo payment gateways jaise Razorpay aur Stripe ko setup karta hai.
const Razorpay = require("razorpay");
const Stripe = require("stripe");

let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

let stripe = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
}

module.exports = {
  database: require("./db"),
  passport: require("./passport"),
  redisClient: require("./redis"),
  razorpay,
  stripe,
};
