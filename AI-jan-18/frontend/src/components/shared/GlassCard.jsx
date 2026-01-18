import React from "react";
import { motion } from "framer-motion";

const GlassCard = ({ 
  children, 
  className = "", 
  hoverEffect = true,
  glowEffect = false,
  delay = 0 
}) => {
  return (
    <motion.div
      className={`
        bg-gray-800/40 
        backdrop-blur-xl 
        border border-gray-700/50 
        rounded-2xl 
        p-6 
        shadow-xl
        ${glowEffect ? "relative overflow-hidden" : ""}
        ${className}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={hoverEffect ? { 
        scale: 1.02, 
        y: -5,
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
        borderColor: "rgba(16, 185, 129, 0.5)"
      } : {}}
      style={{
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
      }}
    >
      {glowEffect && (
        <>
          <motion.div
            className="absolute -top-20 -left-20 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </>
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

export default GlassCard;

