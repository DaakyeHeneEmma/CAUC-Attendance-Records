import './globals.css';
import Providers from './providers-wrapper';

export const metadata = {
  title: 'CAUC Attendance System',
  description: 'University Attendance Management System',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
