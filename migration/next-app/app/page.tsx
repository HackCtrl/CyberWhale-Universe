import Link from 'next/link'
import { Button } from '../../components/ui/Button'

export default function Page() {
  return (
    <main className="container mx-auto p-6">
      <h1 className="text-4xl mb-4">CyberWhale — Migration Demo</h1>
      <p className="mb-6">Базовая страница для проверки дизайн-токенов и компонентов.</p>
      <div className="flex gap-4">
        <Button variant="default">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
    </main>
  )
}
