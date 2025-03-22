import { useState } from "react";
import "../styles/calculator.css";

function SolarCalculator() {
  const [location, setLocation] = useState("");
  const [roofSize, setRoofSize] = useState("");
  const [energyUsage, setEnergyUsage] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const [solarIrradiance, setSolarIrradiance] = useState(null);
  const [calculationResult, setCalculationResult] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [touched, setTouched] = useState({
    location: false,
    roofSize: false,
    energyUsage: false,
  });

  const API_KEY = "67dd80234a38e614012257lfka6c6c3"; // Replace with actual API key

  const fetchCoordinates = async (address) => {
    const cleanedAddress = address.trim().replace(/,/g, " ");
    const url = `https://geocode.maps.co/search?q=${encodeURIComponent(cleanedAddress)}&api_key=${API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.length > 0) {
        const coords = { lat: data[0].lat, lon: data[0].lon };
        setCoordinates(coords);
        console.log("📍 Coordinates: ", coords);
        await fetchSolarIrradiance(coords.lat, coords.lon);
      } else {
        setCoordinates(null);
        setSolarIrradiance(null);
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      setCoordinates(null);
      setSolarIrradiance(null);
    }
  };

  const fetchSolarIrradiance = async (latitude, longitude) => {
    try {
      const response = await fetch("http://localhost:3003/solar_irradiance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latitude, longitude }),
      });
      const data = await response.json();

      if (data.dni) {
        setSolarIrradiance(data.dni);
        console.log("☀️ Solar Irradiance (DNI):", data.dni);
      } else {
        setSolarIrradiance(null);
      }
    } catch (error) {
      console.error("Error fetching solar irradiance:", error);
      setSolarIrradiance(null);
    }
  };

  const handleBlur = async (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === "location" && location.trim()) {
      await fetchCoordinates(location);
    }
  };

  const isValidLocation = () => touched.location && coordinates;
  const isValidRoofSize = () => touched.roofSize && roofSize > 0;
  const isValidEnergyUsage = () => touched.energyUsage && energyUsage > 0;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isValidLocation() && isValidRoofSize() && isValidEnergyUsage()) {
      console.log("✅ Form Submitted: ", { location, roofSize, energyUsage, solarIrradiance, coordinates });

      fetch("http://localhost:3003/calculate_solar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location,
          area: roofSize,
          electricityBillAmount: energyUsage,
          latitude: coordinates?.lat,
          longitude: coordinates?.lon,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("📊 Calculation Result:", data);
          setCalculationResult(data);
          setFormSubmitted(true); // Hides the form
        })
        .catch((error) => console.error("❌ Error:", error));
    } else {
      console.log("❌ Form validation failed!");
    }
  };
 return (
    <div className="calculator">
      {/* ✅ Keep Title in Form */}
      {!formSubmitted && <h2>Solar Panel Calculator</h2>}

      {/* Show Form Only If Not Submitted */}
      {!formSubmitted && (
        <form onSubmit={handleSubmit}>
          <label>Location *:</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onBlur={() => handleBlur("location")}
            placeholder="Enter address: Area, City, State"
            className={`input ${touched.location ? (coordinates ? "input-success" : "input-error") : ""}`}
            required
          />

          <label>Roof Area (sq.m) :</label>
          <input
            type="number"
            value={roofSize}
            onChange={(e) => setRoofSize(e.target.value)}
            onBlur={() => handleBlur("roofSize")}
            placeholder="e.g. 15"
            min="1"
            className={`input ${touched.roofSize ? (roofSize > 0 ? "input-success" : "input-error") : ""}`}
            required
          />

          <label>Monthly Bill (₹) *:</label>
          <input
            type="number"
            value={energyUsage}
            onChange={(e) => setEnergyUsage(e.target.value)}
            onBlur={() => handleBlur("energyUsage")}
            placeholder="e.g. 1500"
            min="1"
            className={`input ${touched.energyUsage ? (energyUsage > 0 ? "input-success" : "input-error") : ""}`}
            required
          />

          {solarIrradiance !== null && <p className="info-text">☀️ Solar Irradiance: {solarIrradiance} W/m²</p>}

          <button type="submit" className="submit-btn">Calculate</button>
        </form>
      )}

      {/* 📌 Show Results After Form Submission (Without "Solar Panel Calculator" Title) */}
      {formSubmitted && calculationResult && (
        <div className="result-card">
          <h3>📊 Calculation Results</h3>
          <p><strong>💰 Total Cost:</strong> ₹{calculationResult.cost}</p>
          <p><strong>⏳ ROI:</strong> {calculationResult.roi}</p>
          <p><strong>⚡ Annual Savings:</strong> ₹{calculationResult.savings}</p>
          <p><strong>📈 Net Present Value:</strong> ₹{calculationResult.npv}</p>
          <p><strong>🔆 Energy Production:</strong> {calculationResult.energyProduction} kWh/year</p>
          <p><strong>🏠 Suggested Roof Area:</strong> {calculationResult.suggestedArea} sq.m</p>
          <p><strong>🔋 Panel Capacity:</strong> {calculationResult.panelPowerCapacitykW} kW</p>
          <p><strong>☀️ Irradiance:</strong> {calculationResult.solarIrradianceUsed} kWh/m²/year</p>

          <h4>✅ Pros:</h4>
          <ul>
            {calculationResult.pros.map((pro, index) => <li key={index}>{pro}</li>)}
          </ul>

          <h4>⚠️ Cons:</h4>
          <ul>
            {calculationResult.cons.map((con, index) => <li key={index}>{con}</li>)}
          </ul>

          <button className="submit-btn" onClick={() => setFormSubmitted(false)}>🔄 Recalculate</button>
        </div>
      )}
    </div>
  );
}

export default SolarCalculator;
