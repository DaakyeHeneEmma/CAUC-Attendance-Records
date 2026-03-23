'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../layout';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalStudents: 0, todayAttendance: 0, attendanceRate: 0 });
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, studentsRes, coursesRes] = await Promise.all([
          axios.get('/api/attendance/stats'),
          axios.get('/api/students'),
          axios.get('/api/courses')
        ]);
        setStats(statsRes.data);
        setStudents(studentsRes.data);
        setCourses(coursesRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <DashboardLayout>
      <div className="stats">
        <div className="statCard">
          <h3>Total Students</h3>
          <div className="value">{stats.totalStudents}</div>
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

      <div className="tableContainer" style={{ marginBottom: '20px' }}>
        <h2>Recent Students</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Course</th>
            </tr>
          </thead>
          <tbody>
            {students.slice(0, 5).map((student) => (
              <tr key={student._id}>
                <td>{student.studentId}</td>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.courseId?.name || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="tableContainer">
        <h2>Courses</h2>
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Faculty</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course._id}>
                <td>{course.code}</td>
                <td>{course.name}</td>
                <td>{course.facultyId?.name || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
