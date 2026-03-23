'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '../dashboard/layout';
import axios from 'axios';

export default function ReportsPage() {
  const [report, setReport] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, reportRes] = await Promise.all([
          axios.get('/api/courses'),
          axios.get('/api/attendance/report')
        ]);
        setCourses(coursesRes.data);
        setReport(reportRes.data);
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
      <h2 style={{ marginBottom: '20px', color: 'white' }}>Attendance Reports</h2>

      <div className="stats">
        <div className="statCard">
          <h3>Total Records</h3>
          <div className="value">{report.length}</div>
        </div>
        <div className="statCard">
          <h3>Courses</h3>
          <div className="value">{courses.length}</div>
        </div>
        <div className="statCard">
          <h3>Avg Attendance</h3>
          <div className="value">
            {report.length > 0
              ? (report.reduce((acc, r) => acc + (r.totalPresent / r.totalClasses) * 100, 0) / report.length).toFixed(1)
              : 0}%
          </div>
        </div>
      </div>

      <div className="tableContainer">
        <h2>Detailed Report</h2>
        <table>
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Student Name</th>
              <th>Course</th>
              <th>Total Classes</th>
              <th>Present</th>
              <th>Absent</th>
              <th>Late</th>
              <th>Attendance %</th>
            </tr>
          </thead>
          <tbody>
            {report.map((record, idx) => (
              <tr key={idx}>
                <td>{record.student?.[0]?.studentId || 'N/A'}</td>
                <td>{record.student?.[0]?.name || 'N/A'}</td>
                <td>{record.course?.[0]?.name || 'N/A'}</td>
                <td>{record.totalClasses || 0}</td>
                <td className="statusPresent">{record.totalPresent || 0}</td>
                <td className="statusAbsent">{record.totalAbsent || 0}</td>
                <td className="statusLate">{record.totalLate || 0}</td>
                <td>
                  {record.totalClasses > 0 
                    ? ((record.totalPresent / record.totalClasses) * 100).toFixed(1)
                    : 0}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
