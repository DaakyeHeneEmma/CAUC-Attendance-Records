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
              <option value="lecturer">Lecturer</option>
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
                <label>Program</label>
                <select 
                  name="programId" 
                  value={formData.programId} 
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Program</option>
                  {programs.map((prog) => (
                    <option key={prog._id} value={prog._id}>{prog.name} ({prog.code})</option>
                  ))}
                </select>
              </div>
              <div className="formGroup">
                <label>Level</label>
                <select name="level" value={formData.level} onChange={handleChange}>
                  <option value={100}>100</option>
                  <option value={200}>200</option>
                  <option value={300}>300</option>
                  <option value={400}>400</option>
                </select>
              </div>
              <div className="formGroup">
                <label>Semester</label>
                <select name="semester" value={formData.semester} onChange={handleChange}>
                  <option value={1}>Semester 1</option>
                  <option value={2}>Semester 2</option>
                </select>
              </div>
              <div className="formGroup">
                <label>Academic Year</label>
                <input
                  type="text"
                  name="academicYear"
                  value={formData.academicYear}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}
          
          {formData.role === 'lecturer' && (
            <>
              <div className="formGroup">
                <label>Staff ID</label>
                <input
                  type="text"
                  name="staffId"
                  value={formData.staffId}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="formGroup">
                <label>Department</label>
                <select 
                  name="departmentId" 
                  value={formData.departmentId} 
                  onChange={handleChange}
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
          
          <button type="submit" className="loginBtn">Register</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link href="/login">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}
