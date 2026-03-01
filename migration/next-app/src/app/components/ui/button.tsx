import React from 'react'

type Props = React.ComponentProps<'button'> & {
  variant?: 'default' | 'secondary' | 'destructive'
  size?: 'sm' | 'default' | 'lg' | 'icon'
  asChild?: boolean
  isLoading?: boolean
}

export function Button({ children, isLoading, size = 'default', className = '', ...props }: Props) {
  const sizeClass = size === 'lg' ? 'h-10' : size === 'sm' ? 'h-8' : 'h-9'
  return (
    <button className={`cw-btn inline-flex items-center ${sizeClass} ${className}`} {...props}>
      {isLoading ? <span className="cw-spinner" data-testid="cw-spinner" /> : null}
      {children}
    </button>
  )
}

export default Button
