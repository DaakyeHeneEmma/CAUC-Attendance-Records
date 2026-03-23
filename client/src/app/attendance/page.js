'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../providers';
import DashboardLayout from '../dashboard/layout';
import axios from 'axios';

export default function AttendancePage() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [studentProfile, setStudentProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classRes = await axios.get('/api/structure/classes');
        setClasses(classRes.data);

        if (user?.role === 'student') {
          const studentRes = await axios.get('/api/structure/students');
          const student = studentRes.data.find(s => s.userId === user.id);
          setStudentProfile(student);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!selectedClass) return;
      try {
        const res = await axios.get(`/api/attendance/report?classId=${selectedClass}`);
        setAttendanceRecords(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAttendance();
  }, [selectedClass]);

  if (loading) return <DashboardLayout><p>Loading...</p></DashboardLayout>;

  return (
    <DashboardLayout>
      <h2 style={{ marginBottom: '20px', color: 'white' }}>
        {user?.role === 'student' ? 'My Attendance' : 'Attendance Records'}
      </h2>
      
      <div className="formGroup" style={{ marginBottom: '20px' }}>
        <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
          <option value="">Select Class</option>
          {classes.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.courseId?.code} - {cls.courseId?.name} ({cls.type})
            </option>
          ))}
        </select>
      </div>

      <div className="tableContainer">
        <table>
          <thead>
            <tr>
              {user?.role !== 'student' && (
                <>
                  <th>Student</th>
                  <th>Student ID</th>
                </>
              )}
              <th>Course</th>
              <th>Present</th>
              <th>Absent</th>
              <th>Late</th>
              <th>Rate</th>
            </tr>
          </thead>
          <tbody>
            {user?.role === 'student' ? (
              attendanceRecords
                .filter(record => studentProfile && record._id.studentId === studentProfile._id)
                .map((record) => (
                  <tr key={record._id.studentId}>
                    <td>{record.class?.[0]?.courseId?.name || 'N/A'}</td>
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
              attendanceRecords.length > 0 ? (
                attendanceRecords.map((record) => (
                  <tr key={record._id.studentId}>
                    <td>{record.student?.[0]?.name || 'N/A'}</td>
                    <td>{record.student?.[0]?.studentId || 'N/A'}</td>
                    <td>{record.class?.[0]?.courseId?.name || 'N/A'}</td>
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
                  <td colSpan={selectedClass ? '7' : '1'} style={{ textAlign: 'center' }}>
                    {selectedClass ? 'No attendance records' : 'Select a class to view attendance'}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
