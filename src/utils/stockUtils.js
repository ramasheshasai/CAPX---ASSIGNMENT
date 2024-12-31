export const initializePortfolio = () => {
    return []; // Initial empty portfolio
  };
  
  export const fetchStockPrices = (portfolio, setPortfolio, calculateMetrics, calculatePortfolioValue) => {
    // Example fetch simulation for stock prices
    const updatedPortfolio = portfolio.map((stock) => ({
      ...stock,
      currentPrice: Math.random() * 100 + 1, // Mock current price
    }));
    
    setPortfolio(updatedPortfolio);
    calculatePortfolioValue(updatedPortfolio);
    calculateMetrics(updatedPortfolio);
  };
  
  export const calculatePortfolioValue = (portfolio, setPortfolioValue) => {
    const value = portfolio.reduce((total, stock) => {
      return total + stock.currentPrice * stock.quantity;
    }, 0);
    setPortfolioValue(value.toFixed(2));
  };
  
  export const calculateMetrics = (portfolio, portfolioValue, setMetrics) => {
    if (portfolio.length === 0) {
      setMetrics({ topStock: null, distribution: {} });
      return;
    }
  
    const topStock = portfolio.reduce((top, stock) =>
      stock.currentPrice * stock.quantity > top.currentPrice * top.quantity
        ? stock
        : top
    );
  
    const distribution = portfolio.reduce((dist, stock) => {
      const percentage = ((stock.currentPrice * stock.quantity) / portfolioValue) * 100;
      dist[stock.name] = percentage.toFixed(2);
      return dist;
    }, {});
  
    setMetrics({ topStock, distribution });
  };
  