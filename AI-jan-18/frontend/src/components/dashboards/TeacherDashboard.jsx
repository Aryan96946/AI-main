import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  Calendar, Edit, Trash2, Eye, ChevronRight
} from "recharts";
import { 
  Users, TrendingUp, AlertTriangle, CheckCircle, Upload, 
  RefreshCw, Search, Filter, Bell, ChevronDown, BookOpen,
  Target, Activity, Award, MoreVertical, Plus, FileText, Clock
} from "lucide-react";
import API from "../../api";
import { useNavigate } from "react-router-dom";
import GlassCard from "../shared/GlassCard";
import StatCard from "../shared/StatCard";
import AnimatedCounter from "../shared/AnimatedCounter";
import RiskMeter from "../shared/RiskMeter";
import Tabs from "../shared/Tabs";
import ProgressRing from "../shared/ProgressRing";

export default function TeacherDashboard({ user, setUser }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [notes, setNotes] = useState("");
  const [followUp, setFollowUp] = useState("");
  const [msg, setMsg] = useState("");
  const [uploadMsg, setUploadMsg] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRisk, setFilterRisk] = useState("all");
  const [counselingHistory, setCounselingHistory] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  
  // New counseling form fields
  const [sessionType, setSessionType] = useState("academic");
  const [severity, setSeverity] = useState("medium");
  const [outcomes, setOutcomes] = useState("");
  const [nextSteps, setNextSteps] = useState("");
  const [status, setStatus] = useState("scheduled");

  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.token) {
      navigate("/login");
      return;
    }

    const fetchStudents = async () => {
      setErr("");
      setLoading(true);
      try {
        const res = await API.get("/teachers/students");
        setStudents(res.data.students || []);
      } catch (error) {
        setErr(error.response?.data?.error || "Failed to load students");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [user, navigate]);

  // Data processing for enhanced charts
  const getRiskDistribution = () => {
    const riskCounts = { High: 0, Medium: 0, Low: 0, Minimal: 0 };
    students.forEach(student => {
      const risk = student.risk_label || "Unknown";
      if (riskCounts.hasOwnProperty(risk)) {
        riskCounts[risk]++;
      }
    });
    return Object.entries(riskCounts).map(([name, value]) => ({ name, value: value || 0 }));
  };

  const getAttendanceByCourse = () => {
    const courseData = {};
    students.forEach(student => {
      const course = student.course || "Unknown";
      if (!courseData[course]) {
        courseData[course] = { total: 0, count: 0 };
      }
      if (student.attendance !== null && student.attendance !== undefined) {
        courseData[course].total += student.attendance;
        courseData[course].count += 1;
      }
    });
    return Object.entries(courseData).map(([course, data]) => ({
      course,
      average: data.count > 0 ? Math.round(data.total / data.count) : 0
    }));
  };

  const getAcademicScoresByCourse = () => {
    const courseData = {};
    students.forEach(student => {
      const course = student.course || "Unknown";
      if (!courseData[course]) {
        courseData[course] = { total: 0, count: 0 };
      }
      if (student.academic_score !== null && student.academic_score !== undefined) {
        courseData[course].total += student.academic_score;
        courseData[course].count += 1;
      }
    });
    return Object.entries(courseData).map(([course, data]) => ({
      course,
      average: data.count > 0 ? Math.round(data.total / data.count) : 0
    }));
  };

  const getPerformanceTrend = () => {
    return students.slice(0, 10).map((s, i) => ({
      student: s.full_name?.split(" ")[0] || `S${i+1}`,
      attendance: s.attendance || 0,
      score: s.academic_score || 0,
      risk: s.risk_label === "High" ? 100 : s.risk_label === "Medium" ? 60 : 30
    }));
  };

  const getCoursePerformance = () => {
    const courseData = {};
    students.forEach(student => {
      const course = student.course || "Unknown";
      if (!courseData[course]) {
        courseData[course] = { total: 0, count: 0, risk: 0 };
      }
      courseData[course].total += student.academic_score || 0;
      courseData[course].count += 1;
      courseData[course].risk += student.risk_label === "High" ? 3 : student.risk_label === "Medium" ? 2 : 1;
    });
    return Object.entries(courseData).map(([course, data]) => ({
      course,
      performance: data.count > 0 ? Math.round(data.total / data.count) : 0,
      avgRisk: (data.risk / data.count).toFixed(1)
    }));
  };

  const riskColors = {
    High: "#ef4444",
    Medium: "#f59e0b",
    Low: "#10b981",
    Minimal: "#6b7280"
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login", { replace: true });
  };

  const batchPredict = async () => {
    try {
      await API.post("/teachers/batch_predict");
      setMsg("Batch prediction complete!");
      setTimeout(() => setMsg(""), 3000);
    } catch (error) {
      setMsg(error.response?.data?.error || "Batch prediction failed");
      setTimeout(() => setMsg(""), 3000);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      setUploadMsg("Please select a file first.");
      setTimeout(() => setUploadMsg(""), 3000);
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await API.post("/upload_csv", formData);
      setUploadMsg("CSV uploaded successfully!");
      setSelectedFile(null);
      setTimeout(() => setUploadMsg(""), 3000);
    } catch (error) {
      setUploadMsg(error.response?.data?.error || "Upload failed.");
      setTimeout(() => setUploadMsg(""), 3000);
    }
  };

  const handleAddCounseling = async (e) => {
    e.preventDefault();
    try {
      await API.post("/counseling/add", {
        student_id: selectedStudent.id,
        notes,
        follow_up_at: followUp,
      });
      setMsg("Counseling added successfully!");
      setNotes("");
      setFollowUp("");
      setTimeout(() => {
        setSelectedStudent(null);
        setMsg("");
      }, 1500);
    } catch {
      setMsg("Failed to add counseling");
      setTimeout(() => setMsg(""), 3000);
    }
  };

  const riskColor = (risk) => {
    if (!risk) return "text-gray-400";
    if (risk === "Very High") return "text-red-700 font-bold";
    if (risk === "High") return "text-red-500 font-bold";
    if (risk === "Moderate") return "text-yellow-500 font-bold";
    if (risk === "Low") return "text-green-500 font-bold";
    if (risk === "Minimal") return "text-green-400 font-bold";
    return "text-gray-400 font-bold";
  };

  const getRiskBg = (risk) => {
    if (!risk) return "bg-gray-500/20";
    if (risk === "High" || risk === "Very High") return "bg-red-500/20";
    if (risk === "Moderate") return "bg-yellow-500/20";
    return "bg-green-500/20";
  };

  // Filter students
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.course?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterRisk === "all" || s.risk_label === filterRisk;
    return matchesSearch && matchesFilter;
  });

  const highRiskCount = students.filter(s => s.risk_label === "High" || s.risk_label === "Very High").length;
  const avgAttendance = students.length > 0 
    ? Math.round(students.reduce((acc, s) => acc + (s.attendance || 0), 0) / students.length)
    : 0;
  const avgScore = students.length > 0
    ? Math.round(students.reduce((acc, s) => acc + (s.academic_score || 0), 0) / students.length)
    : 0;

  if (loading) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <motion.div
        className="flex flex-col items-center gap-4"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ repeat: Infinity, duration: 1.2 }}
      >
        <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        <span className="text-gray-400 text-lg">Loading students...</span>
      </motion.div>
    </div>
  );

  if (err) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <motion.div
        className="bg-red-500/20 border border-red-500/50 text-red-400 px-8 py-6 rounded-2xl text-xl backdrop-blur-xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {err}
      </motion.div>
    </div>
  );

  const tabs = [
    {
      label: "Analytics",
      icon: <Activity size={18} />,
      content: (
        <div className="space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard 
              title="Total Students" 
              value={students.length} 
              icon={Users} 
              color="blue"
            />
            <StatCard 
              title="High Risk" 
              value={highRiskCount} 
              icon={AlertTriangle} 
              color="red"
            />
            <StatCard 
              title="Avg Attendance" 
              value={avgAttendance} 
              suffix="%" 
              icon={Clock} 
              color="cyan"
            />
            <StatCard 
              title="Avg Score" 
              value={avgScore} 
              icon={Award} 
              color="emerald"
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard glowEffect>
              <h4 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
                <Target size={20} /> Risk Distribution
              </h4>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={getRiskDistribution()}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {getRiskDistribution().map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={Object.values(riskColors)[index % 4]}
                          stroke="none"
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                {Object.entries(riskColors).map(([risk, color]) => (
                  <div key={risk} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-xs text-gray-400">{risk}</span>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard glowEffect>
              <h4 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
                <TrendingUp size={20} /> Course Performance
              </h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={getCoursePerformance()}>
                  <defs>
                    <linearGradient id="courseGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="course" stroke="#9ca3af" fontSize={11} />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '12px' }} />
                  <Bar dataKey="performance" fill="url(#courseGradient)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>

            <GlassCard>
              <h4 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
                <Clock size={20} /> Attendance by Course
              </h4>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={getAttendanceByCourse()}>
                  <defs>
                    <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="course" stroke="#9ca3af" fontSize={11} />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '12px' }} />
                  <Area type="monotone" dataKey="average" stroke="#10b981" fill="url(#attendanceGradient)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </GlassCard>

            <GlassCard>
              <h4 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
                <BookOpen size={20} /> Academic Score by Course
              </h4>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={getAcademicScoresByCourse().map((item, i) => ({
                  subject: item.course.length > 10 ? item.course.slice(0, 10) + '...' : item.course,
                  score: item.average,
                  fullMark: 20
                }))}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 20]} tick={{ fill: '#6b7280', fontSize: 9 }} />
                  <Radar name="Score" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </GlassCard>
          </div>
        </div>
      )
    },
    {
      label: "Students",
      icon: <Users size={18} />,
      content: (
        <div className="space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-colors"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value)}
                className="bg-gray-800/50 border border-gray-700/50 rounded-xl pl-10 pr-8 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-colors appearance-none"
              >
                <option value="all">All Risk Levels</option>
                <option value="High">High Risk</option>
                <option value="Medium">Medium Risk</option>
                <option value="Low">Low Risk</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>

          {/* Students Table */}
          {filteredStudents.length === 0 ? (
            <GlassCard>
              <div className="text-center py-12">
                <Users className="mx-auto text-gray-600 mb-4" size={48} />
                <p className="text-gray-400">No students found matching your criteria.</p>
              </div>
            </GlassCard>
          ) : (
            <GlassCard>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-400 text-sm border-b border-gray-700/50">
                      <th className="pb-4 font-medium">Student</th>
                      <th className="pb-4 font-medium">Course</th>
                      <th className="pb-4 font-medium">Attendance</th>
                      <th className="pb-4 font-medium">Score</th>
                      <th className="pb-4 font-medium">Status</th>
                      <th className="pb-4 font-medium text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((s, index) => (
                      <motion.tr
                        key={s.id}
                        className="border-b border-gray-700/30 hover:bg-gray-700/20 transition-colors"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-semibold ${
                              s.risk_label === "High" ? "bg-red-500/30" :
                              s.risk_label === "Medium" ? "bg-yellow-500/30" : "bg-emerald-500/30"
                            }`}>
                              {s.full_name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-white font-medium">{s.full_name}</p>
                              <p className="text-xs text-gray-400">ID: {s.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-gray-300">{s.course || "N/A"}</td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  (s.attendance || 0) >= 80 ? "bg-emerald-500" :
                                  (s.attendance || 0) >= 60 ? "bg-yellow-500" : "bg-red-500"
                                }`}
                                style={{ width: `${s.attendance || 0}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-300">{s.attendance ?? "N/A"}%</span>
                          </div>
                        </td>
                        <td className="py-4 text-gray-300">{s.academic_score ?? 0}</td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskBg(s.risk_label)} ${riskColor(s.risk_label)}`}>
                            {s.risk_label || "N/A"}
                          </span>
                        </td>
                        <td className="py-4 text-center">
                          <button
                            onClick={() => setSelectedStudent(s)}
                            className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-sm font-medium transition-colors"
                          >
                            Add Counseling
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
      label: "Actions",
      icon: <RefreshCw size={18} />,
      content: (
        <div className="space-y-6">
          <GlassCard>
            <h4 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
              <Target size={20} /> Batch Predictions
            </h4>
            <p className="text-gray-400 mb-4">Run ML predictions for all students to update risk assessments.</p>
            <motion.button
              onClick={batchPredict}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-medium shadow-lg hover:shadow-blue-500/25 transition-shadow"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RefreshCw size={20} />
              Run Batch Prediction
            </motion.button>
            {msg && (
              <motion.p 
                className="mt-4 text-green-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {msg}
              </motion.p>
            )}
          </GlassCard>

          <GlassCard>
            <h4 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
              <Upload size={20} /> Upload Student Data
            </h4>
            <p className="text-gray-400 mb-4">Upload a CSV file to add or update student records.</p>
            <div className="flex flex-col gap-4">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-500/20 file:text-blue-400 hover:file:bg-blue-500/30 transition-colors"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleFileUpload}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-medium shadow-lg hover:shadow-emerald-500/25 transition-shadow"
              >
                <Upload size={20} />
                Upload CSV
              </motion.button>
              {uploadMsg && (
                <motion.p 
                  className={`text-sm ${uploadMsg.includes("failed") || uploadMsg.includes("Please") ? "text-red-400" : "text-green-400"}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {uploadMsg}
                </motion.p>
              )}
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
          className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.5, 1], x: [0, -50, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
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
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Teacher Dashboard
            </h2>
            <p className="text-gray-400 text-sm mt-1">Manage your students and track performance</p>
          </div>
          <motion.button
            onClick={handleLogout}
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

      {/* Counseling Modal */}
      <AnimatePresence>
        {selectedStudent && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 w-full max-w-md border border-gray-700/50"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="text-lg font-bold text-blue-400 mb-4">
                Add Counseling for {selectedStudent.full_name}
              </h3>
              <form onSubmit={handleAddCounseling} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-gray-900/50 p-3 rounded-xl border border-gray-700/50 text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                    rows="4"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Follow-up Date (optional)</label>
                  <input
                    type="datetime-local"
                    value={followUp}
                    onChange={(e) => setFollowUp(e.target.value)}
                    className="w-full bg-gray-900/50 p-3 rounded-xl border border-gray-700/50 text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedStudent(null)}
                    className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl font-medium text-white"
                  >
                    Save
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

