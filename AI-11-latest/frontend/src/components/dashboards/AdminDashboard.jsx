import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import API from "../../api";

export default function AdminDashboard({ user, onLogout }) {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const fetchedOnce = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || fetchedOnce.current) return;
    fetchedOnce.current = true;

    const fetchData = async () => {
      setLoading(true);
      setErr("");
      try {
        const token = user.token || localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        const [usersRes, analyticsRes] = await Promise.all([
          API.get("/admin/users", { headers }),
          API.get("/admin/analytics", { headers }),
        ]);
        setUsers(usersRes.data || []);
        setStats(analyticsRes.data || null);
      } catch (error) {
        setErr(error.response?.data?.error || "Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleLogout = () => {
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
        Loading admin data...
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

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

  const tableRowAnim = {
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
      transition={{ duration: 0.6 }}
    >
      <div className="flex justify-between items-center mb-6">
        <motion.h2
          className="text-2xl font-bold text-blue-400"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5 }}
        >
          Admin Dashboard
        </motion.h2>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </motion.button>
      </div>

      <motion.section
        className="mb-6 bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <h3 className="text-lg font-semibold mb-3 text-blue-300">
          System Analytics
        </h3>
        <AnimatePresence>
          {stats ? (
            <motion.div
              key="stats"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-gray-200"
            >
              Total students:{" "}
              <span className="font-semibold text-blue-400">
                {stats.total_students}
              </span>
              {" | "}High risk:{" "}
              <span className="font-semibold text-red-400">
                {stats.high_risk_count}
              </span>
            </motion.div>
          ) : (
            <motion.p
              key="no-stats"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-gray-400"
            >
              No analytics data available
            </motion.p>
          )}
        </AnimatePresence>
      </motion.section>

      <motion.section
        className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700"
        variants={fadeInUp}
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
                <th className="p-3 border border-gray-600 font-medium">ID</th>
                <th className="p-3 border border-gray-600 font-medium">
                  Username
                </th>
                <th className="p-3 border border-gray-600 font-medium">Role</th>
              </tr>
            </thead>
            <motion.tbody>
              {users.map((u, i) => (
                <motion.tr
                  key={u.id}
                  className="hover:bg-gray-700 transition"
                  custom={i}
                  variants={tableRowAnim}
                  initial="hidden"
                  animate="visible"
                >
                  <td className="p-3 border border-gray-600">{u.id}</td>
                  <td className="p-3 border border-gray-600">{u.username}</td>
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
