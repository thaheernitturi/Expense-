const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Expense = sequelize.define("Expense", {
  amount: DataTypes.INTEGER,
  description: DataTypes.STRING,
  category: DataTypes.STRING,
  note: DataTypes.STRING,
  category: {
  type: DataTypes.STRING,
  defaultValue: "Other",
},
});

module.exports = Expense;