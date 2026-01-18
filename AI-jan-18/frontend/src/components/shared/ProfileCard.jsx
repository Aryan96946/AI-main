import React from "react";
import { motion } from "framer-motion";

const ProfileCard = ({ user, stats = {} }) => {
  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const getRandomGradient = (name) => {
    const gradients = [
      "from-emerald-400 to-cyan-400",
      "from-blue-400 to-indigo-400",
      "from-purple-400 to-pink-400",
      "from-amber-400 to-orange-400",
      "from-rose-400 to-red-400",
      "from-violet-400 to-purple-400",
    ];
    const index = name ? name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % gradients.length : 0;
    return gradients[index];
  };

  const gradient = getRandomGradient(user?.full_name || user?.username);

  return (
    <motion.div
      className="relative overflow-hidden rounded-3xl bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
    >
      {/* Background decoration */}
      <div className={`absolute -top-20 -right-20 w-48 h-48 bg-gradient-to-br ${gradient} opacity-20 rounded-full blur-3xl`} />
      <div className={`absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br ${gradient} opacity-10 rounded-full blur-3xl`} />

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
        {/* Avatar */}
        <motion.div
          className={`w-28 h-28 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-2xl`}
          whileHover={{ scale: 1.05, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <span className="text-4xl font-bold text-white drop-shadow-lg">
            {getInitials(user?.full_name || user?.username)}
          </span>
        </motion.div>

        {/* User Info */}
        <div className="flex-1 text-center md:text-left">
          <motion.h2
            className="text-2xl font-bold text-white mb-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {user?.full_name || user?.username || "Student"}
          </motion.h2>
          <motion.p
            className="text-gray-400 text-sm mb-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {user?.course || "Student"} • {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || "Student"}
          </motion.p>

          {/* Quick Stats */}
          {Object.keys(stats).length > 0 && (
            <motion.div
              className="flex flex-wrap gap-4 justify-center md:justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {Object.entries(stats).map(([key, value], index) => (
                <div key={key} className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/60 rounded-lg">
                  <span className="text-xs text-gray-400 capitalize">{key.replace(/_/g, " ")}</span>
                  <span className="text-sm font-semibold text-white">{value}</span>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Quick Actions */}
        <motion.div
          className="flex flex-col gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className={`px-4 py-2 rounded-xl bg-gradient-to-r ${gradient} text-white font-medium text-sm text-center`}>
            {user?.risk_label || "Active"}
          </div>
          <div className="text-xs text-gray-400 text-center">
            ID: {user?.id || "N/A"}
          </div>
        </motion.div>
      </div>

      {/* Bottom gradient line */}
      <motion.div
        className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      />
    </motion.div>
  );
};

export default ProfileCard;

