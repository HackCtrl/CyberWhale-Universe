'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export function Header() {
  const [user, setUser] = useState<{ id: number; email: string; name?: string } | null>(null);

  useEffect(() => {
    const t = localStorage.getItem('token');
    if (!t) return;
    fetch('http://localhost:4000/api/auth/me', { headers: { Authorization: `Bearer ${t}` } })
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((data) => setUser(data.user || data))
      .catch(() => setUser(null));
  }, []);

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('admin_token');
    setUser(null);
    window.location.reload();
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-black/90 backdrop-blur-md border-b border-gray-800 z-50 flex items-center px-6">
      <div className="flex-1 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight text-white">
          Cyber<span className="text-green-500">Whale</span>
        </Link>
        
        <nav className="flex items-center gap-4">
          {!user ? (
            <>
              <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                Войти
              </Link>
              <Link href="/register" className="text-sm font-medium bg-green-500 text-black px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                Регистрация
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-white">{user.name || user.email}</div>
              </div>
              <button 
                onClick={logout}
                className="text-sm font-medium bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Выйти
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
