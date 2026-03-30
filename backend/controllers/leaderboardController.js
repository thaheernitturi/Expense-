const User = require("../models/user");

// 🏆 Leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    // 🔥 PREMIUM CHECK
    if (!req.user.isPremium) {
      return res.status(403).json({ message: "Not premium user" });
    }

    const users = await User.findAll({
      attributes: ["name", "totalExpense"],
      order: [["totalExpense", "DESC"]],
    });

    res.json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};