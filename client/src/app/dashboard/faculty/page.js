'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../layout';

export default function LecturerDashboard() {
  const [classes, setClasses] = useState([]);
  const [enrollments, setEnrollments] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classRes = await axios.get('/api/structure/classes');
        setClasses(classRes.data);
        
        const enrollRes = await axios.get('/api/structure/enrollments');
        const enrollMap = {};
        enrollRes.data.forEach(e => {
          if (!enrollMap[e.classId._id]) {
            enrollMap[e.classId._id] = [];
          }
          enrollMap[e.classId._id].push(e);
        });
        setEnrollments(enrollMap);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const viewEnrollments = (classId) => {
    setSelectedClass(classId);
  };

  if (loading) return <DashboardLayout><p className="text-white">Loading...</p></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-gray-500 text-sm m-0 mb-2">My Classes</h3>
          <div className="text-4xl font-bold text-indigo-500">{classes.length}</div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-lg overflow-x-auto">
        <h2 className="text-gray-800 text-xl font-semibold mb-4">My Classes</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">Course</th>
              <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">Type</th>
              <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">Schedule</th>
              <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">Location</th>
              <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">Enrolled</th>
              <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">Actions</th>
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
                <td className="p-3">{enrollments[cls._id]?.length || 0}</td>
                <td className="p-3">
                  <button onClick={() => viewEnrollments(cls._id)} className="px-4 py-2 bg-indigo-500 text-white border-none rounded-lg cursor-pointer text-sm transition-opacity hover:opacity-80">
                    View Students
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedClass && enrollments[selectedClass] && (
        <div className="bg-white p-5 rounded-xl shadow-lg overflow-x-auto mt-5">
          <h3 className="text-gray-800 text-lg font-semibold mb-4 flex items-center">
            Students in Class
            <button 
              onClick={() => setSelectedClass(null)} 
              className="ml-5 px-3 py-1.5 bg-red-500 text-white border-none rounded-lg cursor-pointer text-sm transition-opacity hover:opacity-80"
            >
              Close
            </button>
          </h3>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">Student ID</th>
                <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">Name</th>
                <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">Email</th>
              </tr>
            </thead>
            <tbody>
              {enrollments[selectedClass].map((enroll) => (
                <tr key={enroll._id} className="border-b border-gray-100">
                  <td className="p-3">{enroll.studentId?.studentId}</td>
                  <td className="p-3">{enroll.studentId?.name}</td>
                  <td className="p-3">{enroll.studentId?.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}
