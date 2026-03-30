const User = require("./user");
const Expense = require("./expense");
const Order = require("./order");
const ForgotPasswordRequest = require("./forgotPasswordRequest");

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForgotPasswordRequest);
ForgotPasswordRequest.belongsTo(User);


module.exports = { User, Expense, Order, ForgotPasswordRequest };