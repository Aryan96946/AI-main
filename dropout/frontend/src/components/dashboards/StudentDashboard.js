import React, { useEffect, useState } from 'react';
import API from '../../api';

export default function StudentDashboard({ user }) {
  const [profile, setProfile] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      setErr("");
      try {
        const res = await API.get('/students/me', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setProfile(res.data.student);
      } catch (error) {
        console.error(error);
        setErr(error.response?.data?.error || "Failed to load profile");
      }
    };

    fetchProfile();
  }, [user]);

  if (!user) return <div>Please login</div>;
  if (err) return <div className="text-red-500">{err}</div>;
  if (!profile) return <div>Loading profile...</div>;

  const latestRiskScore = profile.predictions?.length
    ? profile.predictions[profile.predictions.length - 1].risk_score
    : 'N/A';

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Student Dashboard</h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 border rounded shadow">
          <strong>Name:</strong> {profile.full_name}
        </div>
        <div className="p-4 border rounded shadow">
          <strong>Grade:</strong> {profile.grade || 'N/A'}
        </div>
        <div className="p-4 border rounded shadow">
          <strong>Attendance:</strong> {profile.attendance ?? 'N/A'}%
        </div>
        <div className="p-4 border rounded shadow">
          <strong>Avg Score:</strong> {profile.avg_score ?? 'N/A'}
        </div>
        <div className="p-4 border rounded shadow col-span-2">
          <strong>Latest Risk Score:</strong> {latestRiskScore}
        </div>
      </div>

      <h3 className="text-xl font-semibold mb-4">Counseling Sessions</h3>
      {profile.counseling_sessions?.length ? (
        <div className="space-y-4">
          {profile.counseling_sessions.map((s) => (
            <div key={s.id} className="p-4 border rounded shadow">
              <small className="text-gray-500">
                {new Date(s.created_at).toLocaleString()}
              </small>
              <p className="mt-1">{s.notes}</p>
              {s.follow_up_at && (
                <p className="mt-1 text-sm text-blue-600">
                  Follow-up: {new Date(s.follow_up_at).toLocaleString()}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No counseling sessions yet</p>
      )}
    </div>
  );
}
