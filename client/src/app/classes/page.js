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
  const [programs, setPrograms] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    courseId: '',
    type: 'lecture',
    semester: 1,
    academicYear: '2024/2025',
    schedule: { day: 'monday', startTime: '', endTime: '' },
    location: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [classRes, courseRes, studentRes, programRes, enrollRes] = await Promise.all([
        axios.get('/api/structure/classes'),
        axios.get('/api/structure/courses'),
        axios.get('/api/structure/students'),
        axios.get('/api/structure/programs'),
        axios.get('/api/structure/enrollments')
      ]);
      setClasses(classRes.data);
      setCourses(courseRes.data);
      setStudents(studentRes.data);
      setPrograms(programRes.data);
      setEnrolledStudents(enrollRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/structure/classes', formData);
      setShowForm(false);
      setFormData({
        name: '', courseId: '', type: 'lecture', semester: 1, academicYear: '2024/2025',
        schedule: { day: 'monday', startTime: '', endTime: '' }, location: ''
      });
      fetchData();
    } catch (err) {
      alert('Failed to create class');
    }
  };

  const handleEnroll = async (studentId) => {
    try {
      await axios.post('/api/structure/enroll', {
        classId: selectedClass._id,
        studentId
      });
      fetchData();
      alert('Student enrolled successfully');
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to enroll student');
    }
  };

  const handleUnenroll = async (studentId) => {
    try {
      await axios.delete(`/api/structure/enroll/${studentId}/${selectedClass._id}`);
      fetchData();
    } catch (err) {
      alert('Failed to unenroll student');
    }
  };

  const getClassEnrollments = (classId) => {
    return enrolledStudents.filter(e => e.classId._id === classId);
  };

  const getUnenrolledStudents = (classId) => {
    const enrolledIds = getClassEnrollments(classId).map(e => e.studentId._id);
    const classItem = classes.find(c => c._id === classId);
    if (!classItem) return [];
    
    return students.filter(s => 
      s.programId?._id === classItem.courseId?.programId?._id &&
      !enrolledIds.includes(s._id)
    );
  };

  if (loading) return <DashboardLayout><p>Loading...</p></DashboardLayout>;

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: 'white', margin: 0 }}>Classes</h2>
        {(user?.role === 'admin' || user?.role === 'lecturer') && (
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
                  <option key={course._id} value={course._id}>
                    {course.code} - {course.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="formGroup">
              <label>Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="lecture">Lecture</option>
                <option value="tutorial">Tutorial</option>
                <option value="lab">Lab</option>
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
              <th>Course</th>
              <th>Type</th>
              <th>Schedule</th>
              <th>Location</th>
              <th>Lecturer</th>
              <th>Enrolled</th>
              {(user?.role === 'admin' || user?.role === 'lecturer') && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {classes.map((cls) => (
              <tr key={cls._id}>
                <td>
                  <strong>{cls.courseId?.name}</strong>
                  <br/>
                  <small style={{ color: '#888' }}>{cls.courseId?.code}</small>
                </td>
                <td style={{ textTransform: 'capitalize' }}>{cls.type}</td>
                <td>
                  {cls.schedule?.day && cls.schedule?.day.charAt(0).toUpperCase() + cls.schedule?.day.slice(1)}
                  <br/>
                  <small style={{ color: '#888' }}>
                    {cls.schedule?.startTime} - {cls.schedule?.endTime}
                  </small>
                </td>
                <td>{cls.location || 'N/A'}</td>
                <td>{cls.lecturerId?.name || 'N/A'}</td>
                <td>{getClassEnrollments(cls._id).length}</td>
                {(user?.role === 'admin' || user?.role === 'lecturer') && (
                  <td>
                    <button 
                      onClick={() => { setSelectedClass(cls); setShowEnrollModal(true); }}
                      className="btn btnPrimary"
                      style={{ padding: '5px 10px', fontSize: '12px' }}
                    >
                      Manage Enrollment
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showEnrollModal && selectedClass && (
        <div className="modalOverlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div className="modalContent" style={{
            background: '#1a1a1a', padding: '20px', borderRadius: '8px',
            width: '700px', maxHeight: '80vh', overflowY: 'auto'
          }}>
            <h3 style={{ color: 'white', marginBottom: '20px' }}>
              Manage Enrollment - {selectedClass.courseId?.code}
            </h3>
            
            <h4 style={{ color: '#4ade80', marginBottom: '10px' }}>Enrolled Students</h4>
            {getClassEnrollments(selectedClass._id).length > 0 ? (
              <table style={{ width: '100%', marginBottom: '20px' }}>
                <thead>
                  <tr><th>ID</th><th>Name</th><th>Program</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {getClassEnrollments(selectedClass._id).map((enroll) => (
                    <tr key={enroll._id}>
                      <td>{enroll.studentId?.studentId}</td>
                      <td>{enroll.studentId?.name}</td>
                      <td>{enroll.studentId?.programId?.name}</td>
                      <td>
                        <button 
                          onClick={() => handleUnenroll(enroll.studentId._id)}
                          className="btn btnDanger"
                          style={{ padding: '5px 10px', fontSize: '12px' }}
                        >
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
            {getUnenrolledStudents(selectedClass._id).length > 0 ? (
              <table style={{ width: '100%' }}>
                <thead>
                  <tr><th>ID</th><th>Name</th><th>Program</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {getUnenrolledStudents(selectedClass._id).map((student) => (
                    <tr key={student._id}>
                      <td>{student.studentId}</td>
                      <td>{student.name}</td>
                      <td>{student.programId?.name}</td>
                      <td>
                        <button 
                          onClick={() => handleEnroll(student._id)}
                          className="btn btnSuccess"
                          style={{ padding: '5px 10px', fontSize: '12px' }}
                        >
                          Enroll
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ color: '#888' }}>No eligible students available</p>
            )}

            <button 
              onClick={() => { setShowEnrollModal(false); setSelectedClass(null); }}
              className="btn btnDanger"
              style={{ marginTop: '20px' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
