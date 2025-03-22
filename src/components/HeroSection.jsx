import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import SplitText from "../components/SplitText";
import BlurText from "../components/BlurText";
import Button from "../components/Button";
import SpotlightCard from "../components/SpotLightCard"; // ✅ Import SpotlightCard
import "../styles/hero.css";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    document.body.classList.add("page-transition");
    setTimeout(() => {
      navigate("/calculator");
      document.body.classList.remove("page-transition");
    }, 500);
  };

  return (
    <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(0, 229, 255, 0.2)">
      <motion.section 
        className="hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* ✅ Animated SolarCalc Title */}
        <h1 className="hero-title">
          <SplitText 
            text="SolarCalc"
            delay={40}
            onLetterAnimationComplete={() => console.log("SplitText animation complete!")}
          />
        </h1>

        {/* ✅ Subtitle with BlurText Effect */}
        <h2 className="hero-subtitle">
          <BlurText 
            text="Harness the Sun, Optimize Your Energy!"
            delay={50}
            onLetterAnimationComplete={() => console.log("Subtitle animation complete!")}
          />
        </h2>

        {/* ✅ Glowing Button inside SpotlightCard */}
        <Button text="Start Your Solar Calculation" onClick={handleNavigation} />
      </motion.section>
    </SpotlightCard>
  );
};

export default HeroSection;
