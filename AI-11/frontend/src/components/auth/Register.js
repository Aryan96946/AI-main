import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import API from "../../api";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("student");
  const [msg, setMsg] = useState("");
  const nav = useNavigate();

  const registerUser = async () => {
    if (!username) {
      setMsg("Username is required");
      return;
    }
    if (!email.endsWith("@gmail.com")) {
      setMsg("Only Gmail accounts are allowed");
      return;
    }
    if (!password) {
      setMsg("Password is required");
      return;
    }

    try {
      const res = await API.post(
        "/auth/register",
        { username, email, role, password },
        { headers: { "Content-Type": "application/json" } }
      );
      setStep(2);
      setMsg(res.data.message || "OTP sent to your Gmail.");
    } catch (error) {
      setMsg(
        error.response?.data?.error || error.response?.data?.message || "Failed to send OTP"
      );
    }
  };

  const verifyUser = async () => {
    try {
      const res = await API.post(
        "/auth/verify-otp",
        { email, otp },
        { headers: { "Content-Type": "application/json" } }
      );
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }
      setMsg(res.data.message || "Registration successful!");
      setTimeout(() => nav("/"), 1000);
    } catch (error) {
      setMsg(
        error.response?.data?.error || error.response?.data?.message || "OTP verification failed"
      );
    }
  };

  return (
    <div className="register-container" style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2 className="text-xl font-semibold mb-4">Register with Gmail</h2>
      {step === 1 ? (
        <>
          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            type="email"
            placeholder="Enter Gmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
          <button
            onClick={registerUser}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Send OTP
          </button>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
          />
          <button
            onClick={verifyUser}
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            Verify & Register
          </button>
        </>
      )}
      {msg && <div className="text-red-500 mt-2">{msg}</div>}
    </div>
  );
}
