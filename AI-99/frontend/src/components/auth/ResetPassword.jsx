import React, { useState, useEffect } from "react";
import API from "../../api";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    if (!token) {
      setErr("Invalid reset token");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return setErr("Invalid reset token");
    if (!password) return setErr("Password is required");
    if (password.length < 6) return setErr("Password must be at least 6 characters");
    if (password !== confirmPassword) return setErr("Passwords do not match");

    try {
      setLoading(true);
      setErr("");
      await API.post("/auth/reset-password", { token, password });
      setSuccess(true);
    } catch (error) {
      setErr(error.response?.data?.error || "Failed to reset password");
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
            <p className="text-gray-400">Enter your new password</p>
          </motion.div>

          {/* Card */}
          <motion.div
            className="backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20"
            style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(20px)' }}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {!success ? (
              <motion.form onSubmit={handleSubmit} {...fadeInUp}>
                <div className="space-y-5">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">New Password</label>
                    <div className="relative">
                      <motion.input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all pr-12"
                        whileFocus={{ scale: 1.02 }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
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

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Confirm Password</label>
                    <motion.input
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      whileFocus={{ scale: 1.02 }}
                    />
                  </div>

                  <motion.button
                    whileHover={buttonHover}
                    whileTap={buttonTap}
                    type="submit"
                    disabled={loading || !token}
                    className="w-full py-3 rounded-xl font-semibold transition-all disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white' }}
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </motion.button>
                </div>
              </motion.form>
            ) : (
              <motion.div {...fadeInUp} className="text-center">
                <div className="mb-4">
                  <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center" 
                       style={{ background: 'rgba(16, 185, 129, 0.2)' }}>
                    <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <p className="text-white mb-4">
                  Your password has been reset successfully!
                </p>
                <motion.button
                  whileHover={buttonHover}
                  whileTap={buttonTap}
                  onClick={() => nav("/login")}
                  className="w-full py-3 rounded-xl font-semibold transition-all"
                  style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', color: 'white' }}
                >
                  Go to Login
                </motion.button>
              </motion.div>
            )}

            {err && (
              <motion.div
                className="mt-4 p-3 rounded-xl bg-red-500/20 border border-red-500/30"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
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
              <p className="text-gray-400">
                Need help?{" "}
                <Link to="/login" className="font-semibold hover:underline" style={{ color: '#10b981' }}>
                  Contact support
                </Link>
              </p>
            </motion.div>
          </motion.div>

          {/* Footer */}
          <motion.p
            className="text-center text-gray-500 text-sm mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            © {new Date().getFullYear()} AI Dropout Prevention System
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
}

