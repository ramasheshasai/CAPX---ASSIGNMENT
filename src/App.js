import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const App = () => {
  const API_KEY = "ctmmlc9r01qjlgiqg2o0ctmmlc9r01qjlgiqg2og"; // Replace with your Alpha Vantage API key

  const defaultStocks = [
    { id: 1, name: "Amazon", ticker: "AMZN" },
    { id: 2, name: "Apple", ticker: "AAPL" },
    { id: 3, name: "Tesla", ticker: "TSLA" },
    { id: 4, name: "Microsoft", ticker: "MSFT" },
    { id: 5, name: "Google", ticker: "GOOGL" },
    { id: 6, name: "Nike", ticker: "NKE" },
    { id: 7, name: "Disney", ticker: "DIS" },
    { id: 8, name: "NVIDIA", ticker: "NVDA" },
  ];

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: "", email: "", password: "" });
  const [portfolio, setPortfolio] = useState([]);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [form, setForm] = useState({ id: null, name: "", quantity: 1 });
  const [metrics, setMetrics] = useState({
    topStock: null,
    distribution: {},
  });

  // Handle login authentication
  const handleLogin = () => {
    const { username, email, password } = loginForm;

    if (username.trim() !== "" && email.trim() !== "" && password.trim() !== "") {
      setIsAuthenticated(true);
    } else {
      alert("Please enter username, email, and password!");
    }
  };

  
  // Fetch stock prices
  const fetchStockPrices = async (tickers) => {
    try {
      const responses = await Promise.all(
        tickers.map((ticker) =>
          fetch(
            `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${API_KEY}`
          ).then((res) => res.json())
        )
      );

      const updatedPortfolio = portfolio.map((stock, index) => {
        const globalQuote = responses[index]["Global Quote"];
        const currentPrice = parseFloat(globalQuote["05. price"] || 0);

        return {
          ...stock,
          currentPrice,
        };
      });

      setPortfolio(updatedPortfolio);
      calculateMetrics(updatedPortfolio);
      calculatePortfolioValue(updatedPortfolio);
    } catch (error) {
      console.error("Error fetching stock prices:", error);
    }
  };

  // Calculate portfolio value
  const calculatePortfolioValue = (portfolio) => {
    const totalValue = portfolio.reduce(
      (sum, stock) => sum + (stock.quantity || 0) * (stock.currentPrice || 0),
      0
    );
    setPortfolioValue(totalValue);
  };

  // Calculate metrics
  const calculateMetrics = (portfolio) => {
    if (portfolio.length === 0) return;

    // Top-performing stock
    const topStock = portfolio.reduce(
      (top, stock) =>
        (stock.currentPrice || 0) > (top.currentPrice || 0) ? stock : top,
      portfolio[0]
    );

    // Portfolio distribution
    const distribution = portfolio.reduce((acc, stock) => {
      acc[stock.name] =
        ((stock.quantity * stock.currentPrice) / portfolioValue) * 100 || 0;
      return acc;
    }, {});

    setMetrics({ topStock, distribution });
  };

  // Initialize portfolio with 5 random stocks
  const initializePortfolio = () => {
    const selectedStocks = [...defaultStocks]
      .sort(() => Math.random() - 0.5)
      .slice(0, 5)
      .map((stock) => ({ ...stock, quantity: 1 }));
    setPortfolio(selectedStocks);
  };

  // Add/Edit stock
  const handleAddEditStock = () => {
    const selectedStock = defaultStocks.find(
      (stock) => stock.name === form.name
    );
    if (!selectedStock) {
      alert("Invalid stock selected.");
      return;
    }
    const updatedPortfolio = form.id
      ? portfolio.map((stock) =>
          stock.id === form.id
            ? { ...form, ticker: selectedStock.ticker }
            : stock
        )
      : [
          ...portfolio,
          {
            id: Date.now(),
            name: form.name,
            ticker: selectedStock.ticker,
            quantity: form.quantity,
          },
        ];
    setPortfolio(updatedPortfolio);
    setForm({ id: null, name: "", quantity: 1 });
  };

  // Delete stock
  const handleDeleteStock = (id) => {
    const updatedPortfolio = portfolio.filter((stock) => stock.id !== id);
    setPortfolio(updatedPortfolio);
  };

  // Generate chart data
  const generateChartData = () =>
    portfolio.map((stock) => ({
      name: stock.name,
      value: (stock.quantity || 0) * (stock.currentPrice || 0),
    }));

  // Fetch prices when portfolio changes
  useEffect(() => {
    const tickers = portfolio.map((stock) => stock.ticker);
    if (tickers.length > 0) {
      fetchStockPrices(tickers);
    }
  }, [portfolio.length]); // Trigger only when portfolio length changes

  // Recalculate metrics and value only when portfolio updates
  useEffect(() => {
    if (portfolio.length > 0) {
      calculatePortfolioValue(portfolio);
      calculateMetrics(portfolio);
    }
  }, [portfolio]);

  // Initialize portfolio on first render
  useEffect(() => {
    initializePortfolio();
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="auth-container container my-5">
        <header className="text-center mb-4">
          <h1 className="display-4">Login</h1>
          <p className="lead">Please enter your credentials to access your portfolio.</p>
        </header>
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow-lg p-4 rounded-3">
              <div className="card-body">
                <form>
                  <div className="mb-4">
                    <label htmlFor="username" className="form-label">
                      <i className="bi bi-person-fill"></i> Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      className="form-control"
                      value={loginForm.username}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, username: e.target.value })
                      }
                      placeholder="Enter your username"
                    />
                  </div>
  
                  <div className="mb-4">
                    <label htmlFor="email" className="form-label">
                      <i className="bi bi-envelope-fill"></i> Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="form-control"
                      value={loginForm.email}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, email: e.target.value })
                      }
                      placeholder="Enter your email"
                    />
                  </div>
  
                  <div className="mb-4">
                    <label htmlFor="password" className="form-label">
                      <i className="bi bi-lock-fill"></i> Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      className="form-control"
                      value={loginForm.password}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, password: e.target.value })
                      }
                      placeholder="Enter your password"
                    />
                  </div>
  
                  <div className="d-grid gap-2">
                    <button className="btn btn-primary btn-lg" onClick={handleLogin}>
                      <i className="bi bi-box-arrow-in-right"></i> Login
                    </button>
                  </div>
                </form>
  
                
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="app container my-4">
      <header className="text-center">
        <h1 className="mb-4">Portfolio Tracker</h1>
      </header>
      <div className="d-flex justify-content-center">
        <div className="row w-100">
          {/* Stock Holdings Section */}
          <div className="col-md-6 mb-5">
            <section className="stock-holdings-section">
              <h2>Stock Holdings</h2>
              <div className="d-flex flex-column">
                {portfolio.map((stock) => (
                  <div key={stock.id} className="card mb-2">
                    <div className="card-body">
                      <h5 className="card-title">{stock.name}</h5>
                      <h6 className="card-subtitle mb-2 text-muted">{stock.ticker}</h6>
                      <p className="card-text">
                        <strong>Quantity:</strong> {stock.quantity}
                      </p>
                      <p className="card-text">
                        <strong>Current Price:</strong>{" "}
                        {stock.currentPrice ? `$${stock.currentPrice.toFixed(2)}` : "Loading..."}
                      </p>
                      <div className="d-flex justify-content-between">
                        <button
                          className="btn btn-sm btn-primary me-2"
                          onClick={() => setForm(stock)}
                        >
                          <i className="bi bi-pencil"></i> Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteStock(stock.id)}
                        >
                          <i className="bi bi-trash"></i> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Add/Edit Stock Section */}
          <div className="col-md-6 mb-5">
            <section className="form-section mb-5">
              <h2>Add/Edit Stock</h2>
              <div className="mb-3">
                <label className="form-label">Stock Name</label>
                <select
                  name="name"
                  className="form-select"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                >
                  <option value="">Select a stock</option>
                  {defaultStocks.map((stock) => (
                    <option key={stock.id} value={stock.name}>
                      {stock.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Quantity</label>
                <input
                  type="number"
                  className="form-control"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                />
              </div>
              <button className="btn btn-primary" onClick={handleAddEditStock}>
                {form.id ? "Update Stock" : "Add Stock"}
              </button>
            </section>

            {/* Portfolio Value Chart */}
            <section className="chart-section mb-5">
              <h2>Portfolio Value Chart</h2>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={generateChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </section>

            {/* Stock Portfolio Table */}
            <section className="table-section mt-4">
              <h2>Stock Portfolio</h2>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Ticker</th>
                    <th>Quantity</th>
                    <th>Current Price</th>
                    <th>Total Value</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolio.map((stock) => (
                    <tr key={stock.id}>
                      <td>{stock.name}</td>
                      <td>{stock.ticker}</td>
                      <td>{stock.quantity}</td>
                      <td>
                        {stock.currentPrice ? `$${stock.currentPrice.toFixed(2)}` : "Loading..."}
                      </td>
                      <td>{(stock.quantity * stock.currentPrice).toFixed(2)}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteStock(stock.id)}
                        >
                          <i className="bi bi-trash"></i> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;