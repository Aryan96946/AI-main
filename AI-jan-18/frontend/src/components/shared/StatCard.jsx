import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import AnimatedCounter from "./AnimatedCounter";

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color = "emerald",
  suffix = "",
  delay = 0 
}) => {
  const colors = {
    emerald: { bg: "from-emerald-500/20 to-emerald-600/10", border: "border-emerald-500/30", icon: "text-emerald-400", gradient: "from-emerald-400 to-cyan-400" },
    blue: { bg: "from-blue-500/20 to-blue-600/10", border: "border-blue-500/30", icon: "text-blue-400", gradient: "from-blue-400 to-indigo-400" },
    purple: { bg: "from-purple-500/20 to-purple-600/10", border: "border-purple-500/30", icon: "text-purple-400", gradient: "from-purple-400 to-pink-400" },
    amber: { bg: "from-amber-500/20 to-amber-600/10", border: "border-amber-500/30", icon: "text-amber-400", gradient: "from-amber-400 to-orange-400" },
    red: { bg: "from-red-500/20 to-red-600/10", border: "border-red-500/30", icon: "text-red-400", gradient: "from-red-400 to-rose-400" },
    cyan: { bg: "from-cyan-500/20 to-cyan-600/10", border: "border-cyan-500/30", icon: "text-cyan-400", gradient: "from-cyan-400 to-blue-400" },
  };

  const colorScheme = colors[color] || colors.emerald;

  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-2xl p-6
        bg-gradient-to-br ${colorScheme.bg}
        border ${colorScheme.border}
        backdrop-blur-xl
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.03, y: -5 }}
    >
      {/* Background glow */}
      <div className={`absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br ${colorScheme.gradient} opacity-20 rounded-full blur-2xl`} />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gray-800/50 ${colorScheme.icon}`}>
            {Icon && <Icon size={24} />}
          </div>
          <div className={`text-xs font-medium px-3 py-1 rounded-full bg-gray-800/50 text-gray-300`}>
            {title}
          </div>
        </div>
        
        <div className="flex items-baseline gap-1">
          <AnimatedCounter 
            value={value} 
            className={`text-4xl font-bold bg-gradient-to-r ${colorScheme.gradient} bg-clip-text text-transparent`} 
          />
          {suffix && <span className="text-gray-400 text-lg">{suffix}</span>}
        </div>
      </div>

      {/* Decorative line */}
      <motion.div 
        className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${colorScheme.gradient}`}
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

export default StatCard;

