import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const AnimatedCounter = ({ value, duration = 1.5, className = "" }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const previousValue = useRef(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) {
      previousValue.current = displayValue;
    }
    hasAnimated.current = true;
  }, [value]);

  useEffect(() => {
    const startValue = previousValue.current;
    const endValue = value;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      const currentValue = Math.round(startValue + (endValue - startValue) * easeOut);
      
      if (progress < 1) {
        setDisplayValue(currentValue);
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(endValue);
      }
    };

    if (startValue !== endValue) {
      requestAnimationFrame(animate);
    }
  }, [value, duration]);

  return (
    <motion.span 
      className={className}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {displayValue}
    </motion.span>
  );
};

export default AnimatedCounter;

