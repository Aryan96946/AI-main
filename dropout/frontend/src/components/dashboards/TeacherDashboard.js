import React, { useEffect, useState } from 'react';
import API from '../../api';

export default function TeacherDashboard({ user }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

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

  if (!user) return <div>Please login</div>;
  if (loading) return <div>Loading students...</div>;
  if (err) return <div className="text-red-500">{err}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Teacher Dashboard</h2>

      <button
        onClick={batchPredict}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Run Batch Prediction
      </button>

      <h3 className="text-xl font-semibold mb-2">Students</h3>
      {students.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <table className="w-full border border-collapse text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-2 py-1 border">Name</th>
              <th className="px-2 py-1 border">Attendance</th>
              <th className="px-2 py-1 border">Avg Score</th>
              <th className="px-2 py-1 border">Risk</th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-2 py-1 border">{s.full_name}</td>
                <td className="px-2 py-1 border">{s.attendance ?? 'N/A'}</td>
                <td className="px-2 py-1 border">{s.avg_score ?? 'N/A'}</td>
                <td className="px-2 py-1 border">{s.risk_score ?? 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
