// Ye question model hai jo questions ko define karta hai.
module.exports = (sequelize, DataTypes) =>
  sequelize.define("Question", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    testSeriesId: { type: DataTypes.INTEGER, allowNull: false },
    questionText: DataTypes.TEXT,
    options: DataTypes.JSON, // { A: "", B: "", C: "", D: "" }
    correctOption: DataTypes.STRING // Never sent to client
  });
