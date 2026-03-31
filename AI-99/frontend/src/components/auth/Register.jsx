import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../api";
import { motion, AnimatePresence } from "framer-motion";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    full_name: "",
    roll_no: "",
    department: "",
    year: "",
    employee_id: "",
    subject: "",
    gender: "",
    marital_status: "",
    nationality: "",
  });

  const [role, setRole] = useState("student");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const nav = useNavigate();

  const handleChange = (e) => {
    setMsg("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const registerUser = async (e) => {
    e.preventDefault();
    const { username, email, password } = formData;

    if (!username) return setMsg("Username is required");
    const allowedDomains = ["@gmail.com", "@ecajmer.ac.in"];
    if (!allowedDomains.some(domain => email.endsWith(domain))) return setMsg("Only Gmail or ecajmer.ac.in accounts are allowed");
    if (!password) return setMsg("Password is required");

    try {
      setLoading(true);
      const res = await API.post(
        "/auth/register",
        { ...formData, role },
        { headers: { "Content-Type": "application/json" } }
      );
      setStep(2);
      setMsg(res.data.message || "OTP sent to your Gmail.");
    } catch (error) {
      setMsg(error.response?.data?.error || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyUser = async () => {
    if (!otp) return setMsg("OTP is required");

    try {
      setLoading(true);
      const res = await API.post(
        "/auth/verify-otp",
        { email: formData.email, otp },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.token) localStorage.setItem("token", res.data.token);
      setMsg(res.data.message || "Registration successful!");

      setTimeout(() => nav("/"), 1500);
    } catch (error) {
      setMsg(error.response?.data?.error || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const fadeIn = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
    transition: { duration: 0.6 },
  };

  const buttonHover = { scale: 1.05 };
  const buttonTap = { scale: 0.95 };

  const inputClass = "w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all";
  const labelClass = "block text-gray-300 text-sm font-medium mb-2";

  return (
    <div className="min-h-screen relative overflow-hidden py-8" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)' }}>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-10"
            style={{
              left: `${(i * 61) % 100}%`,
              top: `${(i * 37) % 100}%`,
              width: (i * 23 + 40),
              height: (i * 23 + 40),
              background: 'radial-gradient(circle, #10b981 0%, transparent 70%)'
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.1, 0.25, 0.1],
            }}
            transition={{
              duration: (i * 0.4 + 10),
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Floating shapes */}
      <motion.div
        className="absolute top-40 right-20 w-40 h-40 rounded-full"
        style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)', filter: 'blur(60px)' }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.4, 0.25] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 left-20 w-48 h-48 rounded-full"
        style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #10b981 100%)', filter: 'blur(50px)' }}
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.25, 0.4, 0.25] }}
        transition={{ duration: 7, repeat: Infinity }}
      />

      <motion.div
        className="relative z-10 max-w-lg mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Header */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3" 
               style={{ background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)' }}>
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
          <p className="text-gray-400 text-sm">Join the AI Dropout Prevention System</p>
        </motion.div>

        {/* Register Card */}
        <motion.div
          className="backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20"
          style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(20px)' }}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form key="step1" className="space-y-4" onSubmit={registerUser} {...fadeIn}>
                {/* Role Selection */}
                <div>
                  <label className={labelClass}>I am a</label>
                  <div className="grid grid-cols-2 gap-3">
                    <motion.button
                      type="button"
                      whileHover={buttonHover}
                      whileTap={buttonTap}
                      onClick={() => setRole("student")}
                      className={`py-3 rounded-xl font-medium transition-all ${role === "student" ? "text-white" : "text-gray-400"}`}
                      style={role === "student" ? { background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' } : { background: 'rgba(255,255,255,0.1)' }}
                    >
                      Student
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={buttonHover}
                      whileTap={buttonTap}
                      onClick={() => setRole("teacher")}
                      className={`py-3 rounded-xl font-medium transition-all ${role === "teacher" ? "text-white" : "text-gray-400"}`}
                      style={role === "teacher" ? { background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' } : { background: 'rgba(255,255,255,0.1)' }}
                    >
                      Teacher
                    </motion.button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Username</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="johndoe"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Full Name</label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Gmail</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@gmail.com"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={inputClass + " pr-12"}
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

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="" className="text-gray-800">Select</option>
                      <option value="male" className="text-gray-800">Male</option>
                      <option value="female" className="text-gray-800">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Nationality</label>
                    <input
                      type="text"
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleChange}
                      placeholder="Indian"
                      className={inputClass}
                    />
                  </div>
                </div>

                {role === "student" && (
                  <motion.div {...fadeIn} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>Roll Number</label>
                        <input
                          type="text"
                          name="roll_no"
                          value={formData.roll_no}
                          onChange={handleChange}
                          placeholder="21BCS001"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Year</label>
                        <input
                          type="text"
                          name="year"
                          value={formData.year}
                          onChange={handleChange}
                          placeholder="2nd Year"
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Department</label>
                      <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        placeholder="Computer Science"
                        className={inputClass}
                      />
                    </div>
                  </motion.div>
                )}

                {role === "teacher" && (
                  <motion.div {...fadeIn} className="space-y-3">
                    <div>
                      <label className={labelClass}>Employee ID</label>
                      <input
                        type="text"
                        name="employee_id"
                        value={formData.employee_id}
                        onChange={handleChange}
                        placeholder="EMP001"
                        className={inputClass}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>Subject</label>
                        <input
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="Mathematics"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Department</label>
                        <input
                          type="text"
                          name="department"
                          value={formData.department}
                          onChange={handleChange}
                          placeholder="Science"
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  whileHover={buttonHover}
                  whileTap={buttonTap}
                  disabled={loading}
                  className="w-full py-3 rounded-xl font-semibold transition-all disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white' }}
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </motion.button>
              </motion.form>
            ) : (
              <motion.div key="otp-step" className="space-y-5" {...fadeIn}>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-3" 
                       style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' }}>
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-1">Verify Email</h3>
                  <p className="text-gray-400 text-sm">We've sent a 6-digit OTP to<br/><span className="text-emerald-400">{formData.email}</span></p>
                </div>

                <input
                  type="number"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  className={inputClass + " text-center text-2xl tracking-widest"}
                />

                <motion.button
                  whileHover={buttonHover}
                  whileTap={buttonTap}
                  onClick={verifyUser}
                  disabled={loading}
                  className="w-full py-3 rounded-xl font-semibold transition-all disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', color: 'white' }}
                >
                  {loading ? "Verifying..." : "Verify & Register"}
                </motion.button>

                <button
                  onClick={() => { setStep(1); setOtp(""); }}
                  className="w-full text-gray-400 text-sm hover:text-white transition-colors"
                >
                  ← Change email or resend OTP
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {msg && (
            <motion.div
              className={`mt-4 p-3 rounded-xl text-center text-sm ${msg.toLowerCase().includes("success") ? "bg-green-500/20 border border-green-500/30 text-green-400" : "bg-red-500/20 border border-red-500/30 text-red-400"}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {msg}
            </motion.div>
          )}

          <motion.div
            className="mt-5 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-gray-400 text-sm">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold hover:underline" style={{ color: '#10b981' }}>
                Login here
              </Link>
            </p>
          </motion.div>

          <motion.div
            className="mt-3 text-center"
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
          className="text-center text-gray-500 text-xs mt-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          © {new Date().getFullYear()} AI Dropout Prevention System
        </motion.p>
      </motion.div>
    </div>
  );
}

