'use client';

import { AuthProvider } from './providers';

export default function Providers({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
