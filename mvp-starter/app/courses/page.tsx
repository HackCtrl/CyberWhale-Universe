"use client";

import React, { useEffect, useState } from 'react';

type Course = { id: number; title: string; description?: string; lessons?: Lesson[] };
type Lesson = { id: number; title: string; content?: string; courseId?: number };

export default function CoursesPage() {
  const [token, setToken] = useState<string>('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonContent, setLessonContent] = useState('');
  const base = 'http://localhost:4000';

  async function loadCourses() {
    const res = await fetch(`${base}/api/courses`);
    const data = await res.json();
    setCourses(data);
  }

  useEffect(() => { loadCourses(); }, []);

  async function createCourse(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`${base}/api/courses`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', Authorization: token ? `Bearer ${token}` : '' },
      body: JSON.stringify({ title, description })
    });
    if (res.ok) {
      setTitle(''); setDescription(''); await loadCourses();
    } else {
      alert('Create failed: ' + (await res.text()));
    }
  }

  async function selectCourse(id: number) {
    const res = await fetch(`${base}/api/courses/${id}`);
    const data = await res.json();
    setSelectedCourse(data);
  }

  async function createLesson(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedCourse) return;
    const res = await fetch(`${base}/api/courses/${selectedCourse.id}/lessons`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', Authorization: token ? `Bearer ${token}` : '' },
      body: JSON.stringify({ title: lessonTitle, content: lessonContent })
    });
    if (res.ok) {
      setLessonTitle(''); setLessonContent(''); await selectCourse(selectedCourse.id);
    } else {
      alert('Create lesson failed: ' + (await res.text()));
    }
  }

  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h1>Courses (CRUD demo)</h1>

      <div style={{ marginBottom: 12 }}>
        <label>JWT Token (for auth actions):</label><br />
        <input style={{ width: '80%' }} value={token} onChange={e => setToken(e.target.value)} placeholder="Paste token from /api/auth/login" />
      </div>

      <section style={{ display: 'flex', gap: 24 }}>
        <div style={{ flex: 1 }}>
          <h2>Create Course</h2>
          <form onSubmit={createCourse}>
            <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required style={{ width: '100%', marginBottom:8 }} />
            <input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} style={{ width: '100%', marginBottom:8 }} />
            <button type="submit">Create</button>
          </form>

          <h2 style={{ marginTop: 16 }}>Courses</h2>
          <ul>
            {courses.map(c => (
              <li key={c.id} style={{ marginBottom: 8 }}>
                <strong>{c.title}</strong> — {c.description}
                <div>
                  <button onClick={() => selectCourse(c.id)}>Open</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ flex: 1 }}>
          <h2>Selected Course</h2>
          {selectedCourse ? (
            <div>
              <h3>{selectedCourse.title}</h3>
              <p>{selectedCourse.description}</p>

              <h4>Lessons</h4>
              <ul>
                {selectedCourse.lessons?.map(l => (
                  <li key={l.id}><strong>{l.title}</strong> — {l.content}</li>
                ))}
              </ul>

              <h4>Add Lesson</h4>
              <form onSubmit={createLesson}>
                <input placeholder="Lesson title" value={lessonTitle} onChange={e => setLessonTitle(e.target.value)} required style={{ width: '100%', marginBottom:8 }} />
                <textarea placeholder="Content" value={lessonContent} onChange={e => setLessonContent(e.target.value)} style={{ width: '100%', marginBottom:8 }} />
                <button type="submit">Add lesson</button>
              </form>
            </div>
          ) : (
            <div>Select a course to view details</div>
          )}
        </div>
      </section>
    </div>
  );
}
