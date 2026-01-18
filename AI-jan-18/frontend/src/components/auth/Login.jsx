import React, { useState } from "react";
import API from "../../api";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, CheckCircle, KeyRound, ChevronLeft } from "lucide-react";
import GlassCard from "../shared/GlassCard";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Forgot password states
  const [forgotStep, setForgotStep] = useState(0); // 0: not shown, 1: email input, 2: code verification, 3: new password
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  
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

  // Forgot password functions
  const sendResetCode = async () => {
    if (!email) return setErr("Please enter your email address");
    if (!email.endsWith("@gmail.com")) return setErr("Only Gmail accounts are allowed");

    try {
      setLoading(true);
      setErr("");
      const res = await API.post("/auth/forgot-password", { email });
      setForgotStep(2);
      setSuccessMsg(res.data.message);
      setTimeout(() => setSuccessMsg(""), 5000);
    } catch (error) {
      setErr(error.response?.data?.error || "Failed to send reset code");
    } finally {
      setLoading(false);
    }
  };

  const verifyResetCode = async () => {
    if (!resetCode) return setErr("Please enter the reset code");
    if (!newPassword) return setErr("Please enter a new password");
    if (newPassword !== confirmPassword) return setErr("Passwords do not match");
    if (newPassword.length < 6) return setErr("Password must be at least 6 characters");

    try {
      setLoading(true);
      setErr("");
      const res = await API.post("/auth/verify-reset-code", {
        email,
        code: resetCode,
        new_password: newPassword
      });
      setForgotStep(3);
      setSuccessMsg(res.data.message);
    } catch (error) {
      setErr(error.response?.data?.error || "Invalid or expired reset code");
    } finally {
      setLoading(false);
    }
  };

  // Floating particles for background
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 5,
  }));

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.5, 1], x: [0, 50, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/3 -right-40 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-1/3 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
        
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 opacity-20"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-md">
        {/* Logo */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Brain size={32} className="text-gray-900" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">AI Dropout</h2>
              <p className="text-xs text-gray-400">Student Success Platform</p>
            </div>
          </div>
        </motion.div>

        <GlassCard glowEffect className="relative">
          {/* Back Button for Forgot Password */}
          <AnimatePresence>
            {forgotStep > 0 && (
              <motion.button
                onClick={() => {
                  setForgotStep(0);
                  setErr("");
                  setSuccessMsg("");
                }}
                className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 text-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                whileHover={{ scale: 1.02 }}
              >
                <ChevronLeft size={16} />
                Back to Login
              </motion.button>
            )}
          </AnimatePresence>

          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {forgotStep === 0 ? (
              <>
                <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
                <p className="text-gray-400 text-sm">Sign in to access your dashboard</p>
              </>
            ) : forgotStep === 1 ? (
              <>
                <h2 className="text-2xl font-bold text-white mb-2">Forgot Password</h2>
                <p className="text-gray-400 text-sm">Enter your email to reset password</p>
              </>
            ) : forgotStep === 2 ? (
              <>
                <h2 className="text-2xl font-bold text-white mb-2">Enter Reset Code</h2>
                <p className="text-gray-400 text-sm">Code sent to {email}</p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-white mb-2">Password Reset</h2>
                <p className="text-gray-400 text-sm">Enter your new password</p>
              </>
            )}
          </motion.div>

          {/* Success Message */}
          <AnimatePresence>
            {successMsg && (
              <motion.div
                className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                ✓ {successMsg}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {/* Forgot Password Flow */}
            {forgotStep === 1 && (
              <motion.div
                key="forgot-email"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                className="space-y-5"
              >
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <motion.input
                      type="email"
                      placeholder="Enter your Gmail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
                      whileFocus={{ scale: 1.01 }}
                    />
                  </div>
                </div>

                <motion.button
                  onClick={sendResetCode}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl font-medium text-white shadow-lg disabled:opacity-50"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? "Sending..." : (
                    <>
                      <KeyRound size={18} />
                      Send Reset Code
                    </>
                  )}
                </motion.button>
              </motion.div>
            )}

            {forgotStep === 2 && (
              <motion.div
                key="forgot-verify"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                className="space-y-5"
              >
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Reset Code</label>
                  <motion.input
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 text-center text-2xl tracking-widest font-mono"
                    whileFocus={{ scale: 1.01 }}
                    maxLength={6}
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <motion.input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
                      whileFocus={{ scale: 1.01 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <motion.input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
                      whileFocus={{ scale: 1.01 }}
                    />
                  </div>
                </div>

                <motion.button
                  onClick={verifyResetCode}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl font-medium text-white shadow-lg disabled:opacity-50"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? "Verifying..." : "Reset Password"}
                  <ArrowRight size={18} />
                </motion.button>
              </motion.div>
            )}

            {forgotStep === 3 && (
              <motion.div
                key="forgot-success"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                className="text-center py-8"
              >
                <motion.div
                  className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <CheckCircle size={40} className="text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-2">Password Reset!</h3>
                <p className="text-gray-400 mb-6">Your password has been successfully reset.</p>
                <motion.button
                  onClick={() => {
                    setForgotStep(0);
                    setEmail("");
                    setResetCode("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setErr("");
                    setSuccessMsg("");
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl font-medium text-white"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Go to Login
                </motion.button>
              </motion.div>
            )}

            {/* Normal Login Flow */}
            {forgotStep === 0 && step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                className="space-y-5"
              >
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <motion.input
                      type="email"
                      placeholder="Enter your Gmail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
                      whileFocus={{ scale: 1.01 }}
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    onClick={sendOTP}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl font-medium text-white shadow-lg disabled:opacity-50"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading && method === "otp" ? (
                      "Sending..."
                    ) : (
                      <>
                        <Sparkles size={18} />
                        OTP
                      </>
                    )}
                  </motion.button>

                  <motion.button
                    onClick={() => {
                      setStep(2);
                      setMethod("password");
                      setErr("");
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-700/50 hover:bg-gray-700 rounded-xl font-medium text-white border border-gray-600/50 transition-colors"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Lock size={18} />
                    Password
                  </motion.button>
                </div>
              </motion.div>
            )}

            {forgotStep === 0 && step === 2 && method === "otp" && (
              <motion.div
                key="otp-step"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                className="space-y-5"
              >
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Enter OTP</label>
                  <motion.input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 text-center text-2xl tracking-widest font-mono"
                    whileFocus={{ scale: 1.01 }}
                    maxLength={6}
                  />
                </div>

                <motion.button
                  onClick={verifyOTP}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl font-medium text-white shadow-lg disabled:opacity-50"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? "Verifying..." : "Verify & Login"}
                  <ArrowRight size={18} />
                </motion.button>

                <motion.button
                  onClick={() => {
                    setStep(1);
                    setMethod("");
                    setOtp("");
                  }}
                  className="w-full text-gray-400 text-sm hover:text-white transition-colors"
                  whileHover={{ scale: 1.02 }}
                >
                  ← Back to login options
                </motion.button>
              </motion.div>
            )}

            {forgotStep === 0 && step === 2 && method === "password" && (
              <motion.div
                key="password-step"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                className="space-y-5"
              >
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <motion.input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
                      whileFocus={{ scale: 1.01 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <motion.button
                  onClick={loginWithPassword}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl font-medium text-white shadow-lg disabled:opacity-50"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? "Logging in..." : "Sign In"}
                  <ArrowRight size={18} />
                </motion.button>

                <motion.button
                  onClick={() => {
                    setStep(1);
                    setMethod("");
                    setPassword("");
                  }}
                  className="w-full text-gray-400 text-sm hover:text-white transition-colors"
                  whileHover={{ scale: 1.02 }}
                >
                  ← Back to login options
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {err && forgotStep < 3 && (
            <motion.div
              className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              ⚠️ {err}
            </motion.div>
          )}

          {/* Footer Links */}
          <motion.div
            className="mt-6 text-center space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {forgotStep === 0 && (
              <button
                onClick={() => setForgotStep(1)}
                className="text-emerald-400 hover:text-emerald-300 text-sm transition-colors"
              >
                Forgot your password?
              </button>
            )}
            <p className="text-gray-400 text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                Register here
              </Link>
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
            >
              ← Back to Home
            </Link>
          </motion.div>

          {/* Features */}
          <motion.div
            className="mt-6 pt-6 border-t border-gray-700/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex justify-center gap-6 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <CheckCircle size={12} className="text-emerald-400" />
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle size={12} className="text-emerald-400" />
                <span>Private</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle size={12} className="text-emerald-400" />
                <span>Fast</span>
              </div>
            </div>
          </motion.div>
        </GlassCard>
      </div>
    </div>
  );
}

