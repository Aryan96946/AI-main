import React, { useEffect, useState } from 'react';
import API from '../../api';

export default function AdminDashboard({ user }) {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      setErr("");
      try {
        const headers = { Authorization: `Bearer ${user.token}` };

        const [usersRes, analyticsRes] = await Promise.all([
          API.get('/admin/users', { headers }),
          API.get('/admin/analytics', { headers })
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
  if (loading) return <div>Loading admin data...</div>;
  if (err) return <div className="text-red-500">{err}</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>

      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2">System Analytics</h3>
        {stats ? (
          <div>
            Total students: {stats.total_students}, High risk: {stats.high_risk_count}
          </div>
        ) : (
          <p>No analytics data available</p>
        )}
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2">Users</h3>
        {users.length === 0 ? (
          <p>No users found</p>
        ) : (
          <table className="w-full border border-gray-300 text-left border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Username</th>
                <th className="p-2 border">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="p-2 border">{u.id}</td>
                  <td className="p-2 border">{u.username}</td>
                  <td className="p-2 border">{u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
