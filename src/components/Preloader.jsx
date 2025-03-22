import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "../styles/preloader.css";

const Preloader = ({ onFinish }) => {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsFading(true);
      setTimeout(() => {
        onFinish();
      }, 200); // ⚡ Faster fade-out
    }, 1000); // 🌟 Total preloader time = 1 sec
  }, [onFinish]);

  return (
    <motion.div
      className="preloader"
      initial={{ opacity: 1 }}
      animate={{ opacity: isFading ? 0 : 1 }}
      transition={{ duration: 0.2 }}
      exit={{ opacity: 0 }}
    >
      {/* 🌞 Pulsating Sun Animation */}
      <motion.div
        className="sun-emoji"
        animate={{
          scale: [1, 1.2, 1], // Pulsating effect
          textShadow: [
            "0 0 10px rgba(255, 204, 0, 0.6)",
            "0 0 20px rgba(255, 165, 0, 0.9)",
            "0 0 10px rgba(255, 204, 0, 0.6)",
          ],
        }}
        transition={{ repeat: Infinity, duration: 1 }}
      >
        🌞
      </motion.div>

      {/* 🔤 Bigger SolarCalc Text */}
      <motion.h1
        className="solarcalc-text"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        SolarCalc
      </motion.h1>
    </motion.div>
  );
};

export default Preloader;
