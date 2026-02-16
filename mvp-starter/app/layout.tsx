import '../styles/globals.css'
import React from 'react'

export const metadata = {
  title: 'CyberWhale MVP',
  description: 'Minimal starter for CyberWhale MVP',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-slate-50 text-slate-900">{children}</body>
    </html>
  )
}
