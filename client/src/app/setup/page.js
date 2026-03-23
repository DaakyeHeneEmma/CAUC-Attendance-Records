'use client';

import { useState } from 'react';
import axios from 'axios';

export default function SetupPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const seedData = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login as admin first');
        setLoading(false);
        return;
      }
      const res = await axios.post('/api/structure/seed', {}, {
        headers: { 'x-auth-token': token }
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.msg || err.response?.data?.error || 'Failed to seed data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#0a0a0a',
      color: 'white',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#1a1a1a',
        padding: '40px',
        borderRadius: '12px',
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center'
      }}>
        <h1 style={{ marginBottom: '20px', color: '#4ade80' }}>CAUC Attendance Setup</h1>
        
        <p style={{ color: '#888', marginBottom: '30px', lineHeight: '1.6' }}>
          Click below to initialize the university structure with sample data including:
          <br/>• University, Faculty, Department
          <br/>• Programs and Courses
        </p>

        <button 
          onClick={seedData}
          disabled={loading}
          style={{
            padding: '15px 30px',
            fontSize: '16px',
            backgroundColor: '#4ade80',
            color: '#000',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Setting up...' : 'Initialize University Data'}
        </button>

        {error && (
          <div style={{ 
            marginTop: '20px', 
            padding: '15px', 
            backgroundColor: '#dc2626', 
            borderRadius: '8px',
            color: 'white'
          }}>
            {error}
          </div>
        )}

        {result && (
          <div style={{ 
            marginTop: '20px', 
            padding: '15px', 
            backgroundColor: '#166534', 
            borderRadius: '8px',
            color: 'white',
            textAlign: 'left'
          }}>
            <strong>Setup Complete!</strong>
            <p style={{ margin: '10px 0 5px' }}>
              {result.msg}
            </p>
            {result.university && (
              <p style={{ margin: '5px 0', fontSize: '14px' }}>
                <strong>University:</strong> {result.university.name}
              </p>
            )}
            {result.faculty && (
              <p style={{ margin: '5px 0', fontSize: '14px' }}>
                <strong>Faculty:</strong> {result.faculty.name}
              </p>
            )}
            {result.department && (
              <p style={{ margin: '5px 0', fontSize: '14px' }}>
                <strong>Department:</strong> {result.department.name}
              </p>
            )}
            {result.program && (
              <p style={{ margin: '5px 0', fontSize: '14px' }}>
                <strong>Program:</strong> {result.program.name}
              </p>
            )}
            {result.courses && (
              <p style={{ margin: '5px 0', fontSize: '14px' }}>
                <strong>Courses:</strong> {result.courses.length} created
              </p>
            )}
          </div>
        )}

        <p style={{ marginTop: '30px', color: '#666', fontSize: '12px' }}>
          (Requires admin login first)
        </p>
      </div>
    </div>
  );
}
