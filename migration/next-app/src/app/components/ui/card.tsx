import React from 'react'

export function Card({ children, className = '', ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot="card" className={`cw-card ${className}`} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ children, ...props }: React.ComponentProps<'div'>) {
  return <h4 data-slot="card-title" {...props}>{children}</h4>
}

export function CardDescription({ children, ...props }: React.ComponentProps<'p'>) {
  return <p data-slot="card-description" {...props}>{children}</p>
}

export default Card
