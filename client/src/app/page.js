'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './providers';
import Link from 'next/link';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else {
        router.push(`/dashboard/${user.role}`);
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen p-5 bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-white text-center text-3xl">Loading...</h1>
      </div>
    </div>
  );
}
