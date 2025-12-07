import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../../api";
import { useNavigate } from "react-router-dom";

export default function TeacherDashboard({ user, setUser }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [notes, setNotes] = useState("");
  const [followUp, setFollowUp] = useState("");
  const [msg, setMsg] = useState("");
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login", { replace: true });
  };

  const batchPredict = async () => {
    try {
      await API.post("/teachers/batch_predict");
      alert("Batch prediction complete. Refresh to update.");
    } catch (error) {
      alert(error.response?.data?.error || "Batch prediction failed");
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
      setMsg("Counseling added successfully");
      setNotes("");
      setFollowUp("");
      setTimeout(() => {
        setSelectedStudent(null);
        setMsg("");
      }, 1200);
    } catch {
      setMsg("Failed to add counseling");
    }
  };

  const riskColor = (risk) => {
    if (!risk) return "text-gray-300";
    if (risk === "High") return "text-red-500 font-bold";
    if (risk === "Medium") return "text-yellow-400 font-bold";
    return "text-green-400 font-bold";
  };

  if (loading) return <div className="text-gray-400 text-center mt-20">Loading students...</div>;
  if (err) return <div className="text-red-400 text-center mt-20">{err}</div>;

  return (
    <motion.div
      className="min-h-screen bg-gray-900 text-white p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-blue-400">Teacher Dashboard</h2>
        <motion.button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold"
          whileHover={{ scale: 1.05 }}
        >
          Logout
        </motion.button>
      </div>

      <motion.button
        onClick={batchPredict}
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md"
        whileHover={{ scale: 1.05 }}
      >
        Run Batch Prediction
      </motion.button>

      <h3 className="text-2xl font-semibold mb-4 text-blue-400">Students</h3>

      {students.length === 0 ? (
        <p className="text-gray-400">No students found.</p>
      ) : (
        <motion.table className="w-full border border-gray-700 text-left rounded-lg overflow-hidden shadow-lg bg-gray-800">
          <thead>
            <tr className="bg-gray-700 text-blue-400">
              <th className="px-3 py-2 border">Name</th>
              <th className="px-3 py-2 border">Course</th>
              <th className="px-3 py-2 border">Attendance</th>
              <th className="px-3 py-2 border">Academic Score</th>
              <th className="px-3 py-2 border">Fee Status</th>
              <th className="px-3 py-2 border">Scholarship</th>
              <th className="px-3 py-2 border">Risk</th>
              <th className="px-3 py-2 border text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s, index) => (
              <motion.tr
                key={s.id}
                className="hover:bg-gray-700 transition"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <td className="px-3 py-2 border">{s.full_name}</td>
                <td className="px-3 py-2 border">{s.course || "N/A"}</td>
                <td className="px-3 py-2 border">{s.attendance ?? "N/A"}</td>
                <td className="px-3 py-2 border">{s.academic_score ?? "N/A"}</td>
                <td className="px-3 py-2 border">{s.debtor ? "Pending" : "Paid"}</td>
                <td className="px-3 py-2 border">{s.scholarship_holder ? "Yes" : "No"}</td>
                <td className={`px-3 py-2 border ${riskColor(s.risk_label)}`}>
                  {s.risk_label || "N/A"}
                </td>
                <td className="px-3 py-2 border text-center">
                  <button
                    onClick={() => setSelectedStudent(s)}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Add Counseling
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </motion.table>
      )}

      <AnimatePresence>
        {selectedStudent && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-md text-white relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="text-lg font-bold mb-4 text-blue-400">
                Add Counseling for {selectedStudent.full_name}
              </h3>

              <form onSubmit={handleAddCounseling} className="space-y-4">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-gray-900 p-2 rounded border"
                  rows="3"
                  required
                />

                <input
                  type="datetime-local"
                  value={followUp}
                  onChange={(e) => setFollowUp(e.target.value)}
                  className="w-full bg-gray-900 p-2 rounded border"
                />

                {msg && <p className="text-center text-green-400">{msg}</p>}

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setSelectedStudent(null)}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
                  >
                    Save
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
