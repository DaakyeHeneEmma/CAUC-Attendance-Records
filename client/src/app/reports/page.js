'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '../dashboard/layout';
import axios from 'axios';

export default function ReportsPage() {
  const [report, setReport] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classRes = await axios.get('/api/structure/classes');
        setClasses(classRes.data);
        
        const reportRes = await axios.get('/api/attendance/report');
        setReport(reportRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredReport = selectedClass 
    ? report.filter(r => r._id.classId === selectedClass)
    : report;

  if (loading) return <DashboardLayout><p>Loading...</p></DashboardLayout>;

  const avgAttendance = filteredReport.length > 0
    ? (filteredReport.reduce((acc, r) => acc + (r.totalPresent / r.totalClasses) * 100, 0) / filteredReport.length).toFixed(1)
    : 0;

  return (
    <DashboardLayout>
      <h2 style={{ marginBottom: '20px', color: 'white' }}>Attendance Reports</h2>

      <div className="formGroup" style={{ marginBottom: '20px' }}>
        <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
          <option value="">All Classes</option>
          {classes.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.courseId?.code} - {cls.courseId?.name}
            </option>
          ))}
        </select>
      </div>

      <div className="stats">
        <div className="statCard">
          <h3>Total Records</h3>
          <div className="value">{filteredReport.length}</div>
        </div>
        <div className="statCard">
          <h3>Classes</h3>
          <div className="value">{classes.length}</div>
        </div>
        <div className="statCard">
          <h3>Avg Attendance</h3>
          <div className="value">{avgAttendance}%</div>
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
            {filteredReport.length > 0 ? (
              filteredReport.map((record, idx) => (
                <tr key={idx}>
                  <td>{record.student?.[0]?.studentId || 'N/A'}</td>
                  <td>{record.student?.[0]?.name || 'N/A'}</td>
                  <td>{record.class?.[0]?.courseId?.name || 'N/A'}</td>
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
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center' }}>No attendance records found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
