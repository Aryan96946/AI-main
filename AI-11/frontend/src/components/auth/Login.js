import React, { useState } from "react";
import API from "../../api";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState(""); // 'otp' or 'password'
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handleToken = (token) => {
    const decoded = jwtDecode(token);
    const identity = decoded.sub || decoded || {};
    const role = (identity.role || "").toLowerCase();
    const user = {
      id: identity.id,
      email: identity.username || "",
      role,
      token
    };
    onLogin(token, user);

    if (role === "student") nav("/student");
    else if (role === "teacher") nav("/teacher");
    else nav("/admin");
  };

  const sendOTP = async () => {
    if (!email.endsWith("@gmail.com")) {
      setErr("Only Gmail accounts are allowed");
      return;
    }
    try {
      setLoading(true);
      await API.post("/auth/login", { email });
      setStep(2);
      setMethod("otp");
      setErr("");
    } catch (error) {
      setErr(error.response?.data?.error || error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const loginWithPassword = async () => {
    if (!email || !password) {
      setErr("Email and password are required");
      return;
    }
    try {
      setLoading(true);
      const res = await API.post("/auth/login-password", { email, password });
      handleToken(res.data.token);
    } catch (error) {
      setErr(error.response?.data?.error || error.response?.data?.message || error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp) {
      setErr("OTP is required");
      return;
    }
    try {
      setLoading(true);
      const res = await API.post("/auth/verify-otp", { email, otp });
      handleToken(res.data.token);
    } catch (error) {
      setErr(error.response?.data?.error || error.response?.data?.message || error.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2 className="text-xl font-semibold mb-4">Login</h2>

      {step === 1 && (
        <>
          <input
            type="email"
            placeholder="Enter Gmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
          />
          <div className="flex gap-2">
            <button
              onClick={sendOTP}
              className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={loading}
            >
              {loading && method === "otp" ? "Sending..." : "Login via OTP"}
            </button>
            <button
              onClick={() => { setStep(2); setMethod("password"); }}
              className="flex-1 bg-green-500 text-white p-2 rounded hover:bg-green-600"
            >
              Login via Password
            </button>
          </div>
        </>
      )}

      {step === 2 && method === "otp" && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
          />
          <button
            onClick={verifyOTP}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify & Login"}
          </button>
        </>
      )}

      {step === 2 && method === "password" && (
        <>
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
          />
          <button
            onClick={loginWithPassword}
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </>
      )}

      {err && <div className="text-red-500 mt-2">{err}</div>}
    </div>
  );
}
