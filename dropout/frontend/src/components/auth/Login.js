import React, { useState } from "react";
import API from "../../api";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { motion, AnimatePresence } from "framer-motion"; // ✨ Animation import

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState(""); // 'otp' or 'password'
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handleToken = (token) => {
    const decoded = jwtDecode(token);
    const identity = decoded.sub || decoded || {};
    const role = (identity.role || "").toLowerCase();
    const user = {
      id: identity.id,
      email: identity.username || "",
      role,
      token,
    };
    onLogin(token, user);

    if (role === "student") nav("/student");
    else if (role === "teacher") nav("/teacher");
    else nav("/admin");
  };

  const sendOTP = async () => {
    if (!email.endsWith("@gmail.com")) {
      setErr("Only Gmail accounts are allowed");
      return;
    }
    try {
      setLoading(true);
      await API.post("/auth/login", { email });
      setStep(2);
      setMethod("otp");
      setErr("");
    } catch (error) {
      setErr(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to send OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  const loginWithPassword = async () => {
    if (!email || !password) {
      setErr("Email and password are required");
      return;
    }
    try {
      setLoading(true);
      const res = await API.post("/auth/login-password", { email, password });
      handleToken(res.data.token);
    } catch (error) {
      setErr(
        error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp) {
      setErr("OTP is required");
      return;
    }
    try {
      setLoading(true);
      const res = await API.post("/auth/verify-otp", { email, otp });
      handleToken(res.data.token);
    } catch (error) {
      setErr(
        error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "OTP verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // ✨ Reusable animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
    transition: { duration: 0.5 },
  };

  const buttonHover = { scale: 1.05 };
  const buttonTap = { scale: 0.95 };

  return (
    <motion.div
      className="login-container bg-white shadow-xl rounded-2xl p-6 mt-10"
      style={{ maxWidth: 400, margin: "auto" }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.h2
        className="text-2xl font-bold text-center mb-6 text-gray-700"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Welcome Back 👋
      </motion.h2>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" {...fadeInUp}>
            <label
              htmlFor="email"
              className="block text-gray-700 font-semibold mb-2"
            >
              Enter Email:
            </label>
            <motion.input
              type="email"
              placeholder="Enter Gmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mb-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              whileFocus={{ scale: 1.02 }}
            />
            <br></br><br></br>
            <div className="flex gap-2">
              <motion.button
                whileHover={buttonHover}
                whileTap={buttonTap}
                onClick={sendOTP}
                className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
                disabled={loading}
              >
                {loading && method === "otp" ? "Sending..." : "Login via OTP"}
              </motion.button>
            
              <motion.button
                whileHover={buttonHover}
                whileTap={buttonTap}
                onClick={() => {
                  setStep(2);
                  setMethod("password");
                }}
                className="flex-1 bg-green-500 text-white p-2 rounded hover:bg-green-600"
              >
                Login via Password
              </motion.button>
            </div>
          </motion.div>
        )}

        {step === 2 && method === "otp" && (
          <motion.div key="otp-step" {...fadeInUp}>
            <motion.input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-2 mb-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              whileFocus={{ scale: 1.02 }}
            />
            <motion.button
              whileHover={buttonHover}
              whileTap={buttonTap}
              onClick={verifyOTP}
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify & Login"}
            </motion.button>
          </motion.div>
        )}

        {step === 2 && method === "password" && (
          <motion.div key="password-step" {...fadeInUp}>
            <motion.input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mb-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              whileFocus={{ scale: 1.02 }}
            />
            <motion.button
              whileHover={buttonHover}
              whileTap={buttonTap}
              onClick={loginWithPassword}
              className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {err && (
        <motion.div
          className="text-red-500 mt-3 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          ⚠️ {err}
        </motion.div>
      )}
    </motion.div>
  );
}
