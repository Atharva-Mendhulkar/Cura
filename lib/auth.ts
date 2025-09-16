// Authentication utilities and mock implementation

import type { User, UserRole } from "./types"

export interface AuthUser extends User {
  isAuthenticated: boolean
}

// Mock authentication - replace with real Supabase auth
export function getCurrentUser(): AuthUser | null {
  if (typeof window === "undefined") return null

  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"
  const userStr = localStorage.getItem("user")

  if (!isAuthenticated || !userStr) return null

  try {
    const user = JSON.parse(userStr)
    return { ...user, isAuthenticated: true }
  } catch {
    return null
  }
}

export function signOut(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("user")
    localStorage.removeItem("selectedCampus")
    localStorage.removeItem("privacyConsent")
    window.location.href = "/"
  }
}

export function requireAuth(): AuthUser {
  const user = getCurrentUser()
  if (!user) {
    if (typeof window !== "undefined") {
      window.location.href = "/auth/signin"
    }
    throw new Error("Authentication required")
  }
  return user
}

export function hasRole(user: AuthUser | null, role: UserRole): boolean {
  return user?.role === role
}

// Mock user data for demo
export const DEMO_USERS = {
  "student@example.com": {
    id: "student-123",
    email: "student@example.com",
    name: "Alex Student",
    role: "student" as UserRole,
    campus: "IIT Delhi",
    language: "en" as const,
    createdAt: new Date("2024-01-15"),
    lastActive: new Date(),
  },
  "counselor@example.com": {
    id: "counselor-456",
    email: "counselor@example.com",
    name: "Dr. Sarah Counselor",
    role: "counselor" as UserRole,
    campus: "IIT Delhi",
    language: "en" as const,
    createdAt: new Date("2023-08-01"),
    lastActive: new Date(),
  },
  "admin@example.com": {
    id: "admin-789",
    email: "admin@example.com",
    name: "Admin User",
    role: "admin" as UserRole,
    campus: "IIT Delhi",
    language: "en" as const,
    createdAt: new Date("2023-06-01"),
    lastActive: new Date(),
  },
}

// TODO: Replace with Supabase authentication
export async function signInWithEmail(email: string, password: string): Promise<AuthUser> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const demoUser = DEMO_USERS[email as keyof typeof DEMO_USERS]
  if (!demoUser || password !== "password123") {
    throw new Error("Invalid credentials")
  }

  return { ...demoUser, isAuthenticated: true }
}

export async function signUpWithEmail(userData: {
  name: string
  email: string
  password: string
  campus: string
}): Promise<void> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // In real implementation, create user in Supabase
  console.log("User registered:", userData)
}
