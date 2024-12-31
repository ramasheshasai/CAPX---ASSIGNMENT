import React from "react";

const StockList = ({ portfolio, setForm, handleDeleteStock }) => (
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
              <strong>Current Price:</strong> {stock.currentPrice ? `$${stock.currentPrice.toFixed(2)}` : "Loading..."}
            </p>
            <div className="d-flex justify-content-between">
              <button className="btn btn-sm btn-primary me-2" onClick={() => setForm(stock)}>
                <i className="bi bi-pencil"></i> Edit
              </button>
              <button className="btn btn-sm btn-danger" onClick={() => handleDeleteStock(stock.id)}>
                <i className="bi bi-trash"></i> Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default StockList;
