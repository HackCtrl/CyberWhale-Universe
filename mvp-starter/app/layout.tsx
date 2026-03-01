import '../styles/globals.css';
import React from 'react';
import dynamic from 'next/dynamic';
import { Footer } from './components/layout/Footer';

const Header = dynamic(() => import('./components/layout/Header').then(mod => mod.Header), { ssr: false });
const Sidebar = dynamic(() => import('./components/layout/Sidebar').then(mod => mod.Sidebar), { ssr: false });
const AiWidget = dynamic(() => import('./components/AiWidget'), { ssr: false });

export const metadata = {
  title: 'CyberWhale MVP',
  description: 'Minimal starter for CyberWhale MVP',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-black text-white flex flex-col">
        <Header />
        <div className="flex flex-1 pt-16">
          <Sidebar />
          
          <main className="flex-1 md:ml-64 bg-gray-950 min-[calc(100vh-64px)]">
            {children}
          </main>
        </div>
        <div className="md:ml-64">
          <Footer />
        </div>
        <AiWidget />
      </body>
    </html>
  );
}