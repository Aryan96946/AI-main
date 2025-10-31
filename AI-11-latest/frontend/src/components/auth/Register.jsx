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
  });

  const [role, setRole] = useState("student");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
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
      setMsg(error.response?.data?.error || error.response?.data?.message || "Failed to send OTP");
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
      
      // ✅ Redirect to Home after successful registration
      setTimeout(() => nav("/"), 1500);
    } catch (error) {
      setMsg(error.response?.data?.error || error.response?.data?.message || "OTP verification failed");
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{
        maxWidth: 400,
        margin: "auto",
        padding: 20,
        minHeight: "50vh",
        display: "flex",
        paddingTop: 10,
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: "#f3f4f6",
      }}
    >
      <motion.div
        className="bg-white shadow-2xl rounded-2xl w-full p-10"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h2
          className="text-3xl font-bold text-center text-gray-800 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Register ✨
        </motion.h2>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.form key="step1" className="space-y-6" onSubmit={registerUser} {...fadeIn}>
              <div>
                <label htmlFor="username" className="block text-gray-700 font-semibold mb-2">
                  Enter Username :
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  id="username"
                  type="text"
                  name="username"
                  autoComplete="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter username"
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 placeholder-gray-400 bg-white"
                />
              </div>
              <div>
                <label htmlFor="full_name" className="block text-gray-700 font-semibold mb-2">
                  Enter Full Name :
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  id="full_name"
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 placeholder-gray-400 bg-white"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
                  Enter Gmail :
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter Gmail address"
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 placeholder-gray-400 bg-white"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">
                  Enter Password :
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  id="password"
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 placeholder-gray-400 bg-white"
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-gray-700 font-semibold mb-2">
                  Select Role :
                </label>
                <motion.select
                  whileFocus={{ scale: 1.02 }}
                  id="role"
                  value={role}
                  onChange={(e) => {
                    setMsg("");
                    setRole(e.target.value);
                  }}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </motion.select>
              </div>

              {role === "student" && (
                <motion.div {...fadeIn}>
                  <label htmlFor="roll_no" className="block text-gray-700 font-semibold mb-2">
                    Roll Number :
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    id="roll_no"
                    name="roll_no"
                    value={formData.roll_no}
                    onChange={handleChange}
                    placeholder="Enter roll number"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 placeholder-gray-400 bg-white"
                  />
                  <label htmlFor="department" className="block text-gray-700 font-semibold mb-2">
                    Department :
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="Enter department"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 placeholder-gray-400 bg-white"
                  />
                  <label htmlFor="year" className="block text-gray-700 font-semibold mb-2">
                    Year :
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    placeholder="Enter year"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 placeholder-gray-400 bg-white"
                  />
                </motion.div>
              )}

              {role === "teacher" && (
  <motion.div {...fadeIn}>
    <label
      htmlFor="employee_id"
      className="block text-gray-700 font-semibold mb-2"
    >
      Employee ID :
    </label>
    <motion.input
      whileFocus={{ scale: 1.02 }}
      id="employee_id"
      name="employee_id"
      value={formData.employee_id}
      onChange={handleChange}
      placeholder="Enter employee ID"
      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 placeholder-gray-400 bg-white"
    />

    <label
      htmlFor="subject"
      className="block text-gray-700 font-semibold mb-2 mt-4"
    >
      Subject Specialization :
    </label>
    <motion.input
      whileFocus={{ scale: 1.02 }}
      id="subject"
      name="subject"
      value={formData.subject}
      onChange={handleChange}
      placeholder="Enter subject specialization"
      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 placeholder-gray-400 bg-white"
    />

    <label
      htmlFor="department"
      className="block text-gray-700 font-semibold mb-2 mt-4"
    >
      Department :
    </label>
    <motion.input
      whileFocus={{ scale: 1.02 }}
      id="department"
      name="department"
      value={formData.department}
      onChange={handleChange}
      placeholder="Enter department name"
      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 placeholder-gray-400 bg-white"
    />
  </motion.div>
)}


              <motion.button
                type="submit"
                whileHover={buttonHover}
                whileTap={buttonTap}
                disabled={loading}
                className={`w-full font-semibold py-3 rounded-lg transition duration-200 ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </motion.button>
            </motion.form>
          ) : (
            <motion.div key="otp-step" className="space-y-6" {...fadeIn}>
              <label htmlFor="otp" className="block text-gray-700 font-semibold mb-2">
                Enter OTP :
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                id="otp"
                type="number"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => {
                  setMsg("");
                  setOtp(e.target.value);
                }}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-gray-900 placeholder-gray-400 bg-white"
              />
              <motion.button
                whileHover={buttonHover}
                whileTap={buttonTap}
                onClick={verifyUser}
                disabled={loading}
                className={`w-full font-semibold py-3 rounded-lg transition duration-200 ${
                  loading
                    ? "bg-green-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {loading ? "Verifying..." : "Verify & Register"}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {msg && (
          <motion.p
            className={`mt-6 text-center font-medium ${
              msg.toLowerCase().includes("success") ? "text-green-600" : "text-red-500"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {msg}
          </motion.p>
        )}

        <motion.div
          className="mt-6 text-center text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">
            Login here
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
