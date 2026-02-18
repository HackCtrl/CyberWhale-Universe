"use client"
import React from "react"

export default function TodayPage() {
  return (
    <main style={{padding: '2rem', fontFamily: 'Inter, system-ui, sans-serif'}}>
      <h1>Чем займёмся сегодня?</h1>
      <p>Выбор следующей задачи основан на Gantt-плане и приоритетах.</p>

      <section style={{marginTop: '1.5rem'}}>
        <div style={{border: '1px solid #e5e7eb', padding: '1rem', borderRadius: 8}}>
          <h2>Предложенная задача</h2>
          <p><strong>ID:</strong> 1.3.1</p>
          <p><strong>Название:</strong> Создание репозитория GitHub с базовой структурой</p>
          <p><strong>Статус:</strong> 12% — подготовлена документация и CI</p>
          <div style={{marginTop: '0.5rem'}}>
            <button style={{background: '#2563eb', color: '#fff', padding: '0.5rem 1rem', borderRadius: 6, border: 'none'}}>Начать</button>
            <button style={{marginLeft: 8}}>Отложить</button>
          </div>
        </div>
      </section>

      <section style={{marginTop: '1.5rem'}}>
        <h3>Быстрые ссылки</h3>
        <ul>
          <li><a href="/docs/PROGRESS_UPDATE.md">Инструкция по обновлению прогресса</a></li>
          <li><a href="/docs/DB_SCHEMA.md">Документ схемы БД</a></li>
        </ul>
      </section>
    </main>
  )
}
