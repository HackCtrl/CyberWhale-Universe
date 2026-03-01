import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Button } from '../src/app/components/ui/button'

describe('Button component', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('shows spinner when loading', () => {
    render(<Button isLoading>Loading</Button>)
    // spinner has class cw-spinner
    const spinner = document.querySelector('.cw-spinner')
    expect(spinner).toBeTruthy()
  })

  it('applies size variant classes', () => {
    const { container } = render(<Button size="lg">Large</Button>)
    const btn = container.querySelector('button')
    expect(btn).toHaveClass('h-10')
  })
})
