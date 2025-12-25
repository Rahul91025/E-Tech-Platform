// Ye test attempt model hai jo test attempts ko define karta hai.
module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "TestAttempt",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      score: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      totalQuestions: {
        type: DataTypes.INTEGER
      },
      correctAnswers: {
        type: DataTypes.INTEGER
      },
      status: {
        type: DataTypes.ENUM("IN_PROGRESS", "COMPLETED"),
        defaultValue: "IN_PROGRESS"
      }
    },
    {
      timestamps: true,
      indexes: [
        {
          fields: ['userId']
        }
      ]
    }
  );
