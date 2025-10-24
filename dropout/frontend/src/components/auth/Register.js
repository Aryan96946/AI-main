import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";

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
    setMsg(""); // Clear previous message
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const registerUser = async (e) => {
    e.preventDefault();

    const { username, email, password } = formData;

    if (!username) return setMsg("Username is required");
    if (!email.endsWith("@gmail.com"))
      return setMsg("Only Gmail accounts are allowed");
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
      setMsg(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to send OTP"
      );
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
      setTimeout(() => nav("/"), 1000);
    } catch (error) {
      setMsg(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "OTP verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "auto",
        padding: 20,
        minHeight: "50vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingTop: 60,
        backgroundColor: "#f3f4f6", // gray-100 equivalent
      }}
    >
      <div className="bg-white shadow-2xl rounded-2xl w-full p-10">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Register
        </h2>

        {step === 1 ? (
          <form className="space-y-6" onSubmit={registerUser}>
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-gray-700 font-semibold mb-2"
              >
                Enter Username :
              </label>
              <input
                id="username"
                type="text"
                name="username"
                autoComplete="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <br></br>

            {/* Full Name */}
            <div>
              <label
                htmlFor="full_name"
                className="block text-gray-700 font-semibold mb-2"
              >
                Enter Full Name :
              </label>
              <input
                id="full_name"
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Enter full name"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <br></br>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 font-semibold mb-2"
              >
                Enter Gmail :
              </label>
              <input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Gmail address"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <br></br>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-gray-700 font-semibold mb-2"
              >
                Enter Password :
              </label>
              <input
                id="password"
                type="password"
                name="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <br></br>

            {/* Role */}
            <div>
              <label
                htmlFor="role"
                className="block text-gray-700 font-semibold mb-2"
              >
                Select Role :
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => {
                  setMsg("");
                  setRole(e.target.value);
                }}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>
            <br></br>

            {/* Student Fields */}
            {role === "student" && (
              <>
                <div>
                  <label
                    htmlFor="roll_no"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    Roll Number :
                  </label>
                  <input
                    id="roll_no"
                    name="roll_no"
                    value={formData.roll_no}
                    onChange={handleChange}
                    placeholder="Enter roll number"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
            <br></br>

                <div>
                  <label
                    htmlFor="department"
                    className="block text-gray-700 font-semibold mb-2">
                  
                    Department : 
                  </label>
                  <input
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="Enter department"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
            <br></br>

                <div>
                  <label
                    htmlFor="year"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    Year :
                  </label>
                  <input
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    placeholder="Enter year"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </>
            )}
            <br></br>

            {/* Teacher Fields */}
            {role === "teacher" && (
              <>
                <div>
                  <label
                    htmlFor="employee_id"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    Employee ID :
                  </label>
                  <input
                    id="employee_id"
                    name="employee_id"
                    value={formData.employee_id}
                    onChange={handleChange}
                    placeholder="Enter employee ID"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
             <br></br>
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    Subject Specialization :
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Enter subject specialization"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </>
            )}
            <br></br>

            {/* Send OTP Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full font-semibold py-3 rounded-lg transition duration-200 ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <label
              htmlFor="otp"
              className="block text-gray-700 font-semibold mb-2"
            >
              Enter OTP :
            </label>
            <input
              id="otp"
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => {
                setMsg("");
                setOtp(e.target.value);
              }}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />
            <button
              onClick={verifyUser}
              disabled={loading}
              className={`w-full font-semibold py-3 rounded-lg transition duration-200 ${
                loading
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {loading ? "Verifying..." : "Verify & Register"}
            </button>
          </div>
        )}

        {msg && (
          <p
            className={`mt-6 text-center font-medium ${
              msg.toLowerCase().includes("success")
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {msg}
          </p>
        )}
      </div>
    </div>
  );
}
