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
    studentId: '',
    facultyId: ''
  });
  const [faculties, setFaculties] = useState([]);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const res = await axios.get('/api/auth/faculties');
        setFaculties(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFaculties();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/auth/register', formData, {
        headers: { 'x-auth-token': token }
      });
      router.push('/');
    } catch (err) {
      setError(err.response?.data?.msg || err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="loginContainer">
      <div className="loginBox">
        <h1>Register User</h1>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="formGroup">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="formGroup">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="formGroup">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="formGroup">
            <label>Role</label>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {formData.role === 'student' && (
            <>
              <div className="formGroup">
                <label>Student ID</label>
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="formGroup">
                <label>Faculty</label>
                <select 
                  name="facultyId" 
                  value={formData.facultyId} 
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Faculty</option>
                  {faculties.map((faculty) => (
                    <option key={faculty._id} value={faculty._id}>{faculty.name}</option>
                  ))}
                </select>
              </div>
            </>
          )}
          {formData.role === 'faculty' && (
            <div className="formGroup">
              <label>Faculty ID</label>
              <input
                type="text"
                name="facultyId"
                value={formData.facultyId}
                onChange={handleChange}
                required
              />
            </div>
          )}
          <button type="submit" className="loginBtn">Register</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link href="/login">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}
