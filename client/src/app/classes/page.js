'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../providers';
import DashboardLayout from '../dashboard/layout';
import axios from 'axios';

export default function ClassesPage() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    courseId: '',
    schedule: { day: 'monday', startTime: '', endTime: '' },
    location: ''
  });

  useEffect(() => {
    fetchClasses();
    fetchCourses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await axios.get('/api/classes');
      setClasses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

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
      await axios.post('/api/classes', formData);
      setShowForm(false);
      setFormData({ name: '', courseId: '', schedule: { day: 'monday', startTime: '', endTime: '' }, location: '' });
      fetchClasses();
    } catch (err) {
      alert('Failed to create class');
    }
  };

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: 'white', margin: 0 }}>Classes</h2>
        {(user?.role === 'admin' || user?.role === 'faculty') && (
          <button onClick={() => setShowForm(!showForm)} className="btn btnPrimary">
            {showForm ? 'Cancel' : 'Add Class'}
          </button>
        )}
      </div>

      {showForm && (
        <div className="tableContainer" style={{ marginBottom: '20px' }}>
          <form onSubmit={handleSubmit}>
            <div className="formGroup">
              <label>Class Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="formGroup">
              <label>Course</label>
              <select
                value={formData.courseId}
                onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                required
              >
                <option value="">Select Course</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>{course.name}</option>
                ))}
              </select>
            </div>
            <div className="formGroup">
              <label>Day</label>
              <select
                value={formData.schedule.day}
                onChange={(e) => setFormData({ ...formData, schedule: { ...formData.schedule, day: e.target.value } })}
              >
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                  <option key={day} value={day}>{day.charAt(0).toUpperCase() + day.slice(1)}</option>
                ))}
              </select>
            </div>
            <div className="formGroup">
              <label>Start Time</label>
              <input
                type="time"
                value={formData.schedule.startTime}
                onChange={(e) => setFormData({ ...formData, schedule: { ...formData.schedule, startTime: e.target.value } })}
                required
              />
            </div>
            <div className="formGroup">
              <label>End Time</label>
              <input
                type="time"
                value={formData.schedule.endTime}
                onChange={(e) => setFormData({ ...formData, schedule: { ...formData.schedule, endTime: e.target.value } })}
                required
              />
            </div>
            <div className="formGroup">
              <label>Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <button type="submit" className="btn btnSuccess">Create Class</button>
          </form>
        </div>
      )}

      <div className="tableContainer">
        <table>
          <thead>
            <tr>
              <th>Class Name</th>
              <th>Course</th>
              <th>Schedule</th>
              <th>Location</th>
              <th>Faculty</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((cls) => (
              <tr key={cls._id}>
                <td>{cls.name}</td>
                <td>{cls.courseId?.name}</td>
                <td>{cls.schedule?.day} {cls.schedule?.startTime} - {cls.schedule?.endTime}</td>
                <td>{cls.location || 'N/A'}</td>
                <td>{cls.facultyId?.name || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
