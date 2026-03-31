import API, { setToken } from "./index";
import { jwtDecode } from "jwt-decode";

function handleError(err) {
  const msg =
    err.response?.data?.error ||
    err.response?.data?.message ||
    err.message ||
    "Something went wrong";

  console.error(msg);
  throw new Error(msg);
}

function decodeUser(token) {
  try {
    const decoded = jwtDecode(token);

    const payload = decoded.sub || decoded;

    return {
      id: payload.id,
      username: payload.username,
      role: payload.role,
    };
  } catch {
    console.warn("Invalid JWT token");
    return null;
  }
}

export const sendOtp = async (email) => {
  try {
    const response = await API.post("/auth/login", { email });
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
    const user = token ? decodeUser(token) : null;

    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }

    return { token, user };
  } catch (err) {
    handleError(err);
  }
};

export const loginUser = async ({ email, password }) => {
  try {
    const response = await API.post("/auth/login-password", {
      email,
      password,
    });

    const token = response.data.token;
    if (token) setToken(token);

    const user = token ? decodeUser(token) : null;

    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }

    return { data: response.data, token, user };
  } catch (err) {
    handleError(err);
  }
};

export const registerUser = async (username, password, role = "student") => {
  try {
    const response = await API.post("/auth/register", {
      username,
      password,
      role,
    });
    return response.data;
  } catch (err) {
    handleError(err);
  }
};

