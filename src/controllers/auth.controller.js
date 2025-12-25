// Ye auth controller hai jo login, register aur google auth handle karta hai.
const passport = require("passport");
const authService = require("../services/auth.service");

exports.register = async (req, res, next) => {
  try {
    const token = await authService.register(req.body);
    res.json({ token });
  } catch (e) {
    next(e);
  }
};

exports.login = async (req, res, next) => {
  try {
    const token = await authService.login(req.body);
    res.json({ token });
  } catch (e) {
    next(e);
  }
};

exports.googleAuth = passport.authenticate("google", { scope: ["profile", "email"] });

exports.googleAuthCallback = (req, res, next) => {
  passport.authenticate("google", { session: false }, async (err, user) => {
    if (err || !user) return res.status(401).json({ error: "Authentication failed" });
    try {
      const token = require("../utils/jwt").signToken(user);
      res.json({ token });
    } catch (e) {
      next(e);
    }
  })(req, res, next);
};
