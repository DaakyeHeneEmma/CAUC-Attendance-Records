'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../providers';
import axios from 'axios';
import DashboardLayout from '../layout';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [studentProfile, setStudentProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { 'x-auth-token': token } };
        
        const classRes = await axios.get('/api/structure/classes', config);
        setClasses(classRes.data);

        const studentRes = await axios.get('/api/structure/students', config);
        const student = studentRes.data.find(s => s.userId === user.id);
        setStudentProfile(student);
      } catch (err) {
        console.error(err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const markAttendance = async (classId) => {
    try {
      if (!studentProfile) {
        alert('Student profile not found');
        return;
      }
      await axios.post('/api/attendance/mark', {
        classId,
        studentId: studentProfile._id
      });
      alert('Attendance marked successfully!');
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to mark attendance');
    }
  };

  if (loading) return <DashboardLayout><p className="text-white">Loading...</p></DashboardLayout>;

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-red-500 p-5 m-5">{error}</div>
      </DashboardLayout>
    );
  }

  if (!studentProfile) {
    return (
      <DashboardLayout>
        <p className="text-white p-5">Your student profile has not been created yet. Please contact the administrator.</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="bg-white p-5 rounded-xl shadow-lg mb-5">
        <h2 className="text-gray-800 text-xl font-semibold mb-4">My Profile</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <p className="text-gray-500 m-0 text-xs">Name</p>
            <p className="text-black m-0 mt-1 text-base">{user?.name}</p>
          </div>
          <div>
            <p className="text-gray-500 m-0 text-xs">Email</p>
            <p className="text-black m-0 mt-1 text-base">{user?.email}</p>
          </div>
          <div>
            <p className="text-gray-500 m-0 text-xs">Student ID</p>
            <p className="text-black m-0 mt-1 text-base">{studentProfile.studentId}</p>
          </div>
          <div>
            <p className="text-gray-500 m-0 text-xs">Program</p>
            <p className="text-black m-0 mt-1 text-base">{studentProfile.programId?.name || 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-500 m-0 text-xs">Level</p>
            <p className="text-black m-0 mt-1 text-base">Level {studentProfile.level}</p>
          </div>
          <div>
            <p className="text-gray-500 m-0 text-xs">Semester</p>
            <p className="text-black m-0 mt-1 text-base">
              Semester {studentProfile.semester}, {studentProfile.academicYear}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-gray-500 text-sm m-0 mb-2">Enrolled Classes</h3>
          <div className="text-4xl font-bold text-indigo-500">{classes.length}</div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-lg overflow-x-auto">
        <h2 className="text-gray-800 text-xl font-semibold mb-4">My Classes</h2>
        {classes.length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">Course</th>
                <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">Type</th>
                <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">Schedule</th>
                <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">Location</th>
                <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">Lecturer</th>
                <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((cls) => (
                <tr key={cls._id} className="border-b border-gray-100">
                  <td className="p-3">
                    <strong className="text-gray-800">{cls.courseId?.name}</strong>
                    <br/>
                    <span className="text-gray-500 text-sm">{cls.courseId?.code}</span>
                  </td>
                  <td className="p-3 capitalize">{cls.type}</td>
                  <td className="p-3">
                    {cls.schedule?.day && cls.schedule?.day.charAt(0).toUpperCase() + cls.schedule?.day.slice(1)}
                    <br/>
                    <span className="text-gray-500 text-sm">
                      {cls.schedule?.startTime} - {cls.schedule?.endTime}
                    </span>
                  </td>
                  <td className="p-3">{cls.location || 'N/A'}</td>
                  <td className="p-3">{cls.lecturerId?.name || 'N/A'}</td>
                  <td className="p-3">
                    <button onClick={() => markAttendance(cls._id)} className="px-4 py-2 bg-green-500 text-white border-none rounded-lg cursor-pointer text-sm transition-opacity hover:opacity-80">
                      Mark Present
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 text-center p-5">
            No classes enrolled yet. Please contact the administrator to enroll you in classes.
          </p>
        )}
      </div>
    </DashboardLayout>
  );
}
