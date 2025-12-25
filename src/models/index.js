// Ye index model hai jo index ko define karta hai.
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

// Models ko import kar rahe hain.
const User = require("./user.model")(sequelize, DataTypes);
const TestSeries = require("./testSeries.model")(sequelize, DataTypes);
const Question = require("./question.model")(sequelize, DataTypes);
const TestAttempt = require("./testAttempt.model")(sequelize, DataTypes);
const Subscription = require("./subscription.model")(sequelize, DataTypes);

// Associations
User.hasMany(TestSeries, { foreignKey: "createdBy" });
TestSeries.belongsTo(User, { foreignKey: "createdBy" });

TestSeries.hasMany(Question, { foreignKey: "testSeriesId" });
Question.belongsTo(TestSeries, { foreignKey: "testSeriesId" });

User.hasMany(TestAttempt, { foreignKey: "userId" });
TestAttempt.belongsTo(User, { foreignKey: "userId" });

TestSeries.hasMany(TestAttempt, { foreignKey: "testSeriesId" });
TestAttempt.belongsTo(TestSeries, { foreignKey: "testSeriesId" });

User.hasMany(Subscription, { foreignKey: "userId" });
Subscription.belongsTo(User, { foreignKey: "userId" });

module.exports = {
  sequelize,
  User,
  TestSeries,
  Question,
  TestAttempt,
  Subscription
};

