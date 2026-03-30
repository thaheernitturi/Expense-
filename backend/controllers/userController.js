const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ where: { email } });
  if (exists) return res.json({ message: "User exists" });

  const hashed = await bcrypt.hash(password, 10);

  await User.create({ name, email, password: hashed });

  res.json({ message: "Signup success" });
};

// 🔑 LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔍 find user
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔐 check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // ✅ SAFE TOKEN
    const token = jwt.sign(
      {
        userId: user.id,
        isPremium: user.isPremium || false, // 🔥 prevents crash
      },
      "secretkey"
    );

    return res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    console.log("LOGIN ERROR:", err); // 🔥 IMPORTANT
    return res.status(500).json({ message: "Login failed" });
  }
};