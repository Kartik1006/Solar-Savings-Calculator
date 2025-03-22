import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Calculator from "./pages/Calculator";
import Savings from "./pages/Savings";  // ✅ Placed before PotentialMap
import PotentialMap from "./pages/PotentialMap";
import SubsidiesPage from "./pages/SubsidiesPage";
import Preloader from "./components/Preloader";
import "./App.css";

function App() {
  const [loading, setLoading] = useState(true);
  const location = useLocation(); 
  const navigate = useNavigate();  

  useEffect(() => {
    setTimeout(() => setLoading(false), 1200);
    
    if (performance.navigation.type === 1) {
      navigate("/");
    }
  }, []);

  return (
    <>
      {loading ? (
        <Preloader />
      ) : (
        <>
          <Navbar />
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home />} />
                <Route path="/calculator" element={<Calculator />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
          <Footer />
        </>
      )}
    </>
  );
}

export default App;
