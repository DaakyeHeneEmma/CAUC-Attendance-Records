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

  if (loading) return <DashboardLayout><p>Loading...</p></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="stats">
        <div className="statCard">
          <h3>My Classes</h3>
          <div className="value">{classes.length}</div>
        </div>
      </div>

      <div className="tableContainer">
        <h2 style={{ color: 'white', marginBottom: '15px' }}>My Classes</h2>
        <table>
          <thead>
            <tr>
              <th>Course</th>
              <th>Type</th>
              <th>Schedule</th>
              <th>Location</th>
              <th>Enrolled</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((cls) => (
              <tr key={cls._id}>
                <td>
                  <strong>{cls.courseId?.name}</strong>
                  <br/>
                  <small style={{ color: '#888' }}>{cls.courseId?.code}</small>
                </td>
                <td style={{ textTransform: 'capitalize' }}>{cls.type}</td>
                <td>
                  {cls.schedule?.day && cls.schedule?.day.charAt(0).toUpperCase() + cls.schedule?.day.slice(1)}
                  <br/>
                  <small style={{ color: '#888' }}>
                    {cls.schedule?.startTime} - {cls.schedule?.endTime}
                  </small>
                </td>
                <td>{cls.location || 'N/A'}</td>
                <td>{enrollments[cls._id]?.length || 0}</td>
                <td>
                  <button onClick={() => viewEnrollments(cls._id)} className="btn btnPrimary">
                    View Students
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedClass && enrollments[selectedClass] && (
        <div className="tableContainer" style={{ marginTop: '20px' }}>
          <h3 style={{ color: 'white', marginBottom: '15px' }}>
            Students in Class
            <button 
              onClick={() => setSelectedClass(null)} 
              className="btn btnDanger" 
              style={{ marginLeft: '20px', padding: '5px 10px' }}
            >
              Close
            </button>
          </h3>
          <table>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {enrollments[selectedClass].map((enroll) => (
                <tr key={enroll._id}>
                  <td>{enroll.studentId?.studentId}</td>
                  <td>{enroll.studentId?.name}</td>
                  <td>{enroll.studentId?.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}
