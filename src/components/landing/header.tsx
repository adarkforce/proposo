'use client'

import Link from 'next/link'
import { useState } from 'react'
import { buttonVariants } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu, Zap } from 'lucide-react'
import { APP_NAME } from '@/config/constants'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/#features', label: 'Features' },
  { href: '/#how-it-works', label: 'How It Works' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/templates', label: 'Templates' },
] as const

export function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Zap className="h-6 w-6 text-primary" />
          {APP_NAME}
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className={cn(buttonVariants({ variant: 'ghost' }))}>
            Log in
          </Link>
          <Link href="/signup" className={cn(buttonVariants())}>
            Start Free
          </Link>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'icon' }),
              'md:hidden',
            )}
          >
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <nav className="flex flex-col gap-4 mt-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-lg font-medium"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t">
                <Link href="/login" className={cn(buttonVariants({ variant: 'outline' }))}>
                  Log in
                </Link>
                <Link href="/signup" className={cn(buttonVariants())}>
                  Start Free
                </Link>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
