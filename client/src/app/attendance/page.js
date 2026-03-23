'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../providers';
import DashboardLayout from '../dashboard/layout';
import axios from 'axios';

export default function AttendancePage() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [studentProfile, setStudentProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classRes = await axios.get('/api/classes');
        setClasses(classRes.data);

        if (user?.role === 'student') {
          const studentRes = await axios.get('/api/students');
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
      try {
        let url = '/api/attendance/report';
        if (selectedClass) url += `?classId=${selectedClass}`;
        const res = await axios.get(url);
        
        const recordsMap = {};
        res.data.forEach((record) => {
          const studentId = record._id.studentId;
          recordsMap[studentId] = record;
        });
        setAttendanceRecords(recordsMap);
      } catch (err) {
        console.error(err);
      }
    };
    if (selectedClass) {
      fetchAttendance();
    }
  }, [selectedClass]);

  const selectedClassData = classes.find(c => c._id === selectedClass);

  if (loading) return <DashboardLayout><p>Loading...</p></DashboardLayout>;

  return (
    <DashboardLayout>
      <h2 style={{ marginBottom: '20px', color: 'white' }}>
        {user?.role === 'student' ? 'My Attendance' : 'Attendance Records'}
      </h2>
      
      {(user?.role === 'admin' || user?.role === 'faculty') && (
        <div className="formGroup" style={{ marginBottom: '20px' }}>
          <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
            <option value="">Select Class</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>{cls.name} - {cls.courseId?.name}</option>
            ))}
          </select>
        </div>
      )}

      {user?.role === 'student' && classes.length > 0 && !selectedClass && (
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
              {user?.role !== 'student' && (
                <>
                  <th>Student ID</th>
                  <th>Student Name</th>
                </>
              )}
              <th>Present</th>
              <th>Absent</th>
              <th>Late</th>
              <th>Rate</th>
            </tr>
          </thead>
          <tbody>
            {user?.role === 'student' && studentProfile ? (
              Object.values(attendanceRecords)
                .filter(record => record._id.studentId === studentProfile._id)
                .map((record) => (
                  <tr key={record._id.studentId}>
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
            ) : selectedClassData?.students?.length > 0 ? (
              selectedClassData.students.map((student) => {
                const record = attendanceRecords[student._id];
                return (
                  <tr key={student._id}>
                    <td>{student.studentId}</td>
                    <td>{student.name}</td>
                    <td className="statusPresent">{record?.totalPresent || 0}</td>
                    <td className="statusAbsent">{record?.totalAbsent || 0}</td>
                    <td className="statusLate">{record?.totalLate || 0}</td>
                    <td>
                      {record?.totalClasses > 0 
                        ? ((record.totalPresent / record.totalClasses) * 100).toFixed(1)
                        : 0}%
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={user?.role !== 'student' ? '6' : '4'} style={{ textAlign: 'center' }}>
                  {selectedClass ? 'No students in this class' : 'Select a class to view attendance'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
