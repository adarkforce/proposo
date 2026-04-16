'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Zap,
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  CreditCard,
  LogOut,
  Plus,
} from 'lucide-react'
import { APP_NAME } from '@/config/constants'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/proposals', label: 'Proposals', icon: FileText },
  { href: '/dashboard/clients', label: 'Clients', icon: Users },
  { href: '/dashboard/billing', label: 'Billing', icon: CreditCard },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
] as const

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <aside className="flex h-full w-64 flex-col border-r bg-muted/30">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 px-6 border-b">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
          <Zap className="h-5 w-5 text-primary" />
          {APP_NAME}
        </Link>
      </div>

      {/* New proposal button */}
      <div className="px-4 py-4">
        <Link href="/dashboard/proposals/new">
          <Button className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            New Proposal
          </Button>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t">
        <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </div>
    </aside>
  )
}
