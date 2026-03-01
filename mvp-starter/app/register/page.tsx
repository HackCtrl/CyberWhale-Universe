'use client';
import React, { useState } from 'react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg('...');
    try {
      const res = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if (!res.ok) setMsg(data.error || 'Ошибка');
      else {
        setMsg('Успешно, перенаправление...');
        // attempt auto-login after register
        if (email && password) {
          setTimeout(async () => {
            try {
              const r = await fetch('http://localhost:4000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
              });
              const d = await r.json();
              if (r.ok && d.token) {
                localStorage.setItem('token', d.token);
                window.location.href = '/';
              }
            } catch (e) {}
          }, 400);
        }
      }
    } catch (err) {
      setMsg('Сервер недоступен');
    }
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Регистрация</h1>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm">Имя</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2"
          />
        </div>
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
        <button className="px-4 py-2 bg-blue-600 text-white">Зарегистрироваться</button>
      </form>
      <p className="mt-4">{msg}</p>
    </main>
  );
}
