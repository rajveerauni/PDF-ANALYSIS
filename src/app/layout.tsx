import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PDF Analyzer — AI-powered document analysis',
  description: 'Upload PDFs, DOCX, or TXT files and get instant AI-powered business insights.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-base text-text font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
