import { useEffect, useState } from "react";
import "../styles/subsidies.css";

function Subsidies() {
  const [subsidies, setSubsidies] = useState([]);

  useEffect(() => {
    fetch("/api/subsidies") // Fetch from backend (Replace with actual API)
      .then((res) => res.json())
      .then((data) => setSubsidies(data));
  }, []);

  return (
    <div className="subsidies">
      <h2>Government Solar Subsidies</h2>
      <ul>{subsidies.map((sub, index) => <li key={index}>{sub}</li>)}</ul>
    </div>
  );
}

export default Subsidies;
