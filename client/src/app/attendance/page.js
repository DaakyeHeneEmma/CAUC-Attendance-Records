'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../providers';
import DashboardLayout from '../dashboard/layout';
import axios from 'axios';

export default function AttendancePage() {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get('/api/classes');
        setClasses(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        let url = '/api/attendance/report';
        if (selectedClass) url += `?classId=${selectedClass}`;
        const res = await axios.get(url);
        setAttendance(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (selectedClass) {
      fetchAttendance();
    }
  }, [selectedClass]);

  if (loading) return <DashboardLayout><p>Loading...</p></DashboardLayout>;

  return (
    <DashboardLayout>
      <h2 style={{ marginBottom: '20px', color: 'white' }}>Attendance Records</h2>
      
      {user.role !== 'student' && (
        <div className="formGroup" style={{ marginBottom: '20px' }}>
          <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
            <option value="">Select Class</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>{cls.name} - {cls.courseId?.name}</option>
            ))}
          </select>
        </div>
      )}

      <div className="tableContainer">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Course</th>
              <th>Present</th>
              <th>Absent</th>
              <th>Late</th>
              <th>Rate</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((record, idx) => (
              <tr key={idx}>
                <td>{record.student?.[0]?.name || 'N/A'}</td>
                <td>{record.course?.[0]?.name || 'N/A'}</td>
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
