// Ye user model hai jo users ko define karta hai.
module.exports = (sequelize, DataTypes) =>
  sequelize.define("User", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true },
    password: { type: DataTypes.STRING, allowNull: true },
    role: {
      type: DataTypes.ENUM("STUDENT", "TEACHER", "ADMIN"),
      defaultValue: "STUDENT"
    },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    isApproved: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, { timestamps: true });
