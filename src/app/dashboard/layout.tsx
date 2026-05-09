'use client'
import UserAppShell from '@/components/dashboard/UserAppShell'

export const dynamic = 'force-dynamic'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <UserAppShell>{children}</UserAppShell>
}
