import React from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      {/* ✅ Clicking this will reload the page */}
      <div className="logo" onClick={() => window.location.reload()}>
        SolarCalc 🌞
      </div>

      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/calculator">Calculator</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;



