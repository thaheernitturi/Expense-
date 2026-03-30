const { Expense } = require("../models");

exports.downloadReport = async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      where: { UserId: req.userId },
    });

    let csv = "Date,Description,Category,Amount\n";

    expenses.forEach((e) => {
      csv += `${e.createdAt},${e.description},${e.category},${e.amount}\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=report.csv");

    res.send(csv);

  } catch {
    res.status(500).json({ message: "Error generating report" });
  }
};