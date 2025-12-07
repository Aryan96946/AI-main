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
      navigate("/login");
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
        if (error.response?.status === 401) handleLogout();
        else setErr(error.response?.data?.error || "Failed to load profile");
      }
    };

    fetchProfile();
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
    {
      label: "Latest Risk Score",
      value: (
        <span className={riskColor}>
          {latestRiskScore} ({latestRiskTier})
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
