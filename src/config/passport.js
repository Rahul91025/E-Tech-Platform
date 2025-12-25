// Ye Passport setup karta hai for Google OAuth authentication.
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { User } = require("../models");

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback"
      },
      async (_, __, profile, done) => {
        const email = profile.emails[0].value;

        let user = await User.findOne({ where: { email } });
        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email,
            role: "STUDENT"
          });
        }
        done(null, user);
      }
    )
  );
}
