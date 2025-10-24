import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Sidebar({ user, setUser }) {
  const nav = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    nav('/');
  };

  return (
    <div
      style={{
        width: 220,
        background: '#1f2937',
        color: 'white',
        padding: 20,
        minHeight: '100vh',
      }}
    >
      <h3 className="text-lg font-bold mb-4">AiDropout</h3>

      {/* Not logged in */}
      {!user && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Link
            to="/"
            style={{
              color: '#a78bfa', // light purple
              textDecoration: 'none',
            }}
            className="hover:underline"
          >
            Login
          </Link>

          <Link
            to="/register"
            style={{
              color: '#a78bfa',
              textDecoration: 'none',
            }}
            className="hover:underline"
          >
            Register
          </Link>
        </div>
      )}

      {/* Logged in */}
      {user && (
        <div className="space-y-4">
          <div>
            Logged in as: <strong>{user.username}</strong> ({user.role})
          </div>
          <hr className="border-gray-500" />

          {user.role === 'student' && (
            <Link to="/student" className="block hover:underline">
              My Dashboard
            </Link>
          )}
          {user.role === 'teacher' && (
            <Link to="/teacher" className="block hover:underline">
              Teacher Dashboard
            </Link>
          )}
          {user.role === 'admin' && (
            <Link to="/admin" className="block hover:underline">
              Admin Dashboard
            </Link>
          )}

          <hr className="border-gray-500" />
          <button
            onClick={logout}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
