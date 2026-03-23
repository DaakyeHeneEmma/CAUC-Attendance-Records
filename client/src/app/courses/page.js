'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../providers';
import DashboardLayout from '../dashboard/layout';
import axios from 'axios';

export default function CoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ 
    code: '', 
    name: '', 
    description: '',
    programId: '',
    credits: 3,
    semester: 1
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [courseRes, programRes] = await Promise.all([
        axios.get('/api/structure/courses'),
        axios.get('/api/structure/programs')
      ]);
      setCourses(courseRes.data);
      setPrograms(programRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/structure/courses', formData);
      setShowForm(false);
      setFormData({ code: '', name: '', description: '', programId: '', credits: 3, semester: 1 });
      fetchData();
    } catch (err) {
      alert('Failed to create course');
    }
  };

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: 'white', margin: 0 }}>Courses</h2>
        {user?.role === 'admin' && (
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
              <label>Program</label>
              <select
                value={formData.programId}
                onChange={(e) => setFormData({ ...formData, programId: e.target.value })}
                required
              >
                <option value="">Select Program</option>
                {programs.map((prog) => (
                  <option key={prog._id} value={prog._id}>{prog.name} ({prog.code})</option>
                ))}
              </select>
            </div>
            <div className="formGroup">
              <label>Credits</label>
              <input
                type="number"
                value={formData.credits}
                onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                min="1"
                max="6"
              />
            </div>
            <div className="formGroup">
              <label>Semester</label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
              >
                <option value={1}>Semester 1</option>
                <option value={2}>Semester 2</option>
              </select>
            </div>
            <div className="formGroup">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
                style={{ width: '100%', padding: '10px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '4px' }}
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
              <th>Program</th>
              <th>Credits</th>
              <th>Semester</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course._id}>
                <td>{course.code}</td>
                <td>{course.name}</td>
                <td>{course.programId?.name || 'N/A'}</td>
                <td>{course.credits}</td>
                <td>{course.semester}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
