import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Users, Activity, TrendingUp, AlertTriangle, Upload, Settings,
  Server, Shield, Zap, Clock, CheckCircle, XCircle, RefreshCw,
  BarChart3, PieChart as PieChartIcon, FileText, Database
} from "lucide-react";
import API from "../../api";
import GlassCard from "../shared/GlassCard";
import StatCard from "../shared/StatCard";
import AnimatedCounter from "../shared/AnimatedCounter";
import Tabs from "../shared/Tabs";
import ProgressRing from "../shared/ProgressRing";

export default function AdminDashboard({ user, onLogout }) {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const fetched = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || fetched.current) return;
    fetched.current = true;

    const loadData = async () => {
      setLoading(true);
      setErr("");

      try {
        const [usersRes, statsRes] = await Promise.all([
          API.get("/admin/users"),
          API.get("/admin/analytics"),
        ]);

        setUsers(usersRes.data || []);
        setStats(statsRes.data || {});
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
      await API.post("/upload_csv", formData);
      setUploadStatus("CSV uploaded successfully!");
      setSelectedFile(null);
      setTimeout(() => setUploadStatus(""), 3000);
    } catch (error) {
      setUploadStatus("Upload failed: " + (error.response?.data?.error || error.message));
      setTimeout(() => setUploadStatus(""), 3000);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const [usersRes, statsRes] = await Promise.all([
        API.get("/admin/users"),
        API.get("/admin/analytics"),
      ]);
      setUsers(usersRes.data || []);
      setStats(statsRes.data || {});
    } catch (error) {
      setErr(error.response?.data?.error || "Failed to refresh data");
    } finally {
      setLoading(false);
    }
  };

  if (!user)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <motion.div
          className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 text-white px-8 py-6 rounded-2xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          Please login
        </motion.div>
      </div>
    );

  if (loading)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <motion.div
          className="flex flex-col items-center gap-4"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
        >
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          <span className="text-gray-400 text-lg">Loading dashboard...</span>
        </motion.div>
      </div>
    );

  if (err)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <motion.div
          className="bg-red-500/20 border border-red-500/50 text-red-400 px-8 py-6 rounded-2xl backdrop-blur-xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {err}
        </motion.div>
      </div>
    );

  // Sample activity data
  const recentActivity = [
    { type: "upload", message: "Student data CSV uploaded", time: "2 mins ago", icon: Upload, color: "emerald" },
    { type: "prediction", message: "Batch prediction completed", time: "15 mins ago", icon: Activity, color: "blue" },
    { type: "counseling", message: "New counseling session added", time: "1 hour ago", icon: Clock, color: "purple" },
    { type: "user", message: "New teacher account created", time: "2 hours ago", icon: Users, color: "cyan" },
    { type: "alert", message: "3 students flagged as high risk", time: "3 hours ago", icon: AlertTriangle, color: "red" },
  ];

  const systemHealth = [
    { name: "Database", status: "healthy", uptime: "99.9%", icon: Database },
    { name: "ML Service", status: "healthy", uptime: "99.5%", icon: Server },
    { name: "API", status: "healthy", uptime: "99.8%", icon: Zap },
    { name: "Storage", status: "healthy", uptime: "100%", icon: FileText },
  ];

  const tabs = [
    {
      label: "Overview",
      icon: <BarChart3 size={18} />,
      content: (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard 
              title="Total Students" 
              value={stats.total_students || 0} 
              icon={Users} 
              color="blue"
            />
            <StatCard 
              title="High Risk" 
              value={stats.high_risk_count || 0} 
              icon={AlertTriangle} 
              color="red"
            />
            <StatCard 
              title="Active Users" 
              value={users.length} 
              icon={Activity} 
              color="emerald"
            />
            <StatCard 
              title="ML Version" 
              value={stats.model_version || "N/A"} 
              icon={Settings} 
              color="purple"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard glowEffect>
              <h4 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
                <Activity size={20} /> System Health
              </h4>
              <div className="space-y-4">
                {systemHealth.map((item, index) => (
                  <motion.div
                    key={item.name}
                    className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        item.status === "healthy" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                      }`}>
                        <item.icon size={18} />
                      </div>
                      <div>
                        <p className="text-white font-medium">{item.name}</p>
                        <p className="text-xs text-gray-400">Uptime: {item.uptime}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${item.status === "healthy" ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
                      <span className="text-xs text-gray-400 capitalize">{item.status}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            <GlassCard glowEffect>
              <h4 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
                <Clock size={20} /> Recent Activity
              </h4>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-xl"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className={`p-2 rounded-lg bg-${activity.color}-500/20`}>
                      <activity.icon size={16} className={`text-${activity.color}-400`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm">{activity.message}</p>
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Progress Rings */}
          <GlassCard>
            <h4 className="text-lg font-semibold text-blue-400 mb-6 flex items-center gap-2">
              <PieChartIcon size={20} /> System Overview
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="flex flex-col items-center">
                <ProgressRing 
                  progress={Math.min(((stats.total_students || 0) / 100) * 100, 100)} 
                  color="#3b82f6" 
                  label="Students"
                  size="small"
                />
              </div>
              <div className="flex flex-col items-center">
                <ProgressRing 
                  progress={Math.min((1 - (stats.high_risk_count || 0) / Math.max(stats.total_students || 1, 1)) * 100, 100)} 
                  color="#10b981" 
                  label="Success Rate"
                  size="small"
                />
              </div>
              <div className="flex flex-col items-center">
                <ProgressRing 
                  progress={85} 
                  color="#f59e0b" 
                  label="Engagement"
                  size="small"
                />
              </div>
              <div className="flex flex-col items-center">
                <ProgressRing 
                  progress={92} 
                  color="#8b5cf6" 
                  label="Retention"
                  size="small"
                />
              </div>
            </div>
          </GlassCard>
        </div>
      )
    },
    {
      label: "Users",
      icon: <Users size={18} />,
      content: (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-semibold text-blue-400">User Management</h4>
            <motion.button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-sm transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RefreshCw size={16} />
              Refresh
            </motion.button>
          </div>

          {users.length === 0 ? (
            <GlassCard>
              <div className="text-center py-12">
                <Users className="mx-auto text-gray-600 mb-4" size={48} />
                <p className="text-gray-400">No users found</p>
              </div>
            </GlassCard>
          ) : (
            <GlassCard>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-400 text-sm border-b border-gray-700/50">
                      <th className="pb-4 font-medium">ID</th>
                      <th className="pb-4 font-medium">Username</th>
                      <th className="pb-4 font-medium">Role</th>
                      <th className="pb-4 font-medium">Status</th>
                      <th className="pb-4 font-medium text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, index) => (
                      <motion.tr
                        key={u.id}
                        className="border-b border-gray-700/30 hover:bg-gray-700/20 transition-colors"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <td className="py-4 text-gray-300">#{u.id}</td>
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                              {u.username?.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-white font-medium">{u.username}</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            u.role === "admin" ? "bg-purple-500/20 text-purple-400" :
                            u.role === "teacher" ? "bg-blue-500/20 text-blue-400" :
                            "bg-emerald-500/20 text-emerald-400"
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-sm text-gray-400">Active</span>
                          </div>
                        </td>
                        <td className="py-4 text-center">
                          <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                            <Settings size={18} className="text-gray-400" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          )}
        </div>
      )
    },
    {
      label: "Upload",
      icon: <Upload size={18} />,
      content: (
        <div className="space-y-6">
          <GlassCard>
            <h4 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
              <FileText size={20} /> Upload Student Data
            </h4>
            <p className="text-gray-400 mb-6">
              Upload a CSV file to bulk import or update student records. 
              The file should contain student information with proper column headers.
            </p>
            
            <div className="border-2 border-dashed border-gray-700/50 rounded-2xl p-8 text-center hover:border-blue-500/50 transition-colors">
              <Upload className="mx-auto text-gray-500 mb-4" size={48} />
              <p className="text-gray-300 mb-2">Drag and drop your CSV file here</p>
              <p className="text-sm text-gray-500 mb-4">or click to browse</p>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                id="csv-upload"
              />
              <label
                htmlFor="csv-upload"
                className="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium cursor-pointer transition-colors"
              >
                Select File
              </label>
              {selectedFile && (
                <motion.p 
                  className="mt-4 text-emerald-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Selected: {selectedFile.name}
                </motion.p>
              )}
            </div>

            <div className="mt-6 flex gap-4">
              <motion.button
                onClick={handleUpload}
                disabled={!selectedFile}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  selectedFile 
                    ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg hover:shadow-emerald-500/25" 
                    : "bg-gray-700 text-gray-500 cursor-not-allowed"
                }`}
                whileHover={selectedFile ? { scale: 1.02 } : {}}
                whileTap={selectedFile ? { scale: 0.98 } : {}}
              >
                <Upload size={20} />
                Upload CSV
              </motion.button>
            </div>

            {uploadStatus && (
              <motion.div
                className={`mt-4 p-4 rounded-xl flex items-center gap-3 ${
                  uploadStatus.includes("failed") || uploadStatus.includes("Please")
                    ? "bg-red-500/20 border border-red-500/30 text-red-400"
                    : "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400"
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {uploadStatus.includes("failed") || uploadStatus.includes("Please") ? (
                  <XCircle size={20} />
                ) : (
                  <CheckCircle size={20} />
                )}
                <span>{uploadStatus}</span>
              </motion.div>
            )}
          </GlassCard>

          <GlassCard>
            <h4 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
              <Shield size={20} /> Data Guidelines
            </h4>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
                <CheckCircle size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                <p>Ensure CSV file is properly formatted with headers in the first row</p>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
                <CheckCircle size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                <p>Required columns: student_id, full_name, course, attendance, academic_score</p>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
                <CheckCircle size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                <p>File size should not exceed 10MB for optimal performance</p>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
                <CheckCircle size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                <p>Back up existing data before performing bulk uploads</p>
              </div>
            </div>
          </GlassCard>
        </div>
      )
    },
    {
      label: "Settings",
      icon: <Settings size={18} />,
      content: (
        <div className="space-y-6">
          <GlassCard>
            <h4 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
              <Zap size={20} /> Quick Actions
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.button
                className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl hover:bg-gray-700/50 transition-colors text-left"
                whileHover={{ scale: 1.02 }}
              >
                <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
                  <RefreshCw size={24} />
                </div>
                <div>
                  <p className="text-white font-medium">Rebuild Model</p>
                  <p className="text-xs text-gray-400">Retrain ML predictions</p>
                </div>
              </motion.button>

              <motion.button
                className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl hover:bg-gray-700/50 transition-colors text-left"
                whileHover={{ scale: 1.02 }}
              >
                <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400">
                  <Database size={24} />
                </div>
                <div>
                  <p className="text-white font-medium">Backup Data</p>
                  <p className="text-xs text-gray-400">Export all records</p>
                </div>
              </motion.button>

              <motion.button
                className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl hover:bg-gray-700/50 transition-colors text-left"
                whileHover={{ scale: 1.02 }}
              >
                <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400">
                  <Activity size={24} />
                </div>
                <div>
                  <p className="text-white font-medium">System Logs</p>
                  <p className="text-xs text-gray-400">View audit trail</p>
                </div>
              </motion.button>

              <motion.button
                className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl hover:bg-gray-700/50 transition-colors text-left"
                whileHover={{ scale: 1.02 }}
              >
                <div className="p-3 bg-amber-500/20 rounded-xl text-amber-400">
                  <Settings size={24} />
                </div>
                <div>
                  <p className="text-white font-medium">Preferences</p>
                  <p className="text-xs text-gray-400">Configure system</p>
                </div>
              </motion.button>
            </div>
          </GlassCard>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.5, 1], x: [0, 50, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/3 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 p-6">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Admin Dashboard
            </h2>
            <p className="text-gray-400 text-sm mt-1">System administration and monitoring</p>
          </div>
          <motion.button
            onClick={logout}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-xl font-medium border border-red-500/30 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Logout
          </motion.button>
        </motion.div>

        {/* Tabs */}
        <Tabs tabs={tabs} defaultTab={0} />
      </div>
    </div>
  );
}

