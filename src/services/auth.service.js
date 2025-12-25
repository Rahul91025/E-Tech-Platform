// Ye auth service hai jo authentication related operations handle karta hai.
const bcrypt = require("bcrypt");
const { User } = require("../models");
const { signToken } = require("../utils/jwt");

exports.register = async (data) => {
  data.password = await bcrypt.hash(data.password, 10);
  if (data.role === "TEACHER") {
    data.isApproved = false;
  } else if (data.role === "STUDENT") {
    data.isApproved = true;
  }
  const user = await User.create(data);
  return signToken(user);
};

exports.login = async (data) => {
  const { email, password } = data;
  const user = await User.findOne({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error("Invalid credentials");
  }
  if (user.role === "TEACHER" && !user.isApproved) {
    throw new Error("Account not approved yet");
  }
  return signToken(user);
};
