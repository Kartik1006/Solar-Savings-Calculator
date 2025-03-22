import { useState } from "react";
import "../styles/savings.css";

function SavingsEstimator() {
  const [bill, setBill] = useState("");
  const [savings, setSavings] = useState(null);

  const calculateSavings = () => {
    if (!bill) return;
    const estimatedSavings = (bill * 0.7).toFixed(2);
    setSavings(estimatedSavings);
  };

  return (
    <div className="savings">
      <h2>Estimate Your Solar Savings</h2>
      <label>Monthly Electricity Bill (₹):</label>
      <input type="number" value={bill} onChange={(e) => setBill(e.target.value)} step="50" />
      <button onClick={calculateSavings}>Estimate</button>
      {savings && <p>Projected Savings: ₹{savings} per year</p>}
    </div>
  );
}

export default SavingsEstimator;
