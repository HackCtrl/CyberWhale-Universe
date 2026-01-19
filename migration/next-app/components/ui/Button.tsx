'use client'

import React from 'react'
import clsx from 'clsx'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'secondary' | 'ghost' | 'destructive' | 'link'
  size?: 'sm' | 'default' | 'lg' | 'icon'
  isLoading?: boolean
}

export function Button({ variant = 'default', size = 'default', isLoading = false, className, children, ...props }: Props) {
  const base = 'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium cw-btn'
  const variants: Record<string,string> = {
    default: 'bg-primary text-black hover:bg-primary/90',
    secondary: 'bg-secondary text-white hover:bg-secondary/90',
    ghost: 'bg-transparent hover:bg-accent/10',
    destructive: 'bg-red-500 text-white',
    link: 'text-primary underline'
  }
  const sizes: Record<string,string> = {
    default: 'h-9 px-4',
    sm: 'h-8 px-3 text-sm',
    lg: 'h-10 px-6',
    icon: 'h-9 w-9 p-0'
  }

  return (
    <button {...props} className={clsx(base, variants[variant], sizes[size], className)} aria-busy={isLoading} disabled={isLoading || props.disabled}>
      {isLoading ? <span className="cw-spinner" aria-hidden /> : null}
      {children}
    </button>
  )
}
