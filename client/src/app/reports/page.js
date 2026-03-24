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

  if (loading) return <DashboardLayout><p className="text-white">Loading...</p></DashboardLayout>;

  const avgAttendance = filteredReport.length > 0
    ? (filteredReport.reduce((acc, r) => acc + (r.totalPresent / r.totalClasses) * 100, 0) / filteredReport.length).toFixed(1)
    : 0;

  return (
    <DashboardLayout>
      <h2 className="mb-5 text-white text-xl font-semibold">Attendance Reports</h2>

      <div className="mb-5">
        <select 
          value={selectedClass} 
          onChange={(e) => setSelectedClass(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-indigo-500 bg-white"
        >
          <option value="">All Classes</option>
          {classes.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.courseId?.code} - {cls.courseId?.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-gray-500 text-sm m-0 mb-2">Total Records</h3>
          <div className="text-4xl font-bold text-indigo-500">{filteredReport.length}</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-gray-500 text-sm m-0 mb-2">Classes</h3>
          <div className="text-4xl font-bold text-indigo-500">{classes.length}</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-gray-500 text-sm m-0 mb-2">Avg Attendance</h3>
          <div className="text-4xl font-bold text-indigo-500">{avgAttendance}%</div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-lg overflow-x-auto">
        <h2 className="text-gray-800 text-xl font-semibold mb-4">Detailed Report</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">Student ID</th>
              <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">Student Name</th>
              <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">Course</th>
              <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">Total Classes</th>
              <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">Present</th>
              <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">Absent</th>
              <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">Late</th>
              <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">Attendance %</th>
            </tr>
          </thead>
          <tbody>
            {filteredReport.length > 0 ? (
              filteredReport.map((record, idx) => (
                <tr key={idx} className="border-b border-gray-100">
                  <td className="p-3">{record.student?.[0]?.studentId || 'N/A'}</td>
                  <td className="p-3">{record.student?.[0]?.name || 'N/A'}</td>
                  <td className="p-3">{record.class?.[0]?.courseId?.name || 'N/A'}</td>
                  <td className="p-3">{record.totalClasses || 0}</td>
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
                <td colSpan="8" className="p-3 text-center">No attendance records found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
