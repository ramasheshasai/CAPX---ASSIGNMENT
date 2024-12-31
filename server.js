const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Dummy database to store portfolio
let portfolio = [];

// Fetch stock prices from an API
app.get("/api/stock-price/:ticker", async (req, res) => {
  const { ticker } = req.params;
  const apiKey = "ctmmlc9r01qjlgiqg2o0ctmmlc9r01qjlgiqg2og"; // Replace with your Finnhub API key

  try {
    const response = await axios.get(
      `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${apiKey}`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching stock price:", error);
    res.status(500).json({ error: "Failed to fetch stock price" });
  }
});

// Get the current portfolio
app.get("/api/portfolio", (req, res) => {
  res.json(portfolio);
});

// Add or update a stock in the portfolio
app.post("/api/portfolio", (req, res) => {
  const { id, name, ticker, quantity } = req.body;

  const existingStock = portfolio.find((stock) => stock.id === id);

  if (existingStock) {
    // Update existing stock
    existingStock.quantity = quantity;
    res.json({ message: "Stock updated", stock: existingStock });
  } else {
    // Add new stock
    const newStock = { id: Date.now(), name, ticker, quantity };
    portfolio.push(newStock);
    res.json({ message: "Stock added", stock: newStock });
  }
});

// Delete a stock from the portfolio
app.delete("/api/portfolio/:id", (req, res) => {
  const { id } = req.params;
  portfolio = portfolio.filter((stock) => stock.id !== parseInt(id));
  res.json({ message: "Stock deleted" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
