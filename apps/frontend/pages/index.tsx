import React from 'react';

export default function Home() {
  return (
    <main style={{ fontFamily: 'Inter, sans-serif', padding: 24 }}>
      <h1>CyberWhale Universe — MVP (frontend)</h1>
      <p>Минимальная страница для проверки интеграции с backend.</p>
      <p>
        API health: <a href="/api/hello">/api/hello</a>
      </p>
    </main>
  );
}
