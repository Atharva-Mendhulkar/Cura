"use client"

import { ReactNode } from "react"
import { AuthGuard } from "@/components/ui/auth-guard"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StreakCounter } from "@/components/wellness/streak-counter"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface WellnessLayoutProps {
  children: ReactNode
}

export default function Layout({ children }: WellnessLayoutProps) {
  const pathname = usePathname()

  const wellnessTabs = [
    { value: "exercises", label: "Exercises", path: "/wellness" },
    { value: "breathing", label: "Breathing", path: "/wellness/breathing" },
    { value: "meditation", label: "Meditation", path: "/wellness/meditation" }
  ]

  // Get the current tab based on the pathname
  const getCurrentTab = () => {
    const tab = wellnessTabs.find(tab => tab.path === pathname)
    return tab?.value || "exercises"
  }

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="container mx-auto px-4 py-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Wellness Center</h1>
              <p className="text-muted-foreground mt-1">
                Take care of your mental and physical well-being
              </p>
            </div>
            <StreakCounter streakDays={7} />
          </div>

          <div className="sticky top-16 z-20 -mx-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="border-b">
              <div className="container px-4">
                <Tabs defaultValue={getCurrentTab()} className="relative">
                  <TabsList className="w-full justify-center gap-4 border-b-0 h-12">
                    {wellnessTabs.map((tab) => (
                      <Link key={tab.value} href={tab.path}>
                        <TabsTrigger 
                          value={tab.value}
                          className="px-8 py-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                          {tab.label}
                        </TabsTrigger>
                      </Link>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </div>
          {children}
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
