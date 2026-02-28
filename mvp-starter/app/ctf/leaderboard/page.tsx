"use client";

import React, { useEffect, useState } from 'react';

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [stats, setStats] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const base = 'http://localhost:4000';

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const l = await fetch(`${base}/api/ctf/leaderboard`).then(r=>r.json());
      const s = await fetch(`${base}/api/ctf/stats`).then(r=>r.json());
      setLeaders(l);
      setStats(s);
    } catch (e) {
      console.error(e);
    } finally { setLoading(false); }
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Таблица лидеров</h1>
      {loading && <div>Загрузка...</div>}
      {!loading && (
        <div className="grid grid-cols-2 gap-6">
          <section>
            <h2 className="font-semibold mb-2">Лидеры</h2>
            <ol className="list-decimal ml-6">
              {leaders.map((u, i) => (
                <li key={u.userId} className="mb-2">
                  <div className="font-medium">{u.name || u.email}</div>
                  <div className="text-sm text-slate-600">Очки: {u.score} — Решено: {u.solves}</div>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="font-semibold mb-2">Статистика</h2>
            <div className="text-sm text-slate-600 mb-2">Всего зачтено: {stats?.totalSolves ?? 0}</div>
            <ul>
              {stats?.challenges?.map((c: any) => (
                <li key={c.id} className="mb-2">
                  <div className="font-medium">{c.title}</div>
                  <div className="text-sm text-slate-600">Сложность: {c.difficulty} — Решено: {c.solves}</div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </main>
  );
}
