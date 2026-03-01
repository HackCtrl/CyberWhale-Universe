'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const pathname = usePathname();
  
  const navItems = [
    { label: 'Главная', path: '/' },
    { label: 'Обучение', path: '/courses' },
    { label: 'CTF', path: '/ctf' },
    { label: 'Рейтинг', path: '/ctf/leaderboard' },
    { label: 'Админ-панель', path: '/admin' }
  ];

  return (
    <aside className="w-64 bg-black border-r border-gray-800 hidden md:flex flex-col h-screen fixed inset-y-0 left-0 z-10 pt-16">
      <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
          
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-green-500/10 text-green-500'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
