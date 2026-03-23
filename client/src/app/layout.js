import './globals.css';
import { AuthProvider } from './providers';

  const metadata = {
  title: 'CAUC Attendance System',
  description: 'University Attendance Management System',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
