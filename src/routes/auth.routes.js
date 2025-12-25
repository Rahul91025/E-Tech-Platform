// Ye auth.routes routes hai jo auth.routes related routes define karta hai.
const router = require("express").Router();
const passport = require("passport");
const validate = require("../middlewares/validate.middleware");
const { registerSchema, loginSchema } = require("../utils/validationSchemas");
const controller = require("../controllers/auth.controller");

router.post("/register", validate(registerSchema), controller.register);
router.post("/login", validate(loginSchema), controller.login);

// Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { session: false }), controller.googleAuthCallback);

module.exports = router;

