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

  if (loading) return <DashboardLayout><p className="text-white">Loading...</p></DashboardLayout>;

  return (
    <DashboardLayout>
      <h2 className="mb-5 text-white text-xl font-semibold">
        {user?.role === 'student' ? 'My Attendance' : 'Attendance Records'}
      </h2>
      
      <div className="mb-5">
        <select 
          value={selectedClass} 
          onChange={(e) => setSelectedClass(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-indigo-500 bg-white"
        >
          <option value="">Select Class</option>
          {classes.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.courseId?.code} - {cls.courseId?.name} ({cls.type})
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-lg overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {user?.role !== 'student' && (
                <>
                  <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">Student</th>
                  <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">Student ID</th>
                </>
              )}
              <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">Course</th>
              <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">Present</th>
              <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">Absent</th>
              <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">Late</th>
              <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">Rate</th>
            </tr>
          </thead>
          <tbody>
            {user?.role === 'student' ? (
              attendanceRecords
                .filter(record => studentProfile && record._id.studentId === studentProfile._id)
                .map((record) => (
                  <tr key={record._id.studentId} className="border-b border-gray-100">
                    <td className="p-3">{record.class?.[0]?.courseId?.name || 'N/A'}</td>
                    <td className="p-3 text-green-600 font-bold">{record.totalPresent || 0}</td>
                    <td className="p-3 text-red-500 font-bold">{record.totalAbsent || 0}</td>
                    <td className="p-3 text-orange-500 font-bold">{record.totalLate || 0}</td>
                    <td className="p-3">
                      {record.totalClasses > 0 
                        ? ((record.totalPresent / record.totalClasses) * 100).toFixed(1)
                        : 0}%
                    </td>
                  </tr>
                ))
            ) : (
              attendanceRecords.length > 0 ? (
                attendanceRecords.map((record) => (
                  <tr key={record._id.studentId} className="border-b border-gray-100">
                    <td className="p-3">{record.student?.[0]?.name || 'N/A'}</td>
                    <td className="p-3">{record.student?.[0]?.studentId || 'N/A'}</td>
                    <td className="p-3">{record.class?.[0]?.courseId?.name || 'N/A'}</td>
                    <td className="p-3 text-green-600 font-bold">{record.totalPresent || 0}</td>
                    <td className="p-3 text-red-500 font-bold">{record.totalAbsent || 0}</td>
                    <td className="p-3 text-orange-500 font-bold">{record.totalLate || 0}</td>
                    <td className="p-3">
                      {record.totalClasses > 0 
                        ? ((record.totalPresent / record.totalClasses) * 100).toFixed(1)
                        : 0}%
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={selectedClass ? 7 : 1} className="p-3 text-center">
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
