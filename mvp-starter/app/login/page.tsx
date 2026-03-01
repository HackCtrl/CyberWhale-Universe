'use client';
import React, { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg('...');
    try {
      const res = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) setMsg(data.error || 'Ошибка');
      else {
        if (data.token) {
          localStorage.setItem('token', data.token);
          setMsg('Успешно, перенаправление...');
          setTimeout(() => (window.location.href = '/'), 600);
        } else {
          setMsg('Вход выполнен');
        }
      }
    } catch (err) {
      setMsg('Сервер недоступен');
    }
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Вход</h1>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2"
          />
        </div>
        <div>
          <label className="block text-sm">Пароль</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2"
          />
        </div>
        <button className="px-4 py-2 bg-green-600 text-white">Войти</button>
      </form>
      <p className="mt-4">{msg}</p>
    </main>
  );
}
