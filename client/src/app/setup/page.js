'use client';

import { useState } from 'react';
import axios from 'axios';

export default function SetupPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const seedData = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login as admin first');
        setLoading(false);
        return;
      }
      const res = await axios.post('/api/structure/seed', {}, {
        headers: { 'x-auth-token': token }
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.msg || err.response?.data?.error || 'Failed to seed data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-5">
      <div className="bg-gray-800 p-10 rounded-xl max-w-lg w-full text-center">
        <h1 className="text-2xl font-bold mb-5 text-green-400">CAUC Attendance Setup</h1>
        
        <p className="text-gray-400 mb-8 leading-relaxed">
          Click below to initialize the university structure with sample data including:
          <br/>• University, Faculty, Department
          <br/>• Programs and Courses
        </p>

        <button 
          onClick={seedData}
          disabled={loading}
          className="px-8 py-4 text-base bg-green-400 text-black border-none rounded-lg cursor-pointer transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Setting up...' : 'Initialize University Data'}
        </button>

        {error && (
          <div className="mt-5 p-4 bg-red-600 rounded-lg">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-5 p-4 bg-green-800 rounded-lg text-left">
            <strong className="text-green-300">Setup Complete!</strong>
            <p className="my-2">
              {result.msg}
            </p>
            {result.university && (
              <p className="my-1 text-sm">
                <strong>University:</strong> {result.university.name}
              </p>
            )}
            {result.faculty && (
              <p className="my-1 text-sm">
                <strong>Faculty:</strong> {result.faculty.name}
              </p>
            )}
            {result.department && (
              <p className="my-1 text-sm">
                <strong>Department:</strong> {result.department.name}
              </p>
            )}
            {result.program && (
              <p className="my-1 text-sm">
                <strong>Program:</strong> {result.program.name}
              </p>
            )}
            {result.courses && (
              <p className="my-1 text-sm">
                <strong>Courses:</strong> {result.courses.length} created
              </p>
            )}
          </div>
        )}

        <p className="mt-8 text-gray-500 text-xs">
          (Requires admin login first)
        </p>
      </div>
    </div>
  );
}
