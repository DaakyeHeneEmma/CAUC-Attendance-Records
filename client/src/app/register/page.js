'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../providers';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

export default function Register() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    staffId: '',
    departmentId: '',
    studentId: '',
    programId: '',
    level: 100,
    semester: 1,
    academicYear: '2024/2025'
  });
  const [programs, setPrograms] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [progRes, deptRes] = await Promise.all([
          axios.get('/api/structure/programs'),
          axios.get('/api/structure/departments')
        ]);
        setPrograms(progRes.data);
        setDepartments(deptRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/auth/register', formData, {
        headers: { 'x-auth-token': token }
      });
      router.push('/');
    } catch (err) {
      setError(err.response?.data?.msg || err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">Register User</h1>
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-gray-600 text-sm mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <div className="mb-5">
            <label className="block text-gray-600 text-sm mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <div className="mb-5">
            <label className="block text-gray-600 text-sm mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <div className="mb-5">
            <label className="block text-gray-600 text-sm mb-2">Role</label>
            <select 
              name="role" 
              value={formData.role} 
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-indigo-500 bg-white"
            >
              <option value="student">Student</option>
              <option value="lecturer">Lecturer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          {formData.role === 'student' && (
            <>
              <div className="mb-5">
                <label className="block text-gray-600 text-sm mb-2">Student ID</label>
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div className="mb-5">
                <label className="block text-gray-600 text-sm mb-2">Program</label>
                <select 
                  name="programId" 
                  value={formData.programId} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-indigo-500 bg-white"
                  required
                >
                  <option value="">Select Program</option>
                  {programs.map((prog) => (
                    <option key={prog._id} value={prog._id}>{prog.name} ({prog.code})</option>
                  ))}
                </select>
              </div>
              <div className="mb-5">
                <label className="block text-gray-600 text-sm mb-2">Level</label>
                <select 
                  name="level" 
                  value={formData.level} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-indigo-500 bg-white"
                >
                  <option value={100}>100</option>
                  <option value={200}>200</option>
                  <option value={300}>300</option>
                  <option value={400}>400</option>
                </select>
              </div>
              <div className="mb-5">
                <label className="block text-gray-600 text-sm mb-2">Semester</label>
                <select 
                  name="semester" 
                  value={formData.semester} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-indigo-500 bg-white"
                >
                  <option value={1}>Semester 1</option>
                  <option value={2}>Semester 2</option>
                </select>
              </div>
              <div className="mb-5">
                <label className="block text-gray-600 text-sm mb-2">Academic Year</label>
                <input
                  type="text"
                  name="academicYear"
                  value={formData.academicYear}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </>
          )}
          
          {formData.role === 'lecturer' && (
            <>
              <div className="mb-5">
                <label className="block text-gray-600 text-sm mb-2">Staff ID</label>
                <input
                  type="text"
                  name="staffId"
                  value={formData.staffId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div className="mb-5">
                <label className="block text-gray-600 text-sm mb-2">Department</label>
                <select 
                  name="departmentId" 
                  value={formData.departmentId} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-indigo-500 bg-white"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>{dept.name} ({dept.code})</option>
                  ))}
                </select>
              </div>
            </>
          )}
          
          <button type="submit" className="w-full py-3 bg-indigo-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-colors">
            Register
          </button>
        </form>
        <p className="text-center mt-5">
          <Link href="/login" className="text-indigo-500 hover:text-purple-600">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}
