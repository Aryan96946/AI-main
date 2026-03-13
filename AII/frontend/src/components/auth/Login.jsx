import React, { useState, useEffect, useRef, useCallback } from "react";
import API from "../../api";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorShake, setErrorShake] = useState(false);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
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

  const handleLogin = async () => {
    if (!email || !password) {
      setErr("Email and password are required");
      setErrorShake(true);
      return;
    }

    const allowedDomains = ["@gmail.com", "@ecajmer.ac.in"];
    if (!allowedDomains.some(domain => email.toLowerCase().endsWith(domain))) {
      setErr("Only Gmail or ecajmer.ac.in accounts are allowed");
      setErrorShake(true);
      return;
    }

    try {
      setLoading(true);
      setErr("");
      const res = await API.post("/auth/login-password", { email, password });
      handleToken(res.data.token);
    } catch (error) {
      setErr(error.response?.data?.error || "Login failed");
      setErrorShake(true);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter" && !loading) {
      handleLogin();
    }
  }, [loading]);

  const clearError = () => {
    if (err) setErr("");
    if (errorShake) setErrorShake(false);
  };

  useEffect(() => {
    const handleGlobalKey = (e) => {
      if (e.key === "Enter" && !loading) handleLogin();
    };
    document.addEventListener("keydown", handleGlobalKey);
    return () => document.removeEventListener("keydown", handleGlobalKey);
  }, [loading]);

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  const buttonHover = { scale: 1.05 };
  const buttonTap = { scale: 0.95 };
  const shake = {
    x: [0, -10, 10, -10, 0],
    transition: { duration: 0.5 }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)' }}>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-10"
            style={{
              left: `${(i * 73) % 100}%`,
              top: `${(i * 47) % 100}%`,
              width: (i * 17 + 50),
              height: (i * 17 + 50),
              background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)'
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: (i * 0.5 + 8),
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Floating shapes */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 rounded-full"
        style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', filter: 'blur(40px)' }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-40 h-40 rounded-full"
        style={{ background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)', filter: 'blur(50px)' }}
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      <motion.div
        className="relative z-10 min-h-screen flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="w-full max-w-md"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Logo & Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" 
                 style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #10b981 100%)' }}>
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">AI Dropout Prevention</h1>
            <p className="text-gray-400">Sign in to access your dashboard</p>
          </motion.div>

          {/* Login Card */}
          <motion.div
            className="backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20"
            style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(20px)' }}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <motion.h2
              className="text-2xl font-bold text-center mb-6 text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Welcome Back
            </motion.h2>

            <motion.div {...fadeInUp}>
              <div className="space-y-5">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="email">Email Address</label>
                  <motion.input
                    ref={emailRef}
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      clearError();
                    }}
                    onKeyDown={handleKeyDown}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    whileFocus={{ scale: 1.02 }}
                    aria-label="Email address"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="password">Password</label>
                  <div className="relative">
                    <motion.input
                      ref={passwordRef}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        clearError();
                      }}
                      onKeyDown={handleKeyDown}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all pr-12"
                      whileFocus={{ scale: 1.02 }}
                      aria-label="Password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <motion.button
                  whileHover={buttonHover}
                  whileTap={buttonTap}
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white' }}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </>
                  ) : "Sign In"}
                </motion.button>
              </div>
            </motion.div>

            {err && (
              <motion.div
                className="mt-4 p-3 rounded-xl bg-red-500/20 border border-red-500/30"
                initial={{ opacity: 0, y: -10, x: 0 }}
                animate={errorShake ? shake : { opacity: 1, y: 0, x: 0 }}
                onAnimationComplete={() => setErrorShake(false)}
              >
                <p className="text-red-400 text-sm text-center">⚠️ {err}</p>
              </motion.div>
            )}

            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-gray-400 mb-2">
                Don't have an account?{" "}
                <Link to="/register" className="font-semibold hover:underline" style={{ color: '#10b981' }}>
                  Register here
                </Link>
              </p>
              <p className="text-gray-400">
                <Link to="/forgot-password" className="font-semibold hover:underline" style={{ color: '#f59e0b' }}>
                  Forgot Password?
                </Link>
              </p>
            </motion.div>

            <motion.div
              className="mt-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <button
                onClick={() => nav("/")}
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                ← Back to Home
              </button>
            </motion.div>
          </motion.div>

          {/* Footer */}
          <motion.p
            className="text-center text-gray-500 text-sm mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            © {new Date().getFullYear()} AI Dropout Prevention System. All rights reserved.
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
}

