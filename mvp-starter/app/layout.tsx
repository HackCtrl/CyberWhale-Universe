import '../styles/globals.css';
import React from 'react';
import dynamic from 'next/dynamic';

const Header = dynamic(() => import('./components/Header'), { ssr: false });
const AiWidget = dynamic(() => import('./components/AiWidget'), { ssr: false });

export const metadata = {
  title: 'CyberWhale MVP',
  description: 'Minimal starter for CyberWhale MVP',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <Header />
        <main>{children}</main>
        <AiWidget />
      </body>
    </html>
  );
}
