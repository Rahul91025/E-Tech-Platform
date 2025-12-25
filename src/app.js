// Ye hai main Express app setup, routes aur middlewares ko register karta hai.
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const app = express();

app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later."
});

app.use(limiter);

app.use("/api/v1/auth", require("./routes/auth.routes"));
app.use("/api/v1/tests", require("./routes/test.routes"));
app.use("/api/v1/admin", require("./routes/admin.routes"));
app.use("/api/v1/attempts", require("./routes/testAttempt.routes"));
app.use("/api/v1/subscriptions", require("./routes/subscription.routes"));
app.use("/api/v1/teacher", require("./routes/teacher.routes"));

app.use(require("./middlewares/error.middleware"));

module.exports = app;
