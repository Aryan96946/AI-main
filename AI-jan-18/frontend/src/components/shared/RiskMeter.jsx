import React from "react";
import { motion } from "framer-motion";

const RiskMeter = ({ riskScore, riskTier, size = "large" }) => {
  const sizes = {
    small: { width: 120, strokeWidth: 8, fontSize: "text-lg" },
    medium: { width: 160, strokeWidth: 10, fontSize: "text-2xl" },
    large: { width: 200, strokeWidth: 12, fontSize: "text-3xl" }
  };

  const { width, strokeWidth, fontSize } = sizes[size];
  const radius = (width - strokeWidth) / 2;
  const circumference = radius * Math.PI;
  const offset = circumference - ((100 - riskScore) / 100) * circumference;

  const getColor = (tier) => {
    switch (tier) {
      case "High": return "#ef4444";
      case "Medium": return "#f59e0b";
      case "Low": return "#10b981";
      default: return "#6b7280";
    }
  };

  const getGradient = (tier) => {
    switch (tier) {
      case "High": return "from-red-500 to-orange-500";
      case "Medium": return "from-yellow-500 to-amber-500";
      case "Low": return "from-emerald-500 to-teal-500";
      default: return "from-gray-500 to-gray-600";
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      <svg width={width} height={width} className="transform -rotate-135">
        <defs>
          <linearGradient id={`riskGradient-${riskTier}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={getColor(riskTier)} stopOpacity="0.5" />
            <stop offset="100%" stopColor={getColor(riskTier)} stopOpacity="1" />
          </linearGradient>
        </defs>
        {/* Background arc */}
        <circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          fill="none"
          stroke="#374151"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${circumference / 2} ${circumference / 2}`}
          strokeDashoffset={-circumference / 4}
        />
        {/* Risk arc */}
        <motion.circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          fill="none"
          stroke={`url(#riskGradient-${riskTier})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference / 2 }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{
            strokeDasharray: `${circumference / 2} ${circumference / 2}`,
          }}
        />
      </svg>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span 
          className={`${fontSize} font-bold text-white`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          {riskScore}
        </motion.span>
        <motion.span 
          className={`text-sm font-medium bg-gradient-to-r ${getGradient(riskTier)} bg-clip-text text-transparent`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {riskTier}
        </motion.span>
      </div>

      {/* Labels */}
      <div className="flex justify-between w-full mt-2 text-xs">
        <span className="text-emerald-400">Low</span>
        <span className="text-yellow-400">Medium</span>
        <span className="text-red-400">High</span>
      </div>
    </div>
  );
};

export default RiskMeter;

