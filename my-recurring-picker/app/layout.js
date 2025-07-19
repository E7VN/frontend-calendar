// 🗂️ File: app/layout.js

import './globals.css';
import { Inter } from 'next/font/google';
import { RecurrenceProvider } from '../contexts/RecurrenceContext'; // ✅ IMPORT YOUR CONTEXT

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Recurring Date Picker',
  description: 'Built for internship assignment',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* ✅ WRAP APP WITH YOUR CONTEXT PROVIDER */}
        <RecurrenceProvider>
          {children}
        </RecurrenceProvider>
      </body>
    </html>
  );
}
