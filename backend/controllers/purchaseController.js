const Order = require("../models/order");
const jwt = require("jsonwebtoken");

// 🔐 generate token
function generateToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      isPremium: user.isPremium, // ✅ FIXED
    },
    "secretkey"
  );
}

exports.buyPremium = async (req, res) => {
  try {
    const orderId = "order_" + Date.now();

    await Order.create({
      orderId,
      status: "PENDING",
      UserId: req.user.id,
    });

    res.status(201).json({
      orderId,
      amount: 100,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const order = await Order.findOne({ where: { orderId } });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (status === "SUCCESS") {
      await order.update({ status: "SUCCESSFUL" });

      // ✅ FIXED FIELD NAME
      await req.user.update({ isPremium: true });

      await req.user.reload(); // 🔥 IMPORTANT

      const token = generateToken(req.user);

      return res.json({
        message: "Transaction Successful",
        token,
      });
    } else {
      await order.update({ status: "FAILED" });
      return res.json({ message: "Transaction Failed" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};