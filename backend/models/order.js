const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const Order = sequelize.define("Order", {
  orderId: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  status: {
    type: Sequelize.STRING,
  },
});

module.exports = Order;