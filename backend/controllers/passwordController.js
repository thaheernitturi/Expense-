const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

const {
  User,
  ForgotPasswordRequest,
} = require("../models");

const { sendEmail } = require("../services/emailService");


// ✅ FORGOT PASSWORD (SEND EMAIL)
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const id = uuidv4();

    await ForgotPasswordRequest.create({
      id,
      UserId: user.id,
      isActive: true,
    });

    const resetLink = `http://localhost:3000/password/resetpassword/${id}`;

    try {
  await sendEmail(
    email,
    `<h3>Reset Password</h3>
     <a href="${resetLink}">Click here to reset password</a>`
  );
} catch (err) {
  console.log("EMAIL FAILED:", err.message);
  console.log("RESET LINK:", resetLink);
}

    res.json({ message: "Reset link sent" });

  }catch (err) {
  console.log("FORGOT PASSWORD ERROR:", err);
  res.status(500).json({ message: "Error sending email" });
}
};


// ✅ RESET PASSWORD PAGE
exports.resetPasswordPage = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await ForgotPasswordRequest.findOne({
      where: { id },
    });

    if (!request || !request.isActive) {
      return res.status(400).send("Invalid or expired link");
    }

    res.send(`
      <form action="/password/updatepassword/${id}" method="POST">
        <input type="password" name="newpassword" placeholder="New Password" required />
        <button type="submit">Reset</button>
      </form>
    `);

  } catch {
    res.status(500).send("Error");
  }
};


// ✅ UPDATE PASSWORD
exports.updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newpassword } = req.body;

    const request = await ForgotPasswordRequest.findOne({
      where: { id },
    });

    if (!request || !request.isActive) {
      return res.status(400).json({ message: "Link expired" });
    }

    const user = await User.findByPk(request.UserId);

    const hashed = await bcrypt.hash(newpassword, 10);

    user.password = hashed;
    await user.save();

    request.isActive = false;
    await request.save();

    res.send("Password updated successfully");

  } catch {
    res.status(500).json({ message: "Error updating password" });
  }
};