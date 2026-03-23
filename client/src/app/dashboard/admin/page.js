'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../layout';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalStudents: 0, todayAttendance: 0, attendanceRate: 0 });
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [students, setStudents] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, facultiesRes, deptsRes, progsRes, studentRes, lecturerRes] = await Promise.all([
          axios.get('/api/attendance/stats'),
          axios.get('/api/structure/faculties'),
          axios.get('/api/structure/departments'),
          axios.get('/api/structure/programs'),
          axios.get('/api/structure/students'),
          axios.get('/api/auth/lecturers')
        ]);
        setStats(statsRes.data);
        setFaculties(facultiesRes.data);
        setDepartments(deptsRes.data);
        setPrograms(progsRes.data);
        setStudents(studentRes.data);
        setLecturers(lecturerRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <DashboardLayout><p className="text-white">Loading...</p></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-gray-500 text-sm m-0 mb-2">Total Students</h3>
          <div className="text-4xl font-bold text-indigo-500">{stats.totalStudents}</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-gray-500 text-sm m-0 mb-2">Today's Attendance</h3>
          <div className="text-4xl font-bold text-indigo-500">{stats.todayAttendance}</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-gray-500 text-sm m-0 mb-2">Attendance Rate</h3>
          <div className="text-4xl font-bold text-indigo-500">{stats.attendanceRate}%</div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-lg overflow-x-auto mb-5">
        <h2 className="text-gray-800 text-xl font-semibold mb-4">Faculties</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">Code</th>
              <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">Name</th>
              <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">University</th>
            </tr>
          </thead>
          <tbody>
            {faculties.map((faculty) => (
              <tr key={faculty._id} className="border-b border-gray-100">
                <td className="p-3">{faculty.code}</td>
                <td className="p-3">{faculty.name}</td>
                <td className="p-3">{faculty.universityId?.name || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-lg overflow-x-auto mb-5">
        <h2 className="text-gray-800 text-xl font-semibold mb-4">Departments</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">Code</th>
              <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">Name</th>
              <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">Faculty</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr key={dept._id} className="border-b border-gray-100">
                <td className="p-3">{dept.code}</td>
                <td className="p-3">{dept.name}</td>
                <td className="p-3">{dept.facultyId?.name || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-lg overflow-x-auto">
        <h2 className="text-gray-800 text-xl font-semibold mb-4">Programs</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">Code</th>
              <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">Name</th>
              <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">Level</th>
              <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">Department</th>
            </tr>
          </thead>
          <tbody>
            {programs.map((prog) => (
              <tr key={prog._id} className="border-b border-gray-100">
                <td className="p-3">{prog.code}</td>
                <td className="p-3">{prog.name}</td>
                <td className="p-3">{prog.level}</td>
                <td className="p-3">{prog.departmentId?.name || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-lg overflow-x-auto mt-5">
        <h2 className="text-gray-800 text-xl font-semibold mb-4">Students</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">Student ID</th>
              <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">Name</th>
              <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">Email</th>
              <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">Program</th>
              <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">Level</th>
              <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">Semester</th>
              <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">Academic Year</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id} className="border-b border-gray-100">
                <td className="p-3">{student.studentId}</td>
                <td className="p-3">{student.name}</td>
                <td className="p-3">{student.email}</td>
                <td className="p-3">{student.programId?.name || 'N/A'}</td>
                <td className="p-3">{student.level}</td>
                <td className="p-3">{student.semester}</td>
                <td className="p-3">{student.academicYear}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-lg overflow-x-auto mt-5">
        <h2 className="text-gray-800 text-xl font-semibold mb-4">Lecturers</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">Staff ID</th>
              <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">Name</th>
              <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">Email</th>
              <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">Department</th>
            </tr>
          </thead>
          <tbody>
            {lecturers.map((lecturer) => (
              <tr key={lecturer._id} className="border-b border-gray-100">
                <td className="p-3">{lecturer.staffId}</td>
                <td className="p-3">{lecturer.name}</td>
                <td className="p-3">{lecturer.email}</td>
                <td className="p-3">{lecturer.departmentId?.name || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
