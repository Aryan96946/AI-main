import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../../api";
import { useNavigate } from "react-router-dom";

export default function StudentDashboard({ user, setUser }) {
  const [profile, setProfile] = useState(null);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login"); // Redirect immediately if no user
      return;
    }

    const fetchProfile = async () => {
      setErr("");
      try {
        const res = await API.get("/students/me", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setProfile(res.data.student);
      } catch (error) {
        console.error(error);
        setErr(error.response?.data?.error || "Failed to load profile");
      }
    };

    fetchProfile();
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);

    // Ensure redirect happens instantly
    setTimeout(() => navigate("/login"), 100);
  };

  if (!user) return null;
  if (err) return <div className="text-red-400 text-center p-4">{err}</div>;
  if (!profile) return <div className="text-gray-300 p-6">Loading profile...</div>;

  const latestRiskScore = profile.predictions?.length
    ? profile.predictions[profile.predictions.length - 1].risk_score
    : "N/A";

  return (
    <motion.div
      className="min-h-screen bg-gray-900 text-white p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
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
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold text-white transition"
          whileHover={{ scale: 1.05 }}
        >
          Logout
        </motion.button>
      </div>

      {/* Profile Info */}
      <motion.div
        className="grid grid-cols-2 gap-4 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {[
          { label: "Name", value: profile.full_name },
          { label: "Grade", value: profile.grade || "N/A" },
          { label: "Attendance", value: `${profile.attendance ?? "N/A"}%` },
          { label: "Avg Score", value: profile.avg_score ?? "N/A" },
          { label: "Latest Risk Score", value: latestRiskScore, colSpan: 2 },
        ].map((item, i) => (
          <motion.div
            key={i}
            className={`p-4 border border-gray-700 rounded-xl shadow-lg bg-gray-800 ${
              item.colSpan ? "col-span-2" : ""
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 + i * 0.1 }}
            whileHover={{ scale: 1.03 }}
          >
            <strong className="text-emerald-400">{item.label}:</strong>{" "}
            <span className="text-gray-200">{item.value}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Counseling Section */}
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
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 },
            },
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
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
            >
              <small className="text-gray-400">
                {new Date(s.created_at).toLocaleString()}
              </small>
              <p className="mt-1 text-gray-200">{s.notes}</p>
              {s.follow_up_at && (
                <p className="mt-1 text-sm text-blue-400">
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
          transition={{ delay: 0.5 }}
        >
          No counseling sessions yet
        </motion.p>
      )}
    </motion.div>
  );
}
