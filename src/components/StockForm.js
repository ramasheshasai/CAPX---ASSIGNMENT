import React from "react";

const StockForm = ({ form, setForm, handleAddEditStock, defaultStocks }) => (
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
);

export default StockForm;
