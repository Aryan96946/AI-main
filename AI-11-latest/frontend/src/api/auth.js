import API, { setToken } from "./index";
import jwt_decode from "jwt-decode";

function handleError(err) {
  const msg = err.response?.data?.error || err.response?.data?.message || err.message;
  console.error(msg);
  throw new Error(msg);
}

export const registerUser = async (email, username, password, role = "student") => {
  try {
    const response = await API.post("/auth/register", { email, username, password, role });
    return response.data;
  } catch (err) {
    handleError(err);
  }
};

export const verifyOTP = async (email, otp) => {
  try {
    const response = await API.post("/auth/verify-otp", { email, otp });
    const token = response.data.token;

    if (token) setToken(token);

    let user = null;
    if (token) {
      try {
        const decoded = jwt_decode(token);
        user = {
          id: decoded.id || decoded.sub,
          username: decoded.username || decoded.email,
          role: decoded.role
        };
        localStorage.setItem("user", JSON.stringify(user));
      } catch {
        console.warn("Invalid JWT token");
      }
    }

    return { token, user };
  } catch (err) {
    handleError(err);
  }
};

// ---------------- LOGIN ----------------
export const loginUser = async ({ email, password = "" }) => {
  try {
    const payload = password ? { email, password } : { email };
    const response = await API.post("/auth/login-password", payload);

    const token = response.data.token;
    if (token) setToken(token);

    let user = null;
    if (token) {
      try {
        const decoded = jwt_decode(token);
        user = {
          id: decoded.id || decoded.sub,
          username: decoded.username || decoded.email,
          role: decoded.role
        };
        localStorage.setItem("user", JSON.stringify(user));
      } catch {
        console.warn("Invalid JWT token");
      }
    }

    return { data: response.data, token, user };
  } catch (err) {
    handleError(err);
  }
};
