const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const familySchema = new mongoose.Schema({
  familyId: String,
  income: Number,
  savings: Number,
  dependents: Number,
  monthlyExpenses: Number,
  loanPayments: Number,
  creditCardSpending: Number,
  financialGoalsMet: Number,
});

const transactionSchema = new mongoose.Schema({
  memberId: String,
  familyId: String,
  category: String,
  amount: Number,
  date: Date,
});

const Family = mongoose.model("Family", familySchema);
const Transaction = mongoose.model("Transaction", transactionSchema);

// API Endpoints

// 1. Member Contribution Analysis
app.post("/api/contribution", async (req, res) => {
  const { familyId } = req.body;

  const transactions = await Transaction.find({ familyId });
  const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);
  const memberExpenses = {};

  transactions.forEach((t) => {
    memberExpenses[t.memberId] = (memberExpenses[t.memberId] || 0) + t.amount;
  });

  const highestSpender = Object.keys(memberExpenses).reduce((a, b) =>
    memberExpenses[a] > memberExpenses[b] ? a : b
  );

  const contributions = Object.entries(memberExpenses).map(([memberId, amount]) => ({
    memberId,
    contribution: ((amount / totalExpenses) * 100).toFixed(2),
  }));

  res.json({
    totalExpenses,
    contributions,
    highestSpender,
  });
});

// 2. Savings Optimization Logic
app.post("/api/savings", async (req, res) => {
  const { income, savings, totalExpenses, dependents } = req.body;

  const idealRatio = 0.5 - (dependents * 0.05); // Example formula
  const idealExpenses = income * idealRatio;

  res.json({
    suggestedSavingsPercentage: (((income - idealExpenses) / income) * 100).toFixed(2),
    overspending: totalExpenses > idealExpenses,
  });
});

// 3. Add Transaction
app.post("/api/transaction", async (req, res) => {
  const { familyId, memberId, category, amount, date } = req.body;

  const newTransaction = new Transaction({ familyId, memberId, category, amount, date });
  await newTransaction.save();

  res.json({ success: true });
});

// Server Listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
