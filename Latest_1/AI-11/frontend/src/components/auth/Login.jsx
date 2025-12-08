import React, { useState } from "react";
import API from "../../api";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { motion, AnimatePresence } from "framer-motion";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handleToken = (token) => {
    const decoded = jwtDecode(token);
    let identity = decoded.sub;

    if (typeof identity === "string") {
      try {
        identity = JSON.parse(identity);
      } catch {
        identity = {};
      }
    }

    const user = {
      id: identity.id,
      email: identity.email || "",
      role: (identity.role || "").toLowerCase(),
      token,
    };

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    onLogin(token, user);

    if (user.role === "student") nav("/student");
    else if (user.role === "teacher") nav("/teacher");
    else nav("/admin");
  };

  const sendOTP = async () => {
    if (!email) return setErr("Email is required");
    if (!email.endsWith("@gmail.com")) return setErr("Only Gmail accounts are allowed");

    try {
      setLoading(true);
      await API.post("/auth/login", { email });
      setStep(2);
      setMethod("otp");
      setErr("");
    } catch (error) {
      setErr(error.response?.data?.error || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const loginWithPassword = async () => {
    if (!email || !password) return setErr("Email and password are required");

    try {
      setLoading(true);
      const res = await API.post("/auth/login-password", { email, password });
      handleToken(res.data.token);
    } catch (error) {
      setErr(error.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp) return setErr("OTP is required");

    try {
      setLoading(true);
      const res = await API.post("/auth/verify-otp", { email, otp });
      handleToken(res.data.token);
    } catch (error) {
      setErr(error.response?.data?.error || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

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
      style={{ maxWidth: 400, margin: "auto", color: "black" }}
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
        Welcome Back
      </motion.h2>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" {...fadeInUp}>
            <label className="block text-gray-700 font-semibold mb-2">Enter Email:</label>
            <motion.input
              type="email"
              placeholder="Enter Gmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mb-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              style={{ color: "black", backgroundColor: "white" }}
              whileFocus={{ scale: 1.02 }}
            />

            <div className="flex gap-2 mt-4">
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
                  setErr("");
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
              style={{ color: "black", backgroundColor: "white" }}
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
              style={{ color: "black", backgroundColor: "white" }}
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

      <motion.div
        className="mt-6 text-center text-gray-600"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Don’t have an account?{" "}
        <Link to="/register" className="text-blue-600 font-semibold hover:underline">
          Register here
        </Link>
      </motion.div>

      <motion.div
        className="mt-4 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          whileHover={buttonHover}
          whileTap={buttonTap}
          onClick={() => nav("/")}
          className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
        >
          Back to Home
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
