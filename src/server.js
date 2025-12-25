// Ye server start karta hai, database connect karta hai aur app ko run karta hai.
require('dotenv').config();
require("./config");
const app = require("./app");
const { sequelize } = require("./models");

sequelize.sync().then(() => {
  console.log('Database connected successfully');
  app.listen(process.env.PORT, () =>
    console.log(`Server running on ${process.env.PORT}`)
  );
}).catch((err) => {
  console.error('Database connection failed:', err.message);
});
