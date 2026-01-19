import './globals.css'
import { PropsWithChildren } from 'react'

export const metadata = {
  title: 'CyberWhale — Migration Demo',
  description: 'Design migration preview for CyberWhale'
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="ru">
      <body className="bg-background text-foreground min-h-screen">
        {children}
      </body>
    </html>
  )
}
