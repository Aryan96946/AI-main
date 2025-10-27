import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import API from '../../api';

export default function StudentDashboard({ user }) {
  const [profile, setProfile] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      setErr('');
      try {
        const res = await API.get('/students/me', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setProfile(res.data.student);
      } catch (error) {
        console.error(error);
        setErr(error.response?.data?.error || 'Failed to load profile');
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
    <motion.div
      className="p-6 max-w-3xl mx-auto"
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
        Student Dashboard
      </motion.h2>

      <motion.div
        className="grid grid-cols-2 gap-4 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {[
          { label: 'Name', value: profile.full_name },
          { label: 'Grade', value: profile.grade || 'N/A' },
          { label: 'Attendance', value: `${profile.attendance ?? 'N/A'}%` },
          { label: 'Avg Score', value: profile.avg_score ?? 'N/A' },
          { label: 'Latest Risk Score', value: latestRiskScore, colSpan: 2 },
        ].map((item, i) => (
          <motion.div
            key={i}
            className={`p-4 border rounded shadow bg-white ${
              item.colSpan ? 'col-span-2' : ''
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 + i * 0.1 }}
            whileHover={{ scale: 1.03 }}
          >
            <strong>{item.label}:</strong> {item.value}
          </motion.div>
        ))}
      </motion.div>

      <motion.h3
        className="text-xl font-semibold mb-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
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
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 },
            },
          }}
        >
          {profile.counseling_sessions.map((s, index) => (
            <motion.div
              key={s.id}
              className="p-4 border rounded shadow bg-white"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
            >
              <small className="text-gray-500">
                {new Date(s.created_at).toLocaleString()}
              </small>
              <p className="mt-1">{s.notes}</p>
              {s.follow_up_at && (
                <p className="mt-1 text-sm text-blue-600">
                  Follow-up: {new Date(s.follow_up_at).toLocaleString()}
                </p>
              )}
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.p
          className="text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          No counseling sessions yet
        </motion.p>
      )}
    </motion.div>
  );
}
