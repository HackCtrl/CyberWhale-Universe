'use client';

import React, { useEffect, useState } from 'react';

type CTF = { id: number; title: string; description?: string };

export default function CtfPage() {
  const [ctfs, setCtfs] = useState<CTF[]>([]);
  const [flags, setFlags] = useState<Record<number, string>>({});
  const [msg, setMsg] = useState('');

  const base = 'http://localhost:4000';

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const res = await fetch(`${base}/api/ctf`);
    const data = await res.json();
    setCtfs(data);
  }

  async function submit(id: number) {
    setMsg('Отправка...');
    const token = localStorage.getItem('token');
    const res = await fetch(`${base}/api/ctf/${id}/submit`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify({ flag: flags[id] || '' }),
    });
    const d = await res.json();
    if (!res.ok) return setMsg('Ошибка сервера');
    if (d.ok) {
      setMsg('Флаг верный — зачтено.');
      await load();
      return;
    }
    if (d.alreadySolved) return setMsg('Вы уже решили эту задачу.');
    setMsg('Флаг неверный.');
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">CTF: Задачи</h1>
      <p className="mb-4 text-sm text-slate-600">Список задач и форма отправки флагов.</p>

      <ul className="space-y-4">
        {ctfs.map((c) => (
          <li key={c.id} className="p-4 border rounded bg-white">
            <div className="flex justify-between">
              <div>
                <div className="font-semibold">{c.title}</div>
                <div className="text-sm text-slate-600">{c.description}</div>
              </div>
              <div style={{ width: 240 }}>
                <input
                  placeholder="flag{...}"
                  value={flags[c.id] || ''}
                  onChange={(e) => setFlags({ ...flags, [c.id]: e.target.value })}
                  className="w-full border p-2 mb-2"
                />
                <button onClick={() => submit(c.id)} className="px-3 py-1 bg-green-600 text-white">
                  Submit Flag
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-4 text-sm text-slate-700">{msg}</div>
    </main>
  );
}
