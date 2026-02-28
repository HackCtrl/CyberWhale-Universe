"use client";

import React, { useEffect, useState } from 'react';

export default function Header() {
  const [user, setUser] = useState<{ id: number; email: string; name?: string } | null>(null);

  useEffect(() => {
    const t = localStorage.getItem('token');
    if (!t) return;
    fetch('http://localhost:4000/api/auth/me', { headers: { Authorization: `Bearer ${t}` } })
      .then(r => r.ok ? r.json() : Promise.reject(r))
      .then(data => setUser(data.user || data))
      .catch(() => setUser(null));
  }, []);

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('admin_token');
    setUser(null);
    // reload to update UI in app
    window.location.reload();
  }

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderBottom: '1px solid #eee', background: '#fff' }}>
      <div>
        <a href="/" style={{ fontWeight: 700, textDecoration: 'none', color: '#111' }}>CyberWhale</a>
      </div>
      <nav>
        {!user ? (
          <div style={{ display: 'flex', gap: 8 }}>
            <a href="/login">Войти</a>
            <a href="/register">Регистрация</a>
            <a href="/admin">Admin</a>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{user.name || user.email}</div>
              <div style={{ fontSize: 12, color: '#666' }}>{user.email}</div>
            </div>
            <button onClick={logout} style={{ padding: '6px 10px' }}>Logout</button>
          </div>
        )}
      </nav>
    </header>
  );
}
