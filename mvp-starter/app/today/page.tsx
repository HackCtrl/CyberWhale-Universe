import React from 'react'

export default function TodayPage() {
  const sampleTasks = [
    { id: 1, title: 'Review PRs', done: false },
    { id: 2, title: 'Finish minor bugs', done: false },
    { id: 3, title: 'Plan next task (Gantt)', done: false }
  ]

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Сегодня</h1>
      <p className="mb-4 text-sm text-slate-600">Краткий набор задач на сегодня — каркас страницы для интеграции с таск‑менеджером.</p>

      <ul className="space-y-3">
        {sampleTasks.map(t => (
          <li key={t.id} className="p-3 border rounded bg-white flex justify-between items-center">
            <div>
              <div className="font-medium">{t.title}</div>
              <div className="text-xs text-slate-500">Задача #{t.id}</div>
            </div>
            <div>
              <button className="px-3 py-1 bg-blue-600 text-white rounded">Mark</button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <a href="/" className="text-sm text-blue-600">Вернуться на главную</a>
      </div>
    </main>
  )
}
