const { Expense } = require("../models");
const { getCategory } = require("../services/aiService"); // 🧠 AI

// ➕ ADD EXPENSE
exports.addExpense = async (req, res) => {
  try {
    const { amount, description, note } = req.body;

    // 🧠 AI CATEGORY
    const category = await getCategory(description);

    const expense = await Expense.create({
      amount,
      description,
      note,
      category, // 🔥 NEW FIELD
      UserId: req.user.id,
    });

    // 🔥 UPDATE USER TOTAL
    req.user.totalExpense =
      Number(req.user.totalExpense || 0) + Number(amount);
    await req.user.save();

    res.status(201).json(expense);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

// 📊 GET EXPENSES
exports.getExpenses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const expenses = await Expense.findAll({
      where: { UserId: req.user.id },
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    res.json({ expenses });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

// ❌ DELETE
exports.deleteExpense = async (req, res) => {
  try {
    const id = req.params.id;

    const expense = await Expense.findOne({
      where: { id, UserId: req.user.id },
    });

    if (!expense) {
      return res.status(404).json({ message: "Not found" });
    }

    // 🔥 DECREASE TOTAL
    req.user.totalExpense -= expense.amount;
    await req.user.save();

    await expense.destroy();

    res.json({ message: "Deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};
// 🧠 AI INSIGHTS
exports.getInsights = async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      where: { UserId: req.user.id },
    });

    if (expenses.length === 0) {
      return res.json({
        message: "No expenses yet. Start tracking!",
      });
    }

    let total = 0;
    let categoryTotals = {};

    expenses.forEach((e) => {
      total += Number(e.amount);

      categoryTotals[e.category] =
        (categoryTotals[e.category] || 0) + Number(e.amount);
    });

    // 🔥 find highest category
    let topCategory = Object.keys(categoryTotals).reduce((a, b) =>
      categoryTotals[a] > categoryTotals[b] ? a : b
    );

    let insight = `💡 You spend most on ${topCategory}`;

    // 🔥 suggestion logic
    if (topCategory === "Food") {
      insight += " 🍔. Try reducing eating out.";
    } else if (topCategory === "Travel") {
      insight += " 🚕. Consider saving on transport.";
    } else if (topCategory === "Shopping") {
      insight += " 🛍️. Avoid unnecessary purchases.";
    } else {
      insight += " 💸. Track your expenses carefully.";
    }

    res.json({
      total,
      topCategory,
      insight,
      categoryTotals,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

exports.categorizeExpense = async (req, res) => {
  try {
    const { description } = req.body;

    if (!description) {
      return res.json({ category: "Other 💸" });
    }

    const category = await getCategory(description);

    res.json({ category });
  } catch (err) {
    console.log(err);
    res.json({ category: "Other 💸" });
  }
};