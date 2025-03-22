import { useEffect, useState } from "react";
import "../styles/map.css";

function SolarPotentialMap() {
  const [mapData, setMapData] = useState(null);

  useEffect(() => {
    fetch("https://re.jrc.ec.europa.eu/api/v5_2/PVcalc?lat=28.6139&lon=77.2090")
      .then((res) => res.json())
      .then((data) => setMapData(data));
  }, []);

  return (
    <div className="map">
      <h2>Solar Potential Map 🗺️</h2>
      {mapData ? <p>Solar Radiation: {mapData.outputs.totals.fixed.E_y} kWh/m²</p> : <p>Loading data...</p>}
    </div>
  );
}

export default SolarPotentialMap;
