import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Card, CardTitle, CardDescription } from '../src/app/components/ui/card'

describe('Card component', () => {
  it('renders title and description', () => {
    render(
      <Card>
        <CardTitle>Title</CardTitle>
        <CardDescription>Desc</CardDescription>
      </Card>
    )
    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Desc')).toBeInTheDocument()
  })

  it('has base card class', () => {
    const { container } = render(<Card>Content</Card>)
    const el = container.querySelector('[data-slot="card"]')
    expect(el).toHaveClass('cw-card')
  })
})
