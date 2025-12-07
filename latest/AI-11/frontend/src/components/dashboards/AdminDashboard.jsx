import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import API from "../../api";

export default function AdminDashboard({ user, onLogout }) {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
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

      <motion.section
        className="mb-6 bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700"
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <h3 className="text-lg font-semibold mb-3 text-blue-300">
          System Analytics
        </h3>
        <AnimatePresence>
          <motion.div
            key="stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-200"
          >
            <p>
              Total students:{" "}
              <span className="font-semibold text-blue-400">
                {stats.total_students || 0}
              </span>
            </p>
            <p>
              High-risk predictions:{" "}
              <span className="font-semibold text-red-400">
                {stats.high_risk_count || 0}
              </span>
            </p>
            <p>
              ML Model Version:{" "}
              <span className="font-semibold text-green-400">
                {stats.model_version || "N/A"}
              </span>
            </p>
          </motion.div>
        </AnimatePresence>
      </motion.section>

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
    </motion.div>
  );
}
