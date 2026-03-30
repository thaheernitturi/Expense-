const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
  name: {
  type: DataTypes.STRING,
  allowNull: false,   // ✅ prevents null forever
  },
  email: { type: DataTypes.STRING, unique: true },
  password: DataTypes.STRING,
  isPremium: { type: DataTypes.BOOLEAN, defaultValue: false },
  totalExpense: { type: DataTypes.INTEGER, defaultValue: 0 },
});



module.exports = User;