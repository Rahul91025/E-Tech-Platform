// Ye subscription model hai jo subscriptions ko define karta hai.
module.exports = (sequelize, DataTypes) => {
  const Subscription = sequelize.define("Subscription", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    plan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("ACTIVE", "CANCELLED", "EXPIRED", "PENDING"),
      defaultValue: "PENDING",
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    paymentMethod: {
      type: DataTypes.ENUM("RAZORPAY", "STRIPE"),
      allowNull: true,
    },
    paymentId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    orderId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: "INR",
    },
  });

  Subscription.associate = (models) => {
    Subscription.belongsTo(models.User, { foreignKey: "userId" });
  };

  return Subscription;
};
