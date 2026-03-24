'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../providers';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) return (
    <div className="min-h-screen p-5 bg-gradient-to-br from-indigo-500 to-purple-600">
      <p className="text-white text-center">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen p-5 bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8 bg-white p-5 rounded-xl shadow-lg">
          <h1 className="text-xl font-bold text-gray-800 m-0">
            CAUC Attendance - {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard
          </h1>
          <nav className="flex gap-4">
            <Link href={`/dashboard/${user.role}`} className="px-5 py-2.5 bg-indigo-500 text-white no-underline rounded-lg transition-colors hover:bg-purple-600">Home</Link>
            <Link href="/attendance" className="px-5 py-2.5 bg-indigo-500 text-white no-underline rounded-lg transition-colors hover:bg-purple-600">Attendance</Link>
            <Link href="/classes" className="px-5 py-2.5 bg-indigo-500 text-white no-underline rounded-lg transition-colors hover:bg-purple-600">Classes</Link>
            <Link href="/reports" className="px-5 py-2.5 bg-indigo-500 text-white no-underline rounded-lg transition-colors hover:bg-purple-600">Reports</Link>
            {user?.role === 'admin' && (
              <>
                <Link href="/register" className="px-5 py-2.5 bg-indigo-500 text-white no-underline rounded-lg transition-colors hover:bg-purple-600">Register User</Link>
                <Link href="/setup" className="px-5 py-2.5 bg-indigo-500 text-white no-underline rounded-lg transition-colors hover:bg-purple-600">Setup</Link>
              </>
            )}
            <button onClick={logout} className="px-5 py-2.5 bg-red-500 text-white border-none rounded-lg cursor-pointer text-sm transition-opacity hover:opacity-80">Logout</button>
          </nav>
        </header>
        {children}
      </div>
    </div>
  );
}
