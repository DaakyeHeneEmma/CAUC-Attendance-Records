'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../layout';

export default function FacultyDashboard() {
  const [classes, setClasses] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [stats, setStats] = useState({ totalStudents: 0, todayAttendance: 0, attendanceRate: 0 });
  const [selectedClass, setSelectedClass] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classesRes, statsRes] = await Promise.all([
          axios.get('/api/classes'),
          axios.get('/api/attendance/stats')
        ]);
        setClasses(classesRes.data);
        setStats(statsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const viewAttendance = async (classId) => {
    try {
      const res = await axios.get(`/api/attendance/class/${classId}`);
      setAttendance(res.data);
      setSelectedClass(classId);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (attendanceId, status) => {
    try {
      await axios.put(`/api/attendance/${attendanceId}`, { status });
      viewAttendance(selectedClass);
    } catch (err) {
      alert('Failed to update attendance');
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
        <div className="statCard">
          <h3>Today's Attendance</h3>
          <div className="value">{stats.todayAttendance}</div>
        </div>
        <div className="statCard">
          <h3>Attendance Rate</h3>
          <div className="value">{stats.attendanceRate}%</div>
        </div>
      </div>

      <div className="tableContainer">
        <h2>My Classes</h2>
        <table>
          <thead>
            <tr>
              <th>Class</th>
              <th>Course</th>
              <th>Schedule</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((cls) => (
              <tr key={cls._id}>
                <td>{cls.name}</td>
                <td>{cls.courseId?.name}</td>
                <td>{cls.schedule?.day} {cls.schedule?.startTime} - {cls.schedule?.endTime}</td>
                <td>
                  <button onClick={() => viewAttendance(cls._id)} className="btn btnPrimary">
                    View Attendance
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedClass && (
        <div className="tableContainer" style={{ marginTop: '20px' }}>
          <h3>Class Attendance</h3>
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Student ID</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {attendance.length === 0 ? (
                <tr><td colSpan="4">No attendance records yet</td></tr>
              ) : (
                attendance.map((record) => (
                  <tr key={record._id}>
                    <td>{record.studentId?.name}</td>
                    <td>{record.studentId?.studentId}</td>
                    <td className={`status${record.status.charAt(0).toUpperCase() + record.status.slice(1)}`}>
                      {record.status}
                    </td>
                    <td>
                      <select
                        value={record.status}
                        onChange={(e) => updateStatus(record._id, e.target.value)}
                        className="formGroup"
                      >
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                        <option value="late">Late</option>
                        <option value="excused">Excused</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}
