"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { getCurrentUser, type AuthUser } from "@/lib/auth"
import type { UserRole } from "@/lib/types"

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: UserRole
  fallback?: React.ReactNode
}

export function AuthGuard({ children, requiredRole, fallback }: AuthGuardProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
    setLoading(false)

    if (!currentUser) {
      window.location.href = "/auth/signin"
      return
    }

    if (requiredRole && currentUser.role !== requiredRole) {
      window.location.href = "/dashboard"
      return
    }
  }, [requiredRole])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return fallback || null
  }

  if (requiredRole && user.role !== requiredRole) {
    return fallback || null
  }

  return <>{children}</>
}
