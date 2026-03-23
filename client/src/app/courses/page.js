'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../providers';
import DashboardLayout from '../dashboard/layout';
import axios from 'axios';

export default function CoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ code: '', name: '', description: '' });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get('/api/courses');
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/courses', formData);
      setShowForm(false);
      setFormData({ code: '', name: '', description: '' });
      fetchCourses();
    } catch (err) {
      alert('Failed to create course');
    }
  };

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: 'white', margin: 0 }}>Courses</h2>
        {(user.role === 'admin' || user.role === 'faculty') && (
          <button onClick={() => setShowForm(!showForm)} className="btn btnPrimary">
            {showForm ? 'Cancel' : 'Add Course'}
          </button>
        )}
      </div>

      {showForm && (
        <div className="tableContainer" style={{ marginBottom: '20px' }}>
          <form onSubmit={handleSubmit}>
            <div className="formGroup">
              <label>Course Code</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
              />
            </div>
            <div className="formGroup">
              <label>Course Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="formGroup">
              <label>Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <button type="submit" className="btn btnSuccess">Create Course</button>
          </form>
        </div>
      )}

      <div className="tableContainer">
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Description</th>
              <th>Faculty</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course._id}>
                <td>{course.code}</td>
                <td>{course.name}</td>
                <td>{course.description || 'N/A'}</td>
                <td>{course.facultyId?.name || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
