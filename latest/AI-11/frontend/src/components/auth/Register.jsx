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
      transition={{ duration: 0.8 }}
      style={{
        maxWidth: 400,
        margin: "auto",
        padding: 20,
        minHeight: "50vh",
        display: "flex",
        paddingTop: 10,
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: "#ffffff",
      }}
    >
      <motion.div
        className="bg-white shadow-2xl rounded-2xl w-full p-10"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h2
          className="text-3xl font-bold text-center text-black mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Register
        </motion.h2>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.form key="step1" className="space-y-6" onSubmit={registerUser} {...fadeIn}>
              <div>
                <label className="block text-black font-semibold mb-2">Username</label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg text-black placeholder-gray-700 bg-white"
                  placeholder="Enter username"
                />
              </div>

              <div>
                <label className="block text-black font-semibold mb-2">Full Name</label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg text-black placeholder-gray-700 bg-white"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-black font-semibold mb-2">Gmail</label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg text-black placeholder-gray-700 bg-white"
                  placeholder="Enter Gmail"
                />
              </div>

              <div>
                <label className="block text-black font-semibold mb-2">Password</label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg text-black placeholder-gray-700 bg-white"
                  placeholder="Enter password"
                />
              </div>

              <div>
                <label className="block text-black font-semibold mb-2">Gender</label>
                <motion.select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg text-black bg-white"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </motion.select>
              </div>

              <div>
                <label className="block text-black font-semibold mb-2">Nationality</label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="text"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg text-black placeholder-gray-700 bg-white"
                  placeholder="Enter nationality"
                />
              </div>

              <div>
                <label className="block text-black font-semibold mb-2">Role</label>
                <motion.select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full p-3 border rounded-lg text-black bg-white"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </motion.select>
              </div>

              {role === "student" && (
                <motion.div {...fadeIn}>
                  <label className="block text-black font-semibold mb-2">Roll Number</label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    name="roll_no"
                    value={formData.roll_no}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg text-black placeholder-gray-700 bg-white"
                    placeholder="Enter roll number"
                  />

                  <label className="block text-black font-semibold mb-2 mt-4">Department</label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg text-black placeholder-gray-700 bg-white"
                    placeholder="Enter department"
                  />

                  <label className="block text-black font-semibold mb-2 mt-4">Year</label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg text-black placeholder-gray-700 bg-white"
                    placeholder="Enter year"
                  />
                </motion.div>
              )}

              {role === "teacher" && (
                <motion.div {...fadeIn}>
                  <label className="block text-black font-semibold mb-2">Employee ID</label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    name="employee_id"
                    value={formData.employee_id}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg text-black placeholder-gray-700 bg-white"
                    placeholder="Enter employee ID"
                  />

                  <label className="block text-black font-semibold mb-2 mt-4">Subject</label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg text-black placeholder-gray-700 bg-white"
                    placeholder="Enter subject"
                  />

                  <label className="block text-black font-semibold mb-2 mt-4">Department</label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg text-black placeholder-gray-700 bg-white"
                    placeholder="Enter department"
                  />
                </motion.div>
              )}

              <motion.button
                type="submit"
                whileHover={buttonHover}
                whileTap={buttonTap}
                disabled={loading}
                className={`w-full font-semibold py-3 rounded-lg ${
                  loading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </motion.button>
            </motion.form>
          ) : (
            <motion.div key="otp-step" className="space-y-6" {...fadeIn}>
              <label className="block text-black font-semibold mb-2">Enter OTP</label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="number"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-3 border rounded-lg text-black placeholder-gray-700 bg-white"
                placeholder="Enter OTP"
              />

              <motion.button
                whileHover={buttonHover}
                whileTap={buttonTap}
                onClick={verifyUser}
                disabled={loading}
                className={`w-full font-semibold py-3 rounded-lg ${
                  loading ? "bg-green-300" : "bg-green-600 hover:bg-green-700 text-white"
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
          className="mt-6 text-center text-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-semibold">
            Login here
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
