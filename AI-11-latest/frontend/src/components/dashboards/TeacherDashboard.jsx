import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../../api';
import { useNavigate } from 'react-router-dom';

export default function TeacherDashboard({ user, setUser }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [notes, setNotes] = useState('');
  const [followUp, setFollowUp] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const fetchStudents = async () => {
      setErr('');
      setLoading(true);
      try {
        const res = await API.get('/teachers/students', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setStudents(res.data.students || []);
      } catch (error) {
        console.error(error);
        setErr(error.response?.data?.error || 'Failed to load students');
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login', { replace: true });
  };

  const batchPredict = async () => {
    try {
      await API.post(
        '/teachers/batch_predict',
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
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
      setMsg('✅ Counseling session added successfully!');
      setNotes('');
      setFollowUp('');
      setTimeout(() => {
        setSelectedStudent(null);
        setMsg('');
      }, 1500);
    } catch (error) {
      console.error(error);
      setMsg('❌ Failed to add counseling session');
    }
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
        <motion.h2
          className="text-3xl font-bold text-blue-400"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
        >
          Teacher Dashboard
        </motion.h2>

        <motion.button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold text-white transition"
          whileHover={{ scale: 1.05 }}
        >
          Logout
        </motion.button>
      </div>

      <motion.button
        onClick={batchPredict}
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
      >
        Run Batch Prediction
      </motion.button>

      <motion.h3
        className="text-2xl font-semibold mb-4 text-blue-400"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        Students
      </motion.h3>

      {students.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-400"
        >
          No students found.
        </motion.p>
      ) : (
        <motion.table
          className="w-full border border-gray-700 border-collapse text-left rounded-lg overflow-hidden shadow-lg bg-gray-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <thead>
            <tr className="bg-gray-700 text-blue-400">
              <th className="px-3 py-2 border border-gray-600">Name</th>
              <th className="px-3 py-2 border border-gray-600">Attendance</th>
              <th className="px-3 py-2 border border-gray-600">Avg Score</th>
              <th className="px-3 py-2 border border-gray-600">Risk</th>
              <th className="px-3 py-2 border border-gray-600 text-center">Actions</th>
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
                <td className="px-3 py-2 border border-gray-700 text-gray-200">{s.full_name}</td>
                <td className="px-3 py-2 border border-gray-700 text-gray-200">{s.attendance ?? 'N/A'}</td>
                <td className="px-3 py-2 border border-gray-700 text-gray-200">{s.avg_score ?? 'N/A'}</td>
                <td className="px-3 py-2 border border-gray-700 text-gray-200">{s.risk_score ?? 'N/A'}</td>
                <td className="px-3 py-2 border border-gray-700 text-center">
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
                Add Counseling Session for {selectedStudent.full_name}
              </h3>
              <form onSubmit={handleAddCounseling} className="space-y-4">
                <div>
                  <label className="block font-medium text-gray-300">Notes:</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full border border-gray-600 bg-gray-900 text-white p-2 rounded mt-1"
                    rows="3"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-300">Follow-up Date (optional):</label>
                  <input
                    type="datetime-local"
                    value={followUp}
                    onChange={(e) => setFollowUp(e.target.value)}
                    className="w-full border border-gray-600 bg-gray-900 text-white p-2 rounded mt-1"
                  />
                </div>
                {msg && <p className="text-center text-green-400">{msg}</p>}
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setSelectedStudent(null)}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
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
