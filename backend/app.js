const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");
const passwordRoutes = require("./routes/passwordRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRoutes);
app.use("/expense", expenseRoutes);
app.use("/purchase", purchaseRoutes);
app.use("/password", passwordRoutes);
app.use("/report", reportRoutes);
app.use("/leaderboard", leaderboardRoutes);
app.use(express.static("frontend"));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/login.html"));
});

app.get("/test", (req, res) => {
  res.send("Backend working");
});

module.exports = app;