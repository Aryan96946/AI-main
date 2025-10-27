import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../../api';

export default function TeacherDashboard({ user }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [notes, setNotes] = useState("");
  const [followUp, setFollowUp] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!user) return;
    const fetchStudents = async () => {
      setErr("");
      setLoading(true);
      try {
        const res = await API.get('/teachers/students', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setStudents(res.data.students || []);
      } catch (error) {
        console.error(error);
        setErr(error.response?.data?.error || "Failed to load students");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [user]);

  const batchPredict = async () => {
    try {
      await API.post('/teachers/batch_predict', {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      alert('Batch prediction requested. Refresh to see updates.');
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || 'Failed to run batch prediction');
    }
  };

  const handleAddCounseling = async (e) => {
    e.preventDefault();
    try {
      await API.post(
        '/counseling/add',
        { student_id: selectedStudent.id, notes, follow_up_at: followUp },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setMsg("✅ Counseling session added successfully!");
      setNotes("");
      setFollowUp("");
      setTimeout(() => {
        setSelectedStudent(null);
        setMsg("");
      }, 1500);
    } catch (error) {
      console.error(error);
      setMsg("❌ Failed to add counseling session");
    }
  };

  if (!user) return <div>Please login</div>;
  if (loading) return <div>Loading students...</div>;
  if (err) return <div className="text-red-500">{err}</div>;

  return (
    <motion.div
      className="p-6 max-w-5xl mx-auto"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <motion.h2
        className="text-2xl font-bold mb-6"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        Teacher Dashboard
      </motion.h2>

      <motion.button
        onClick={batchPredict}
        className="mb-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow-md"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
      >
        Run Batch Prediction
      </motion.button>

      <motion.h3
        className="text-xl font-semibold mb-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        Students
      </motion.h3>

      {students.length === 0 ? (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          No students found.
        </motion.p>
      ) : (
        <motion.table
          className="w-full border border-collapse text-left rounded-lg overflow-hidden shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <thead>
            <tr className="bg-gray-100">
              <th className="px-3 py-2 border">Name</th>
              <th className="px-3 py-2 border">Attendance</th>
              <th className="px-3 py-2 border">Avg Score</th>
              <th className="px-3 py-2 border">Risk</th>
              <th className="px-3 py-2 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, index) => (
              <motion.tr
                key={s.id}
                className="hover:bg-gray-50 transition"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <td className="px-3 py-2 border">{s.full_name}</td>
                <td className="px-3 py-2 border">{s.attendance ?? 'N/A'}</td>
                <td className="px-3 py-2 border">{s.avg_score ?? 'N/A'}</td>
                <td className="px-3 py-2 border">{s.risk_score ?? 'N/A'}</td>
                <td className="px-3 py-2 border text-center">
                  <button
                    onClick={() => setSelectedStudent(s)}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Add Counseling
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </motion.table>
      )}

      {/* Counseling Modal */}
      <AnimatePresence>
        {selectedStudent && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="text-lg font-bold mb-4">
                Add Counseling Session for {selectedStudent.full_name}
              </h3>
              <form onSubmit={handleAddCounseling} className="space-y-4">
                <div>
                  <label className="block font-medium">Notes:</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full border p-2 rounded mt-1"
                    rows="3"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium">Follow-up Date (optional):</label>
                  <input
                    type="datetime-local"
                    value={followUp}
                    onChange={(e) => setFollowUp(e.target.value)}
                    className="w-full border p-2 rounded mt-1"
                  />
                </div>
                {msg && <p className="text-center text-green-600">{msg}</p>}
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setSelectedStudent(null)}
                    className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
