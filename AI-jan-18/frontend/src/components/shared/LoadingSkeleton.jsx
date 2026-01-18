import React from "react";
import { motion } from "framer-motion";

const LoadingSkeleton = ({ count = 1, className = "", height = "20px" }) => {
  const skeletons = Array(count).fill(0);

  return (
    <div className={`space-y-2 ${className}`}>
      {skeletons.map((_, index) => (
        <motion.div
          key={index}
          className="rounded-lg"
          style={{ height }}
          initial={{ opacity: 0.3 }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: index * 0.1,
            ease: "easeInOut"
          }}
          css={`
            background: linear-gradient(
              90deg,
              rgba(55, 65, 81, 0.4) 25%,
              rgba(75, 85, 99, 0.7) 50%,
              rgba(55, 65, 81, 0.4) 75%
            );
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
          `}
        />
      ))}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};

export const CardSkeleton = () => (
  <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
    <LoadingSkeleton count={4} height="24px" className="mb-4" />
    <LoadingSkeleton count={2} height="100px" />
  </div>
);

export const TableSkeleton = () => (
  <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
    <LoadingSkeleton count={1} height="40px" className="mb-4" />
    <LoadingSkeleton count={5} height="50px" />
  </div>
);

export default LoadingSkeleton;

