'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../providers';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

export default function DashboardLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) return <div className="container"><p>Loading...</p></div>;

  return (
    <div className="container">
      <div className="main">
        <header className="header">
          <h1>CAUC Attendance - {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard</h1>
          <nav className="nav">
            <Link href={`/dashboard/${user.role}`} className="navLink">Home</Link>
            <Link href="/attendance" className="navLink">Attendance</Link>
            <Link href="/classes" className="navLink">Classes</Link>
            <Link href="/reports" className="navLink">Reports</Link>
            <button onClick={logout} className="btn btnDanger">Logout</button>
          </nav>
        </header>
        {children}
      </div>
    </div>
  );
}
