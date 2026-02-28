"use client";

import React, { useState, useEffect } from 'react';

type CTF = { id: number; title: string; description?: string; difficulty?: number };

export default function AdminPage() {
  const [email, setEmail] = useState('admin@cyberwhale.test');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [tab, setTab] = useState<'ctf' | 'courses'>('ctf');
  const [ctfList, setCtfList] = useState<CTF[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newFlag, setNewFlag] = useState('');
  const [newDiff, setNewDiff] = useState(1);

  const base = 'http://localhost:4000';

  async function login(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const res = await fetch(`${base}/api/auth/login`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, password }) });
    if (!res.ok) return alert('Login failed: ' + (await res.text()));
    const data = await res.json();
    setToken(data.token);
    localStorage.setItem('admin_token', data.token);
  }

  async function registerAdmin() {
    if (!email || !password) return alert('Enter email and password to create admin');
    const res = await fetch(`${base}/api/auth/register`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, password, name: 'Administrator' }) });
    if (!res.ok) return alert('Register failed: ' + (await res.text()));
    // auto-login after register
    await login();
  }

  useEffect(() => {
    const t = localStorage.getItem('admin_token');
    if (t) setToken(t);
  }, []);

  useEffect(() => { if (token) loadCtf(); }, [token]);

  async function loadCtf() {
    const res = await fetch(`${base}/api/ctf`);
    const data = await res.json();
    setCtfList(data);
  }

  async function createCtf(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return alert('Login as admin first');
    const res = await fetch(`${base}/api/ctf`, { method: 'POST', headers: { 'content-type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ title: newTitle, description: newDesc, flag: newFlag, difficulty: newDiff }) });
    if (!res.ok) return alert('Create failed: ' + (await res.text()));
    setNewTitle(''); setNewDesc(''); setNewFlag(''); setNewDiff(1);
    await loadCtf();
  }

  async function deleteCtf(id: number) {
    if (!token) return alert('Login as admin first');
    if (!confirm('Delete challenge #' + id + '?')) return;
    const res = await fetch(`${base}/api/ctf/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) return alert('Delete failed: ' + (await res.text()));
    await loadCtf();
  }

  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h1>Admin Panel — Content Management</h1>
          {!token ? (
        <form onSubmit={login} style={{ maxWidth: 480 }}>
          <div style={{ marginBottom: 8 }}>
            <label>Email</label><br />
            <input value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%' }} />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label>Password</label><br />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%' }} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit">Login</button>
            <button type="button" onClick={() => registerAdmin()}>Create admin</button>
          </div>
          <div style={{ marginTop: 8, color: '#666' }}>Default admin email: admin@cyberwhale.test</div>
        </form>
      ) : (
        <div>
          <div style={{ marginBottom: 12 }}>
            <button onClick={() => { setToken(null); localStorage.removeItem('admin_token'); }}>Logout</button>
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <button onClick={() => setTab('ctf')} disabled={tab === 'ctf'}>CTF Challenges</button>
            <button onClick={() => setTab('courses')} disabled={tab === 'courses'}>Courses (open in Courses page)</button>
          </div>

          {tab === 'ctf' && (
            <div>
              <h2>Create CTF Challenge</h2>
              <form onSubmit={createCtf} style={{ maxWidth: 640 }}>
                <input placeholder="Title" value={newTitle} onChange={e => setNewTitle(e.target.value)} required style={{ width: '100%', marginBottom:8 }} />
                <input placeholder="Short description" value={newDesc} onChange={e => setNewDesc(e.target.value)} style={{ width: '100%', marginBottom:8 }} />
                <input placeholder="Flag (for dev)" value={newFlag} onChange={e => setNewFlag(e.target.value)} required style={{ width: '100%', marginBottom:8 }} />
                <label>Difficulty</label><br />
                <input type="number" value={newDiff} onChange={e => setNewDiff(Number(e.target.value))} min={1} max={10} style={{ width: 120, marginBottom:8 }} />
                <div><button type="submit">Create</button></div>
              </form>

              <h2 style={{ marginTop: 20 }}>Challenges</h2>
              <ul>
                {ctfList.map(c => (
                  <li key={c.id} style={{ marginBottom: 8 }}>
                    <strong>{c.title}</strong> (#{c.id}) — diff: {c.difficulty}
                    <div style={{ marginTop: 6 }}>
                      <button onClick={() => navigator.clipboard?.writeText(`${base}/api/ctf/${c.id}`)}>Copy API link</button>{' '}
                      <button onClick={() => deleteCtf(c.id)}>Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {tab === 'courses' && (
            <div>
              <p>Courses are managed on the public Courses admin page. Open <a href="/courses">Courses</a>.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
