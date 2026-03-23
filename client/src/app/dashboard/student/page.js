'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../providers';
import axios from 'axios';
import DashboardLayout from '../layout';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [studentProfile, setStudentProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classRes = await axios.get('/api/structure/classes');
        setClasses(classRes.data);

        const studentRes = await axios.get('/api/structure/students');
        const student = studentRes.data.find(s => s.userId === user.id);
        setStudentProfile(student);
      } catch (err) {
        console.error(err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const markAttendance = async (classId) => {
    try {
      if (!studentProfile) {
        alert('Student profile not found');
        return;
      }
      await axios.post('/api/attendance/mark', {
        classId,
        studentId: studentProfile._id
      });
      alert('Attendance marked successfully!');
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to mark attendance');
    }
  };

  if (loading) return <DashboardLayout><p>Loading...</p></DashboardLayout>;

  if (error) {
    return (
      <DashboardLayout>
        <div className="error" style={{ padding: '20px', margin: '20px' }}>{error}</div>
      </DashboardLayout>
    );
  }

  if (!studentProfile) {
    return (
      <DashboardLayout>
        <p style={{ color: 'white', padding: '20px' }}>Your student profile has not been created yet. Please contact the administrator.</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="tableContainer" style={{ marginBottom: '20px' }}>
        <h2 style={{ color: 'white', marginBottom: '15px' }}>My Profile</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div>
            <p style={{ color: '#888', margin: '0', fontSize: '12px' }}>Name</p>
            <p style={{ color: 'white', margin: '5px 0 0 0', fontSize: '16px' }}>{user?.name}</p>
          </div>
          <div>
            <p style={{ color: '#888', margin: '0', fontSize: '12px' }}>Email</p>
            <p style={{ color: 'white', margin: '5px 0 0 0', fontSize: '16px' }}>{user?.email}</p>
          </div>
          <div>
            <p style={{ color: '#888', margin: '0', fontSize: '12px' }}>Student ID</p>
            <p style={{ color: 'white', margin: '5px 0 0 0', fontSize: '16px' }}>{studentProfile.studentId}</p>
          </div>
          <div>
            <p style={{ color: '#888', margin: '0', fontSize: '12px' }}>Program</p>
            <p style={{ color: 'white', margin: '5px 0 0 0', fontSize: '16px' }}>
              {studentProfile.programId?.name || 'N/A'}
            </p>
          </div>
          <div>
            <p style={{ color: '#888', margin: '0', fontSize: '12px' }}>Level</p>
            <p style={{ color: 'white', margin: '5px 0 0 0', fontSize: '16px' }}>Level {studentProfile.level}</p>
          </div>
          <div>
            <p style={{ color: '#888', margin: '0', fontSize: '12px' }}>Semester</p>
            <p style={{ color: 'white', margin: '5px 0 0 0', fontSize: '16px' }}>
              Semester {studentProfile.semester}, {studentProfile.academicYear}
            </p>
          </div>
        </div>
      </div>

      <div className="stats">
        <div className="statCard">
          <h3>Enrolled Classes</h3>
          <div className="value">{classes.length}</div>
        </div>
      </div>

      <div className="tableContainer">
        <h2 style={{ color: 'white', marginBottom: '15px' }}>My Classes</h2>
        {classes.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Course</th>
                <th>Type</th>
                <th>Schedule</th>
                <th>Location</th>
                <th>Lecturer</th>
                <th>Action</th>
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
                  <td>
                    <button onClick={() => markAttendance(cls._id)} className="btn btnSuccess">
                      Mark Present
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: '#888', textAlign: 'center', padding: '20px' }}>
            No classes enrolled yet. Please contact the administrator to enroll you in classes.
          </p>
        )}
      </div>
    </DashboardLayout>
  );
}
