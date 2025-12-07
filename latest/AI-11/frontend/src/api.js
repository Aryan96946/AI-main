import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL?.trim() || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && token !== "undefined") {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.msg || error.response?.data?.error;

    const shouldLogout =
      status === 401 &&
      (message?.toLowerCase().includes("token") ||
       message?.toLowerCase().includes("expired") ||
       message?.toLowerCase().includes("invalid"));

    if (shouldLogout) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export function setToken(token) {
  if (token && token !== "undefined") {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
}

export default API;
