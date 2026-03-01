import React, { useEffect, useState } from 'react';

type Task = {
  title: string;
  stage: number;
  progress: number;
  weeklyTargets?: Record<string, number>;
  notes?: string;
};

export default function GanttPage() {
  const [data, setData] = useState<any>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [newProgress, setNewProgress] = useState<number>(0);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    fetch('http://localhost:4000/api/gantt')
      .then(r => r.json())
      .then(setData)
      .catch(() => setMessage('Cannot load gantt'));
  }, []);

  if (!data) return <div style={{ padding: 20 }}>Loading gantt...</div>;

  const tasks: Record<string, Task> = data.tasks || {};

  function saveProgress() {
    if (!selected) return setMessage('Select task');
    const updated = { ...data };
    updated.tasks = { ...updated.tasks, [selected]: { ...updated.tasks[selected], progress: newProgress } };
    fetch('http://localhost:4000/api/gantt', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated) })
      .then(r => r.json())
      .then((res) => {
        if (res.ok) {
          setMessage('Saved.');
          setData(updated);
        } else setMessage('Save failed');
      })
      .catch(() => setMessage('Save error'));
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>Gantt — диаграмма</h1>
      <p>{message}</p>
      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ width: 520 }}>
          <h2>Задачи</h2>
          <ul>
            {Object.entries(tasks).map(([id, t]) => (
              <li key={id} style={{ marginBottom: 8 }}>
                <b>{id}</b>: {t.title} — stage {t.stage} — progress: {t.progress}%
                <br />
                <small>{t.notes}</small>
                <div>
                  <button onClick={() => { setSelected(id); setNewProgress(t.progress || 0); setMessage(''); }}>Выбрать</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ flex: 1 }}>
          <h2>Редактирование</h2>
          {selected ? (
            <div>
              <p>Выбрана задача: <b>{selected}</b> — {tasks[selected].title}</p>
              <label>Новый прогресс: </label>
              <input type="number" value={newProgress} onChange={e => setNewProgress(Number(e.target.value))} />
              <div style={{ marginTop: 8 }}>
                <button onClick={saveProgress}>Сохранить прогресс</button>
              </div>
            </div>
          ) : (
            <p>Выберите задачу слева.</p>
          )}
        </div>
      </div>
    </main>
  );
}
