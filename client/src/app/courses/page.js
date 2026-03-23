'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../providers';
import DashboardLayout from '../dashboard/layout';
import axios from 'axios';

export default function CoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ 
    code: '', 
    name: '', 
    description: '',
    programId: '',
    credits: 3,
    semester: 1
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [courseRes, programRes] = await Promise.all([
        axios.get('/api/structure/courses'),
        axios.get('/api/structure/programs')
      ]);
      setCourses(courseRes.data);
      setPrograms(programRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/structure/courses', formData);
      setShowForm(false);
      setFormData({ code: '', name: '', description: '', programId: '', credits: 3, semester: 1 });
      fetchData();
    } catch (err) {
      alert('Failed to create course');
    }
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-white text-xl font-semibold m-0">Courses</h2>
        {user?.role === 'admin' && (
          <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-indigo-500 text-white border-none rounded-lg cursor-pointer text-sm transition-opacity hover:opacity-80">
            {showForm ? 'Cancel' : 'Add Course'}
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white p-5 rounded-xl shadow-lg mb-5">
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block text-gray-600 text-sm mb-2">Course Code</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div className="mb-5">
              <label className="block text-gray-600 text-sm mb-2">Course Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div className="mb-5">
              <label className="block text-gray-600 text-sm mb-2">Program</label>
              <select
                value={formData.programId}
                onChange={(e) => setFormData({ ...formData, programId: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-indigo-500 bg-white"
                required
              >
                <option value="">Select Program</option>
                {programs.map((prog) => (
                  <option key={prog._id} value={prog._id}>{prog.name} ({prog.code})</option>
                ))}
              </select>
            </div>
            <div className="mb-5">
              <label className="block text-gray-600 text-sm mb-2">Credits</label>
              <input
                type="number"
                value={formData.credits}
                onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-indigo-500"
                min="1"
                max="6"
              />
            </div>
            <div className="mb-5">
              <label className="block text-gray-600 text-sm mb-2">Semester</label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-indigo-500 bg-white"
              >
                <option value={1}>Semester 1</option>
                <option value={2}>Semester 2</option>
              </select>
            </div>
            <div className="mb-5">
              <label className="block text-gray-600 text-sm mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-indigo-500 bg-gray-800 text-white"
              />
            </div>
            <button type="submit" className="px-4 py-2 bg-green-500 text-white border-none rounded-lg cursor-pointer text-sm transition-opacity hover:opacity-80">
              Create Course
            </button>
          </form>
        </div>
      )}

      <div className="bg-white p-5 rounded-xl shadow-lg overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">Code</th>
              <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">Name</th>
              <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">Program</th>
              <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">Credits</th>
              <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold">Semester</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course._id} className="border-b border-gray-100">
                <td className="p-3">{course.code}</td>
                <td className="p-3">{course.name}</td>
                <td className="p-3">{course.programId?.name || 'N/A'}</td>
                <td className="p-3">{course.credits}</td>
                <td className="p-3">{course.semester}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
