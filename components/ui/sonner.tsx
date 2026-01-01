'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner, ToasterProps } from 'sonner'

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: 'group toast bg-card text-card-foreground border-border shadow-lg',
          title: 'text-foreground font-semibold',
          description: 'text-muted-foreground',
          actionButton: 'bg-primary text-primary-foreground',
          cancelButton: 'bg-muted text-muted-foreground',
          closeButton: 'bg-background text-foreground border-border hover:bg-muted',
          success: 'bg-card border-primary/30 [&_svg]:text-primary',
          error: 'bg-card border-destructive/30 [&_svg]:text-destructive',
          info: 'bg-card border-muted-foreground/30 [&_svg]:text-muted-foreground',
          warning: 'bg-card border-chart-4/30 [&_svg]:text-chart-4',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
