'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [fullName, setFullName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [brandColor, setBrandColor] = useState('#2563eb')

  useEffect(() => {
    async function loadProfile() {
      setLoading(true)
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('profiles')
        .select('full_name, company_name, brand_color')
        .eq('id', user.id)
        .single()

      if (data) {
        setFullName(data.full_name ?? '')
        setCompanyName(data.company_name ?? '')
        setBrandColor(data.brand_color ?? '#2563eb')
      }
      setLoading(false)
    }
    loadProfile()
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        company_name: companyName,
        brand_color: brandColor,
      })
      .eq('id', user.id)

    if (error) {
      toast.error('Failed to save settings')
    } else {
      toast.success('Settings saved')
    }

    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Customize your profile and branding</p>
      </div>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Profile & Branding</CardTitle>
          <CardDescription>
            These details appear on your proposals and client portal.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Acme Services"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brandColor">Brand Color</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  id="brandColor"
                  value={brandColor}
                  onChange={(e) => setBrandColor(e.target.value)}
                  className="h-10 w-10 rounded cursor-pointer"
                />
                <Input
                  value={brandColor}
                  onChange={(e) => setBrandColor(e.target.value)}
                  placeholder="#2563eb"
                  className="w-32"
                />
              </div>
            </div>

            <Button type="submit" disabled={saving}>
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Settings
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
