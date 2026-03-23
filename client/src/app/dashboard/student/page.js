'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../providers';
import axios from 'axios';
import DashboardLayout from '../layout';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get('/api/classes');
        setClasses(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  const markAttendance = async (classId) => {
    try {
      const studentRes = await axios.get('/api/students');
      const student = studentRes.data.find(s => s.userId === user.id);
      if (!student) {
        alert('Student profile not found');
        return;
      }
      await axios.post('/api/attendance/mark', {
        classId,
        studentId: student._id
      });
      alert('Attendance marked successfully!');
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to mark attendance');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <DashboardLayout>
      <div className="stats">
        <div className="statCard">
          <h3>My Classes</h3>
          <div className="value">{classes.length}</div>
        </div>
      </div>

      <div className="tableContainer">
        <h2>Available Classes - Mark Attendance Manually</h2>
        <table>
          <thead>
            <tr>
              <th>Class</th>
              <th>Course</th>
              <th>Schedule</th>
              <th>Location</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((cls) => (
              <tr key={cls._id}>
                <td>{cls.name}</td>
                <td>{cls.courseId?.name}</td>
                <td>{cls.schedule?.day} {cls.schedule?.startTime} - {cls.schedule?.endTime}</td>
                <td>{cls.location || 'N/A'}</td>
                <td>
                  <button onClick={() => markAttendance(cls._id)} className="btn btnSuccess">
                    Mark Present
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
