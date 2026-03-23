'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../providers';
import DashboardLayout from '../dashboard/layout';
import axios from 'axios';

export default function ClassesPage() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    courseId: '',
    schedule: { day: 'monday', startTime: '', endTime: '' },
    location: ''
  });

  useEffect(() => {
    fetchClasses();
    fetchCourses();
    fetchStudents();
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

  const fetchStudents = async () => {
    try {
      const res = await axios.get('/api/students');
      setStudents(res.data);
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

  const handleAddStudent = async (studentId) => {
    try {
      const res = await axios.post(`/api/classes/${selectedClass._id}/students`, { studentId });
      setSelectedClass(res.data);
      fetchClasses();
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to add student');
    }
  };

  const handleRemoveStudent = async (studentId) => {
    try {
      const res = await axios.delete(`/api/classes/${selectedClass._id}/students/${studentId}`);
      setSelectedClass(res.data);
      fetchClasses();
    } catch (err) {
      alert('Failed to remove student');
    }
  };

  const openAddStudentModal = (cls) => {
    setSelectedClass(cls);
    setShowStudentModal(true);
  };

  const availableStudents = selectedClass
    ? students.filter(s => !selectedClass.students.some(st => st._id === s._id))
    : [];

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
              <th>Students</th>
              {(user?.role === 'admin' || user?.role === 'faculty') && <th>Actions</th>}
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
                <td>{cls.students?.length || 0}</td>
                {(user?.role === 'admin' || user?.role === 'faculty') && (
                  <td>
                    <button onClick={() => openAddStudentModal(cls)} className="btn btnPrimary" style={{ padding: '5px 10px', fontSize: '12px' }}>
                      Manage Students
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showStudentModal && selectedClass && (
        <div className="modalOverlay" style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="modalContent" style={{
            background: '#1a1a1a',
            padding: '20px',
            borderRadius: '8px',
            width: '600px',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <h3 style={{ color: 'white', marginBottom: '20px' }}>Manage Students - {selectedClass.name}</h3>
            
            <h4 style={{ color: '#4ade80', marginBottom: '10px' }}>Current Students</h4>
            {selectedClass.students?.length > 0 ? (
              <table style={{ width: '100%', marginBottom: '20px' }}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedClass.students.map((student) => (
                    <tr key={student._id}>
                      <td>{student.studentId}</td>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                      <td>
                        <button onClick={() => handleRemoveStudent(student._id)} className="btn btnDanger" style={{ padding: '5px 10px', fontSize: '12px' }}>
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ color: '#888', marginBottom: '20px' }}>No students enrolled</p>
            )}

            <h4 style={{ color: '#4ade80', marginBottom: '10px' }}>Add Students</h4>
            {availableStudents.length > 0 ? (
              <table style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {availableStudents.map((student) => (
                    <tr key={student._id}>
                      <td>{student.studentId}</td>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                      <td>
                        <button onClick={() => handleAddStudent(student._id)} className="btn btnSuccess" style={{ padding: '5px 10px', fontSize: '12px' }}>
                          Add
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ color: '#888' }}>All students are already enrolled</p>
            )}

            <button onClick={() => { setShowStudentModal(false); setSelectedClass(null); }} className="btn btnDanger" style={{ marginTop: '20px' }}>
              Close
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
