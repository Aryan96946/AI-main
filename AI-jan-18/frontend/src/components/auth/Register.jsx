import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../api";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Mail, Lock, User, Phone, BookOpen, Award, ArrowRight, Sparkles, CheckCircle, ChevronDown } from "lucide-react";
import GlassCard from "../shared/GlassCard";

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
    if (!email.endsWith("@gmail.com")) return setMsg("Only Gmail accounts are allowed");
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

  // Floating particles for background
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 5,
  }));

  const inputFields = [
    { name: "username", label: "Username", icon: User, type: "text", placeholder: "Enter username" },
    { name: "full_name", label: "Full Name", icon: User, type: "text", placeholder: "Enter full name" },
    { name: "email", label: "Email", icon: Mail, type: "email", placeholder: "Enter Gmail" },
    { name: "password", label: "Password", icon: Lock, type: showPassword ? "text" : "password", placeholder: "Create password", showToggle: true },
    { name: "nationality", label: "Nationality", icon: Award, type: "text", placeholder: "Enter nationality" },
  ];

  const studentFields = [
    { name: "roll_no", label: "Roll Number", icon: BookOpen, type: "text", placeholder: "Enter roll number" },
    { name: "department", label: "Department", icon: BookOpen, type: "text", placeholder: "Enter department" },
    { name: "year", label: "Year", icon: Award, type: "text", placeholder: "Enter year" },
  ];

  const teacherFields = [
    { name: "employee_id", label: "Employee ID", icon: User, type: "text", placeholder: "Enter employee ID" },
    { name: "subject", label: "Subject", icon: BookOpen, type: "text", placeholder: "Enter subject" },
    { name: "department", label: "Department", icon: BookOpen, type: "text", placeholder: "Enter department" },
  ];

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 py-12 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.5, 1], x: [0, -50, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/3 -left-40 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 right-1/3 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
        
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-20"
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

      <div className="w-full max-w-lg">
        {/* Logo */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Brain size={32} className="text-gray-900" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">AI Dropout</h2>
              <p className="text-xs text-gray-400">Create your account</p>
            </div>
          </div>
        </motion.div>

        <GlassCard glowEffect className="relative">
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-gray-400 text-sm">Join us in supporting student success</p>
          </motion.div>

          {/* Role Selector */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-gray-300 text-sm mb-2">Select Role</label>
            <div className="grid grid-cols-2 gap-3">
              {['student', 'teacher'].map((r) => (
                <motion.button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`py-3 rounded-xl font-medium capitalize transition-all ${
                    role === r
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                      : "bg-gray-700/50 text-gray-400 hover:bg-gray-700"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {r === 'student' ? <User size={18} className="inline mr-2" /> : <BookOpen size={18} className="inline mr-2" />}
                  {r}
                </motion.button>
              ))}
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                className="space-y-4"
                onSubmit={registerUser}
              >
                {/* Common Fields */}
                {inputFields.map((field) => (
                  <div key={field.name}>
                    <label className="block text-gray-300 text-sm mb-2">{field.label}</label>
                    <div className="relative">
                      <field.icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <motion.input
                        type={field.type === 'password' && showPassword ? 'text' : field.type}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                        whileFocus={{ scale: 1.01 }}
                      />
                      {field.showToggle && (
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {/* Gender Selection */}
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Gender</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-purple-500/50 transition-colors appearance-none cursor-pointer"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                  </div>
                </div>

                {/* Role-specific Fields */}
                {role === 'student' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    {studentFields.map((field) => (
                      <div key={field.name}>
                        <label className="block text-gray-300 text-sm mb-2">{field.label}</label>
                        <div className="relative">
                          <field.icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <motion.input
                            type={field.type}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleChange}
                            placeholder={field.placeholder}
                            className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                            whileFocus={{ scale: 1.01 }}
                          />
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {role === 'teacher' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    {teacherFields.map((field) => (
                      <div key={field.name}>
                        <label className="block text-gray-300 text-sm mb-2">{field.label}</label>
                        <div className="relative">
                          <field.icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <motion.input
                            type={field.type}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleChange}
                            placeholder={field.placeholder}
                            className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                            whileFocus={{ scale: 1.01 }}
                          />
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-medium text-white shadow-lg mt-6 disabled:opacity-50"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    "Sending OTP..."
                  ) : (
                    <>
                      <Sparkles size={18} />
                      Send OTP
                    </>
                  )}
                </motion.button>
              </motion.form>
            ) : (
              <motion.div
                key="otp-step"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                className="space-y-5"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <Sparkles size={32} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Verify OTP</h3>
                  <p className="text-gray-400 text-sm">Enter the 6-digit code sent to<br /><span className="text-purple-400">{formData.email}</span></p>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">Enter OTP</label>
                  <motion.input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 text-center text-2xl tracking-widest font-mono"
                    whileFocus={{ scale: 1.01 }}
                    maxLength={6}
                  />
                </div>

                <motion.button
                  onClick={verifyUser}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-medium text-white shadow-lg disabled:opacity-50"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? "Verifying..." : "Verify & Complete"}
                  <ArrowRight size={18} />
                </motion.button>

                <motion.button
                  onClick={() => setStep(1)}
                  className="w-full text-gray-400 text-sm hover:text-white transition-colors"
                  whileHover={{ scale: 1.02 }}
                >
                  ← Go back to registration
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {msg && (
            <motion.div
              className={`mt-4 p-3 rounded-xl text-sm text-center ${
                msg.toLowerCase().includes("success")
                  ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                  : "bg-red-500/10 border border-red-500/30 text-red-400"
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {msg}
            </motion.div>
          )}

          {/* Footer */}
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-gray-400 text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </motion.div>

          {/* Benefits */}
          <motion.div
            className="mt-6 pt-6 border-t border-gray-700/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex justify-center gap-6 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <CheckCircle size={12} className="text-purple-400" />
                <span>Free</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle size={12} className="text-purple-400" />
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle size={12} className="text-purple-400" />
                <span>Easy</span>
              </div>
            </div>
          </motion.div>
        </GlassCard>
      </div>
    </div>
  );
}

// Helper icon
function EyeOff({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function Eye({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

