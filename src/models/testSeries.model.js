// Ye testSeries.model model hai jo testSeries.model ko define karta hai.
module.exports = (sequelize, DataTypes) =>
  sequelize.define("TestSeries", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    isPaid: { type: DataTypes.BOOLEAN, defaultValue: false },
    price: { type: DataTypes.FLOAT, defaultValue: 0 },
    createdBy: DataTypes.INTEGER,
    isApproved: { type: DataTypes.BOOLEAN, defaultValue: false },
    status: {
      type: DataTypes.ENUM('DRAFT', 'PUBLISHED'),
      defaultValue: 'DRAFT'
    }
  });

