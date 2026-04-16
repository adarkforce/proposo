import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Eye, CheckCircle, Clock } from 'lucide-react'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { count: totalProposals } = await supabase
    .from('proposals')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const { count: sentProposals } = await supabase
    .from('proposals')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('status', 'sent')

  const { count: acceptedProposals } = await supabase
    .from('proposals')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('status', 'accepted')

  const { count: viewedProposals } = await supabase
    .from('proposals')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('status', 'viewed')

  const stats = [
    { label: 'Total Proposals', value: totalProposals ?? 0, icon: FileText, color: 'text-blue-600' },
    { label: 'Sent', value: sentProposals ?? 0, icon: Clock, color: 'text-yellow-600' },
    { label: 'Viewed', value: viewedProposals ?? 0, icon: Eye, color: 'text-purple-600' },
    { label: 'Accepted', value: acceptedProposals ?? 0, icon: CheckCircle, color: 'text-green-600' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back{profile?.full_name ? `, ${profile.full_name}` : ''}
          </h1>
          <p className="text-muted-foreground mt-1">
            {profile?.credits_remaining ?? 0} proposal credits remaining this month
          </p>
        </div>
        <Link
          href="/dashboard/proposals/new"
          className={cn(buttonVariants({ size: 'lg' }))}
        >
          New Proposal
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className={cn('h-5 w-5', stat.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(totalProposals ?? 0) === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No proposals yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first AI-powered proposal in under 60 seconds.
            </p>
            <Link
              href="/dashboard/proposals/new"
              className={cn(buttonVariants())}
            >
              Create Your First Proposal
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
