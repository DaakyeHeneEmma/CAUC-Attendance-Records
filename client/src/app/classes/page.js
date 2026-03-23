'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../providers';
import DashboardLayout from '../dashboard/layout';
import axios from 'axios';

export default function ClassesPage() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterLevel, setFilterLevel] = useState('');
  const [filterProgram, setFilterProgram] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    courseId: '',
    type: 'lecture',
    semester: 1,
    academicYear: '2024/2025',
    schedule: { day: 'monday', startTime: '', endTime: '' },
    location: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [classRes, courseRes, studentRes, programRes, enrollRes] = await Promise.all([
        axios.get('/api/structure/classes'),
        axios.get('/api/structure/courses'),
        axios.get('/api/structure/students'),
        axios.get('/api/structure/programs'),
        axios.get('/api/structure/enrollments')
      ]);
      setClasses(classRes.data);
      setCourses(courseRes.data);
      setStudents(studentRes.data);
      setPrograms(programRes.data);
      setEnrolledStudents(enrollRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/structure/classes', formData, {
        headers: { 'x-auth-token': token }
      });
      setShowForm(false);
      setFormData({
        name: '', courseId: '', type: 'lecture', semester: 1, academicYear: '2024/2025',
        schedule: { day: 'monday', startTime: '', endTime: '' }, location: ''
      });
      fetchData();
    } catch (err) {
      console.error('Create class error:', err.response?.data || err.message);
      alert(err.response?.data?.error || 'Failed to create class');
    }
  };

  const handleEnroll = async (studentId) => {
    try {
      await axios.post('/api/structure/enroll', {
        classId: selectedClass._id,
        studentId
      });
      fetchData();
      alert('Student enrolled successfully');
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to enroll student');
    }
  };

  const handleUnenroll = async (studentId) => {
    try {
      await axios.delete(`/api/structure/enroll/${studentId}/${selectedClass._id}`);
      fetchData();
    } catch (err) {
      alert('Failed to unenroll student');
    }
  };

  const getClassEnrollments = (classId) => {
    return enrolledStudents.filter(e => e.classId._id === classId);
  };

  const getUnenrolledStudents = (classId) => {
    const enrolledIds = getClassEnrollments(classId).map(e => e.studentId._id);
    const classItem = classes.find(c => c._id === classId);
    if (!classItem) return [];
    
    const classProgramId = String(classItem.courseId?.programId?._id || classItem.courseId?.programId || '');
    
    return students.filter(s => {
      const studentProgramId = String(s.programId?._id || s.programId || '');
      return studentProgramId === classProgramId && studentProgramId !== '' && !enrolledIds.includes(s._id);
    });
  };

  if (loading) return <DashboardLayout><p className="text-white">Loading...</p></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-white text-xl font-semibold m-0">Classes</h2>
        {(user?.role === 'admin' || user?.role === 'lecturer') && (
          <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-indigo-500 text-white border-none rounded-lg cursor-pointer text-sm transition-opacity hover:opacity-80">
            {showForm ? 'Cancel' : 'Add Class'}
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white p-5 rounded-xl shadow-lg mb-5">
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block text-gray-600 text-sm mb-2">Class Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div className="mb-5">
              <label className="block text-gray-600 text-sm mb-2">Course</label>
              <select
                value={formData.courseId}
                onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-indigo-500 bg-white"
                required
              >
                <option value="">Select Course</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.code} - {course.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-5">
              <label className="block text-gray-600 text-sm mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-indigo-500 bg-white"
              >
                <option value="lecture">Lecture</option>
                <option value="tutorial">Tutorial</option>
                <option value="lab">Lab</option>
              </select>
            </div>
            <div className="mb-5">
              <label className="block text-gray-600 text-sm mb-2">Day</label>
              <select
                value={formData.schedule.day}
                onChange={(e) => setFormData({ ...formData, schedule: { ...formData.schedule, day: e.target.value } })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-indigo-500 bg-white"
              >
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                  <option key={day} value={day}>{day.charAt(0).toUpperCase() + day.slice(1)}</option>
                ))}
              </select>
            </div>
            <div className="mb-5">
              <label className="block text-gray-600 text-sm mb-2">Start Time</label>
              <input
                type="time"
                value={formData.schedule.startTime}
                onChange={(e) => setFormData({ ...formData, schedule: { ...formData.schedule, startTime: e.target.value } })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div className="mb-5">
              <label className="block text-gray-600 text-sm mb-2">End Time</label>
              <input
                type="time"
                value={formData.schedule.endTime}
                onChange={(e) => setFormData({ ...formData, schedule: { ...formData.schedule, endTime: e.target.value } })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div className="mb-5">
              <label className="block text-gray-600 text-sm mb-2">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-indigo-500"
              />
            </div>
            <button type="submit" className="px-4 py-2 bg-green-500 text-white border-none rounded-lg cursor-pointer text-sm transition-opacity hover:opacity-80">
              Create Class
            </button>
          </form>
        </div>
      )}

      <div className="bg-white p-5 rounded-xl shadow-lg overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">Course</th>
              <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">Type</th>
              <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">Schedule</th>
              <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">Location</th>
              <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">Lecturer</th>
              <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">Enrolled</th>
              {(user?.role === 'admin' || user?.role === 'lecturer') && (
                <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">Actions</th>
              )}
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
                <td className="p-3">{getClassEnrollments(cls._id).length}</td>
                {(user?.role === 'admin' || user?.role === 'lecturer') && (
                  <td className="p-3">
                    <button 
                      onClick={() => { setSelectedClass(cls); setShowEnrollModal(true); }}
                      className="px-3 py-1.5 bg-indigo-500 text-white border-none rounded cursor-pointer text-xs transition-opacity hover:opacity-80"
                    >
                      Manage Enrollment
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showEnrollModal && selectedClass && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-5 rounded-lg w-[700px] max-h-[80vh] overflow-y-auto">
            <h3 className="text-white text-lg font-semibold mb-5">
              Manage Enrollment - {selectedClass.courseId?.code}
            </h3>
            
            <h4 className="text-green-400 text-sm font-semibold mb-2.5">Enrolled Students</h4>
            {getClassEnrollments(selectedClass._id).length > 0 ? (
              <table className="w-full mb-5">
                <thead>
                  <tr>
                    <th className="text-left p-2 border-b">ID</th>
                    <th className="text-left p-2 border-b">Name</th>
                    <th className="text-left p-2 border-b">Program</th>
                    <th className="text-left p-2 border-b">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {getClassEnrollments(selectedClass._id).map((enroll) => (
                    <tr key={enroll._id} className="border-b border-gray-700">
                      <td className="p-2 text-gray-300">{enroll.studentId?.studentId}</td>
                      <td className="p-2 text-gray-300">{enroll.studentId?.name}</td>
                      <td className="p-2 text-gray-300">{enroll.studentId?.programId?.name}</td>
                      <td className="p-2">
                        <button 
                          onClick={() => handleUnenroll(enroll.studentId._id)}
                          className="px-3 py-1 bg-red-500 text-white border-none rounded cursor-pointer text-xs transition-opacity hover:opacity-80"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500 mb-5">No students enrolled</p>
            )}

            <h4 className="text-green-400 text-sm font-semibold mb-2.5">Add Students</h4>
            
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-gray-400 text-sm">Program:</label>
                <select 
                  value={filterProgram} 
                  onChange={(e) => setFilterProgram(e.target.value)}
                  className="px-3 py-1.5 bg-gray-700 text-white border border-gray-600 rounded text-sm"
                >
                  <option value="">All Programs</option>
                  {programs.map((prog) => (
                    <option key={prog._id} value={prog._id}>{prog.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-gray-400 text-sm">Level:</label>
                <select 
                  value={filterLevel} 
                  onChange={(e) => setFilterLevel(e.target.value)}
                  className="px-3 py-1.5 bg-gray-700 text-white border border-gray-600 rounded text-sm"
                >
                  <option value="">All Levels</option>
                  <option value="100">100</option>
                  <option value="200">200</option>
                  <option value="300">300</option>
                  <option value="400">400</option>
                </select>
              </div>
            </div>

            {(() => {
              let eligibleStudents = getUnenrolledStudents(selectedClass._id);
              if (filterProgram) {
                eligibleStudents = eligibleStudents.filter(s => s.programId?._id === filterProgram);
              }
              if (filterLevel) {
                eligibleStudents = eligibleStudents.filter(s => s.level === parseInt(filterLevel));
              }
              
              return eligibleStudents.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left p-2 border-b">ID</th>
                      <th className="text-left p-2 border-b">Name</th>
                      <th className="text-left p-2 border-b">Program</th>
                      <th className="text-left p-2 border-b">Level</th>
                      <th className="text-left p-2 border-b">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eligibleStudents.map((student) => (
                      <tr key={student._id} className="border-b border-gray-700">
                        <td className="p-2 text-gray-300">{student.studentId}</td>
                        <td className="p-2 text-gray-300">{student.name}</td>
                        <td className="p-2 text-gray-300">{student.programId?.name || 'N/A'}</td>
                        <td className="p-2 text-gray-300">Level {student.level}</td>
                        <td className="p-2">
                          <button 
                            onClick={() => handleEnroll(student._id)}
                            className="px-3 py-1 bg-green-500 text-white border-none rounded cursor-pointer text-xs transition-opacity hover:opacity-80"
                          >
                            Enroll
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500">No eligible students available</p>
              );
            })()}

            <button 
              onClick={() => { setShowEnrollModal(false); setSelectedClass(null); setFilterLevel(''); setFilterProgram(''); }}
              className="mt-5 px-4 py-2 bg-red-500 text-white border-none rounded-lg cursor-pointer text-sm transition-opacity hover:opacity-80"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
