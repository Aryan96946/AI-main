import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import API from "../../api";

export default function AdminDashboard({ user, onLogout }) {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [modelStatus, setModelStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [retrainLoading, setRetrainLoading] = useState(false);
  const [retrainMsg, setRetrainMsg] = useState("");
  const [activeTab, setActiveTab] = useState("analytics");
  const fetched = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || fetched.current) return;
    fetched.current = true;

    const loadData = async () => {
      setLoading(true);
      setErr("");

      try {
        const [usersRes, statsRes, modelRes] = await Promise.all([
          API.get("/admin/users"),
          API.get("/admin/analytics"),
          API.get("/ml/status").catch(() => ({ data: { status: "not_trained" } }))
        ]);

        setUsers(usersRes.data || []);
        setStats(statsRes.data || {});
        setModelStatus(modelRes.data || {});
      } catch (error) {
        setErr(error.response?.data?.error || "Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const logout = () => {
    localStorage.removeItem("token");
    if (onLogout) onLogout();
    navigate("/login");
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await API.post("/upload_csv", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setUploadStatus("CSV uploaded successfully!");
      setSelectedFile(null);
      // Refresh stats
      const statsRes = await API.get("/admin/analytics");
      setStats(statsRes.data || {});
    } catch (error) {
      setUploadStatus("Upload failed: " + (error.response?.data?.error || error.message));
    }
  };

  const handleRetrain = async () => {
    setRetrainLoading(true);
    setRetrainMsg("");
    try {
      const res = await API.post("/ml/retrain");
      setRetrainMsg(`Model retrained successfully! Version: ${res.data.model_version}, Accuracy: ${(res.data.accuracy * 100).toFixed(1)}%`);
      // Refresh model status
      const modelRes = await API.get("/ml/status");
      setModelStatus(modelRes.data || {});
    } catch (error) {
      setRetrainMsg("Failed to retrain: " + (error.response?.data?.exc || error.message));
    } finally {
      setRetrainLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await API.get("/admin/export", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "students_export.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert("Export failed: " + (error.response?.data?.error || error.message));
    }
  };

  if (!user)
    return (
      <div className="text-center mt-10 text-white bg-gray-900 p-6 rounded-lg">
        Please login
      </div>
    );

  if (loading)
    return (
      <motion.div
        className="text-center mt-10 text-white bg-gray-900 p-6 rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Loading dashboard...
      </motion.div>
    );

  if (err)
    return (
      <motion.div
        className="text-red-400 mt-10 text-center bg-gray-900 p-6 rounded-lg shadow-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {err}
      </motion.div>
    );

  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const rowAnim = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.05 },
    }),
  };

  // Prepare chart data
  const riskColors = ["#dc2626", "#ef4444", "#f59e0b", "#eab308", "#10b981"];
  const riskDistribution = stats?.risk_distribution ? 
    Object.entries(stats.risk_distribution).map(([name, value]) => ({ name, value })) : [];

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e'];

  return (
    <motion.div
      className="min-h-screen bg-gray-900 text-white p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-6">
        <motion.h2
          className="text-2xl font-bold text-blue-400"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5 }}
        >
          Admin Dashboard
        </motion.h2>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </motion.button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {['analytics', 'model', 'users', 'upload'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg capitalize ${
              activeTab === tab 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Analytics Tab */}
      {activeTab === "analytics" && (
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div 
              className="bg-gray-800 p-4 rounded-lg border border-gray-700"
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-gray-400 text-sm">Total Students</p>
              <p className="text-2xl font-bold text-blue-400">{stats?.total_students || 0}</p>
            </motion.div>
            <motion.div 
              className="bg-gray-800 p-4 rounded-lg border border-gray-700"
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-gray-400 text-sm">High Risk</p>
              <p className="text-2xl font-bold text-red-400">{stats?.high_risk_count || 0}</p>
            </motion.div>
            <motion.div 
              className="bg-gray-800 p-4 rounded-lg border border-gray-700"
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-gray-400 text-sm">Avg Attendance</p>
              <p className="text-2xl font-bold text-green-400">{stats?.avg_attendance || 0}%</p>
            </motion.div>
            <motion.div 
              className="bg-gray-800 p-4 rounded-lg border border-gray-700"
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-gray-400 text-sm">Avg Academic</p>
              <p className="text-2xl font-bold text-purple-400">{stats?.avg_academic_score || 0}</p>
            </motion.div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Risk Distribution Pie Chart */}
            <motion.div
              className="bg-gray-800 p-6 rounded-lg border border-gray-700"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold mb-4 text-blue-300">Risk Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Risk by Course */}
            <motion.div
              className="bg-gray-800 p-6 rounded-lg border border-gray-700"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-lg font-semibold mb-4 text-blue-300">Risk by Course</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={stats?.course_risk || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="course" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip />
                  <Bar dataKey="avg_risk" fill="#3b82f6" name="Avg Risk" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Monthly Trend */}
            <motion.div
              className="bg-gray-800 p-6 rounded-lg border border-gray-700 md:col-span-2"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-lg font-semibold mb-4 text-blue-300">Monthly Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={stats?.monthly_trend || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip />
                  <Line type="monotone" dataKey="avg_risk" stroke="#10b981" strokeWidth={2} name="Avg Risk" />
                  <Line type="monotone" dataKey="predictions" stroke="#3b82f6" strokeWidth={2} name="Predictions" />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Export Button */}
          <motion.div
            className="flex justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <button
              onClick={handleExport}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export Data
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Model Tab */}
      {activeTab === "model" && (
        <motion.div
          className="bg-gray-800 p-6 rounded-lg border border-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h3 className="text-xl font-semibold mb-6 text-blue-300">ML Model Management</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Model Status */}
            <div className="bg-gray-700 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Model Status</h4>
              <div className="space-y-2">
                <p className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className={modelStatus?.status === "ready" ? "text-green-400" : "text-yellow-400"}>
                    {modelStatus?.status || "Unknown"}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-400">Version:</span>
                  <span className="text-white">{modelStatus?.model_version || "N/A"}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-400">Accuracy:</span>
                  <span className="text-white">{modelStatus?.accuracy ? `${(modelStatus.accuracy * 100).toFixed(1)}%` : "N/A"}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-400">Trained:</span>
                  <span className="text-white">{modelStatus?.trained || "Never"}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-400">Training Samples:</span>
                  <span className="text-white">{modelStatus?.training_samples || 0}</span>
                </p>
              </div>
            </div>

            {/* Retrain Button */}
            <div className="bg-gray-700 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Train Model</h4>
              <p className="text-gray-400 text-sm mb-4">
                Retrain the ML model with the latest student data to improve prediction accuracy.
              </p>
              <button
                onClick={handleRetrain}
                disabled={retrainLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded-lg w-full"
              >
                {retrainLoading ? "Training..." : "Retrain Model"}
              </button>
              {retrainMsg && (
                <p className={`mt-3 text-sm ${retrainMsg.includes("Failed") ? "text-red-400" : "text-green-400"}`}>
                  {retrainMsg}
                </p>
              )}
            </div>
          </div>

          {/* Feature Importance */}
          {modelStatus?.feature_importance?.length > 0 && (
            <motion.div
              className="mt-6 bg-gray-700 p-4 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h4 className="font-semibold mb-3">Feature Importance</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={modelStatus.feature_importance}
                  layout="vertical"
                  margin={{ left: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis type="number" stroke="#9ca3af" />
                  <YAxis dataKey="feature" type="category" stroke="#9ca3af" width={100} />
                  <Tooltip />
                  <Bar dataKey="importance" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <motion.section
          className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h3 className="text-lg font-semibold mb-3 text-blue-300">Users</h3>

          {users.length === 0 ? (
            <p className="text-gray-400">No users found</p>
          ) : (
            <motion.table
              className="w-full border border-gray-700 text-left border-collapse text-gray-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <thead className="bg-gray-700">
                <tr>
                  <th className="p-3 border border-gray-600">ID</th>
                  <th className="p-3 border border-gray-600">Username</th>
                  <th className="p-3 border border-gray-600">Role</th>
                </tr>
              </thead>

              <motion.tbody>
                {users.map((u, i) => (
                  <motion.tr
                    key={u.id}
                    className="hover:bg-gray-700 transition"
                    custom={i}
                    variants={rowAnim}
                    initial="hidden"
                    animate="visible"
                  >
                    <td className="p-3 border border-gray-600">{u.id}</td>
                    <td className="p-3 border border-gray-600">
                      {u.username || "N/A"}
                    </td>
                    <td className="p-3 border border-gray-600 capitalize">
                      {u.role}
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </motion.table>
          )}
        </motion.section>
      )}

      {/* Upload Tab */}
      {activeTab === "upload" && (
        <motion.section
          className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h3 className="text-lg font-semibold mb-3 text-blue-300">
            Upload CSV
          </h3>
          <div className="flex flex-col space-y-3">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="bg-gray-700 text-white p-2 rounded border border-gray-600"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleUpload}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Upload CSV
            </motion.button>
            {uploadStatus && (
              <p className={`text-sm ${uploadStatus.includes("failed") || uploadStatus.includes("Please") ? "text-red-400" : "text-green-400"}`}>
                {uploadStatus}
              </p>
            )}
          </div>
        </motion.section>
      )}
    </motion.div>
  );
}
