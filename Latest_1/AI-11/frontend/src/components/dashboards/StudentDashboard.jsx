import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import API from "../../api";
import { useNavigate } from "react-router-dom";

export default function StudentDashboard({ user, setUser }) {
  const [profile, setProfile] = useState(null);
  const [allStudents, setAllStudents] = useState([]);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      setErr("");
      try {
        // Always fetch personal profile
        const profileRes = await API.get("/students/me", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setProfile(profileRes.data.student);

        // If admin or teacher, also fetch all students
        if (user.role === 'admin' || user.role === 'teacher') {
          const allRes = await API.get("/students/", {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          setAllStudents(allRes.data.students);
        }
      } catch (error) {
        if (error.response?.status === 401) handleLogout();
        else setErr(error.response?.data?.error || "Failed to load data");
      }
    };

    fetchData();
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login", { replace: true });
  };

  if (err)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-red-400 text-xl">
        {err}
      </div>
    );

  if (!profile)
    return (
      <div className="min-h-screen bg-gray-900 text-gray-400 p-6 text-center">
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
        >
          Loading profile...
        </motion.div>
      </div>
    );

  const latestPrediction =
    profile.predictions?.[profile.predictions.length - 1];

  const latestRiskScore = latestPrediction?.risk_score ?? "N/A";
  const latestRiskTier = latestPrediction?.risk_tier ?? "Unknown";

  const riskColor =
    latestRiskTier === "High"
      ? "text-red-400"
      : latestRiskTier === "Medium"
      ? "text-yellow-300"
      : "text-emerald-400";

  // Prepare chart data
  const performanceData = [
    {
      name: "Attendance",
      value: profile.attendance || 0,
      color: "#3b82f6"
    },
    {
      name: "Average Score",
      value: profile.avg_score || 0,
      color: "#10b981"
    },
    {
      name: "Overall Grade",
      value: profile.grade || 0,
      color: "#f59e0b"
    }
  ];

  const semesterData = [
    {
      semester: "1st Sem",
      enrolled: profile.curricular_units_1st_sem_enrolled || 0,
      approved: profile.curricular_units_1st_sem_approved || 0,
      grade: profile.curricular_units_1st_sem_grade || 0
    },
    {
      semester: "2nd Sem",
      enrolled: profile.curricular_units_2nd_sem_enrolled || 0,
      approved: profile.curricular_units_2nd_sem_approved || 0,
      grade: profile.curricular_units_2nd_sem_grade || 0
    }
  ];

  const riskData = profile.predictions?.map((p, index) => ({
    prediction: `Prediction ${index + 1}`,
    riskScore: p.risk_score,
    riskTier: p.risk_tier === "High" ? 3 : p.risk_tier === "Medium" ? 2 : 1
  })) || [];

  const fields = [
    { label: "Name", value: profile.full_name },
    { label: "Course", value: profile.course },
    { label: "Gender", value: profile.gender },
    { label: "Age at Enrollment", value: profile.age_at_enrollment },
    { label: "Marital Status", value: profile.marital_status },
    { label: "Application Mode", value: profile.application_mode },
    {
      label: "Scholarship Holder",
      value: profile.scholarship_holder ? "Yes" : "No",
    },
    { label: "Debtor", value: profile.debtor ? "Yes" : "No" },
    {
      label: "Tuition Fees Up To Date",
      value: profile.tuition_fees_up_to_date ? "Yes" : "No",
    },
    {
      label: "1st Sem - Enrolled",
      value: profile.curricular_units_1st_sem_enrolled,
    },
    {
      label: "1st Sem - Approved",
      value: profile.curricular_units_1st_sem_approved,
    },
    {
      label: "1st Sem - Grade",
      value: profile.curricular_units_1st_sem_grade,
    },
    {
      label: "2nd Sem - Enrolled",
      value: profile.curricular_units_2nd_sem_enrolled,
    },
    {
      label: "2nd Sem - Approved",
      value: profile.curricular_units_2nd_sem_approved,
    },
    {
      label: "2nd Sem - Grade",
      value: profile.curricular_units_2nd_sem_grade,
    },
    { label: "Overall Grade", value: profile.grade },
    { label: "Attendance (%)", value: profile.attendance },
    { label: "Average Score", value: profile.avg_score },
    {
      label: "Latest Risk",
      value: (
        <span className={riskColor}>
          {latestRiskTier}
        </span>
      ),
      colSpan: true,
    },
  ];

  return (
    <motion.div
      className="min-h-screen bg-gray-900 text-white p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex justify-between items-center mb-8">
        <motion.h2
          className="text-3xl font-bold text-emerald-400"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
        >
          Student Dashboard
        </motion.h2>

        <motion.button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold"
          whileHover={{ scale: 1.05 }}
        >
          Logout
        </motion.button>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
        }}
      >
        {fields.map((item, index) => (
          <motion.div
            key={index}
            className={`p-4 border border-gray-700 rounded-xl bg-gray-800 shadow-lg ${
              item.colSpan ? "md:col-span-2" : ""
            }`}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            whileHover={{ scale: 1.03 }}
          >
            <strong className="text-emerald-400">{item.label}: </strong>
            <span className="text-gray-200">{item.value}</span>
          </motion.div>
        ))}
      </motion.div>

      <motion.h3
        className="text-2xl font-semibold mb-4 text-emerald-400 mt-8"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        Performance Metrics
      </motion.h3>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
        }}
      >
        <motion.div
          className="p-4 border border-gray-700 rounded-xl bg-gray-800 shadow-lg"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <h4 className="text-lg font-semibold text-emerald-400 mb-4">Performance Overview</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="value" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          className="p-4 border border-gray-700 rounded-xl bg-gray-800 shadow-lg"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <h4 className="text-lg font-semibold text-emerald-400 mb-4">Semester Progress</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={semesterData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="semester" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Line type="monotone" dataKey="enrolled" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="approved" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="grade" stroke="#f59e0b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </motion.div>

      {riskData.length > 0 && (
        <motion.div
          className="p-4 border border-gray-700 rounded-xl bg-gray-800 shadow-lg mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h4 className="text-lg font-semibold text-emerald-400 mb-4">Risk Assessment Trend</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={riskData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="prediction" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Line type="monotone" dataKey="riskScore" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      <motion.h3
        className="text-2xl font-semibold mb-4 text-emerald-400"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        Counseling Sessions
      </motion.h3>

      {profile.counseling_sessions?.length ? (
        <motion.div
          className="space-y-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
          }}
        >
          {profile.counseling_sessions.map((s, index) => (
            <motion.div
              key={s.id || index}
              className="p-4 border border-gray-700 rounded-xl bg-gray-800 shadow-lg"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ scale: 1.02 }}
            >
              <small className="text-gray-400 block">
                {new Date(s.created_at).toLocaleString()}
              </small>
              <p className="mt-1 text-gray-200">{s.notes}</p>

              {s.follow_up_at && (
                <p className="mt-2 text-sm text-blue-400">
                  Follow-up: {new Date(s.follow_up_at).toLocaleString()}
                </p>
              )}
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.p
          className="text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No counseling sessions yet.
        </motion.p>
      )}
    </motion.div>
  );
}
