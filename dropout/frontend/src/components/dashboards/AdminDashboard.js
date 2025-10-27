import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../../api";

export default function AdminDashboard({ user }) {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const fetchedOnce = useRef(false); // prevent re-fetching repeatedly

  useEffect(() => {
    if (!user || fetchedOnce.current) return;
    fetchedOnce.current = true;

    const fetchData = async () => {
      setLoading(true);
      setErr("");
      try {
        const headers = { Authorization: `Bearer ${user.token}` };
        const [usersRes, analyticsRes] = await Promise.all([
          API.get("/admin/users", { headers }),
          API.get("/admin/analytics", { headers }),
        ]);
        setUsers(usersRes.data || []);
        setStats(analyticsRes.data || null);
      } catch (error) {
        console.error(error);
        setErr(error.response?.data?.error || "Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (!user) return <div>Please login</div>;
  if (loading)
    return (
      <motion.div
        className="text-center mt-10 text-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Loading admin data...
      </motion.div>
    );
  if (err)
    return (
      <motion.div
        className="text-red-500 mt-10 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {err}
      </motion.div>
    );

  // Animation presets
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
      style={{ padding: 20 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h2
        className="text-xl font-bold mb-4 text-gray-800"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5 }}
      >
        Admin Dashboard
      </motion.h2>

      <motion.section
        className="mb-6 bg-white p-4 rounded-lg shadow-md"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <h3 className="text-lg font-semibold mb-2 text-gray-700">
          System Analytics
        </h3>
        <AnimatePresence>
          {stats ? (
            <motion.div
              key="stats"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Total students:{" "}
              <span className="font-medium text-blue-600">
                {stats.total_students}
              </span>
              , High risk:{" "}
              <span className="font-medium text-red-500">
                {stats.high_risk_count}
              </span>
            </motion.div>
          ) : (
            <motion.p
              key="no-stats"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              No analytics data available
            </motion.p>
          )}
        </AnimatePresence>
      </motion.section>

      <motion.section
        className="bg-white p-4 rounded-lg shadow-md"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Users</h3>
        {users.length === 0 ? (
          <p>No users found</p>
        ) : (
          <motion.table
            className="w-full border border-gray-300 text-left border-collapse"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Username</th>
                <th className="p-2 border">Role</th>
              </tr>
            </thead>
            <motion.tbody>
              {users.map((u, i) => (
                <motion.tr
                  key={u.id}
                  className="hover:bg-gray-50"
                  custom={i}
                  variants={tableRowAnim}
                  initial="hidden"
                  animate="visible"
                >
                  <td className="p-2 border">{u.id}</td>
                  <td className="p-2 border">{u.username}</td>
                  <td className="p-2 border">{u.role}</td>
                </motion.tr>
              ))}
            </motion.tbody>
          </motion.table>
        )}
      </motion.section>
    </motion.div>
  );
}
