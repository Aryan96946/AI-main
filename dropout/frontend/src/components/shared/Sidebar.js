import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Sidebar({ user, setUser }) {
  const nav = useNavigate();
  const [expanded, setExpanded] = useState(true); // toggle state

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    nav("/");
  };

  return (
    <motion.div
      animate={{ width: expanded ? 220 : 70 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      style={{
        background: "#1f2937", // keep your original background
        color: "white",
        padding: 20,
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Toggle button (top-right) */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          position: "absolute",
          top: 15,
          right: 15,
          background: "transparent",
          border: "none",
          color: "white",
          cursor: "pointer",
        }}
      >
        {expanded ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Title */}
      <h3
        className="text-lg font-bold mb-4"
        style={{
          opacity: expanded ? 1 : 0,
          transition: "opacity 0.2s ease",
          textAlign: expanded ? "left" : "center",
        }}
      >
        AiDropout
      </h3>

      {/* Not logged in */}
      {!user && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            alignItems: expanded ? "flex-start" : "center",
          }}
        >
          <SidebarLink expanded={expanded} to="/" text="Login" />
          <SidebarLink expanded={expanded} to="/register" text="Register" />
        </div>
      )}

      {/* Logged in */}
      {user && (
        <div className="space-y-4">
          <div
            style={{
              opacity: expanded ? 1 : 0,
              transition: "opacity 0.3s ease",
            }}
          >
            Logged in as: <strong>{user.username}</strong> ({user.role})
          </div>
          <hr className="border-gray-500" />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              alignItems: expanded ? "flex-start" : "center",
            }}
          >
            {user.role === "student" && (
              <SidebarLink expanded={expanded} to="/student" text="My Dashboard" />
            )}
            {user.role === "teacher" && (
              <SidebarLink expanded={expanded} to="/teacher" text="Teacher Dashboard" />
            )}
            {user.role === "admin" && (
              <SidebarLink expanded={expanded} to="/admin" text="Admin Dashboard" />
            )}
          </div>

          <hr className="border-gray-500" />
          <button
            onClick={logout}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded"
            style={{
              textAlign: "center",
              transition: "all 0.3s",
            }}
          >
            {expanded ? "Logout" : "🚪"}
          </button>
        </div>
      )}
    </motion.div>
  );
}

/* Reusable link component */
function SidebarLink({ expanded, to, text }) {
  return (
    <Link
      to={to}
      style={{
        color: "#a78bfa",
        textDecoration: "none",
        textAlign: expanded ? "left" : "center",
        width: "100%",
        transition: "background 0.2s ease",
      }}
      className="hover:underline"
    >
      <span
        style={{
          opacity: expanded ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        {text}
      </span>
    </Link>
  );
}
