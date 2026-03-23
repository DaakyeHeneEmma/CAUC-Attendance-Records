'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../layout';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalStudents: 0, todayAttendance: 0, attendanceRate: 0 });
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, facultiesRes, deptsRes, progsRes] = await Promise.all([
          axios.get('/api/attendance/stats'),
          axios.get('/api/structure/faculties'),
          axios.get('/api/structure/departments'),
          axios.get('/api/structure/programs')
        ]);
        setStats(statsRes.data);
        setFaculties(facultiesRes.data);
        setDepartments(deptsRes.data);
        setPrograms(progsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <DashboardLayout><p>Loading...</p></DashboardLayout>;

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
        <h2>Faculties</h2>
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>University</th>
            </tr>
          </thead>
          <tbody>
            {faculties.map((faculty) => (
              <tr key={faculty._id}>
                <td>{faculty.code}</td>
                <td>{faculty.name}</td>
                <td>{faculty.universityId?.name || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="tableContainer" style={{ marginBottom: '20px' }}>
        <h2>Departments</h2>
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Faculty</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr key={dept._id}>
                <td>{dept.code}</td>
                <td>{dept.name}</td>
                <td>{dept.facultyId?.name || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="tableContainer">
        <h2>Programs</h2>
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Level</th>
              <th>Department</th>
            </tr>
          </thead>
          <tbody>
            {programs.map((prog) => (
              <tr key={prog._id}>
                <td>{prog.code}</td>
                <td>{prog.name}</td>
                <td>{prog.level}</td>
                <td>{prog.departmentId?.name || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
