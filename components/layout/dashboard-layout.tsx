"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { LanguageToggle } from "@/components/ui/language-toggle"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Heart, LayoutDashboard, MessageCircle, Briefcase, User, LogOut, Menu, Shield, Settings } from "lucide-react"
import { getCurrentUser, signOut } from "@/lib/auth"
import { t, getCurrentLanguage } from "@/lib/i18n"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [user, setUser] = useState(getCurrentUser())
  const [language, setCurrentLanguage] = useState(getCurrentLanguage())
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setCurrentLanguage(getCurrentLanguage())
    setUser(getCurrentUser())
  }, [])

  const navigationItems = [
    {
      href: "/dashboard",
      icon: LayoutDashboard,
      label: t("dashboard", language),
      roles: ["student", "counselor", "admin"],
    },
    {
      href: "/wellness",
      icon: Heart,
      label: language === "en" ? "Wellness Center" : "कल्याण केंद्र",
      roles: ["student"],
    },
    {
      href: "/career-corner",
      icon: Briefcase,
      label: language === "en" ? "Career Corner" : "करियर कॉर्नर",
      roles: ["student"],
    },
    {
      href: "/academic-corner",
      icon: Briefcase,
      label: language === "en" ? "Academic Corner" : "शैक्षणिक कॉर्नर",
      roles: ["student"],
    },
    {
      href: "/chatbot",
      icon: MessageCircle,
      label: language === "en" ? "Chatbot" : "चैटबॉट",
      roles: ["student"],
    },
    ...(user?.role === "admin"
      ? [
          {
            href: "/admin/wellness-center",
            icon: Heart,
            label: "Wellness Center",
            roles: ["admin"],
          },
          {
            href: "/admin",
            icon: Shield,
            label: "Admin Dashboard",
            roles: ["admin"],
          },
        ]
      : []),
    {
      href: "/settings",
      icon: Settings,
      label: language === "en" ? "Setting" : "सेटिंग",
      roles: ["student", "counselor", "admin"],
    },
  ]

  const visibleNavItems = navigationItems.filter((item) => item.roles.includes(user?.role || "student"))

  const handleSignOut = () => {
    signOut()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg hidden sm:inline-block">
              {language === "en" ? "Cura" : "छात्र सहायता केंद्र"}
            </span>
            <span className="font-bold text-lg sm:hidden">SSH</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {visibleNavItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            <LanguageToggle />

            {/* Desktop User Menu */}
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 h-auto p-2">
                    <Avatar className="h-8 w-8 ring-2 ring-primary">
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                        {user?.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium hidden lg:inline-block">{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <Link href="/profile">
                    <DropdownMenuItem className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {language === "en" ? "My Profile" : "मेरी प्रोफ़ाइल"}
                    </DropdownMenuItem>
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={handleSignOut}
                  >
                    <DropdownMenuItem className="flex items-center gap-2 text-destructive">
                      <LogOut className="h-4 w-4" />
                      {language === "en" ? "Log Out" : "लॉग आउट"}
                    </DropdownMenuItem>
                  </Button>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72">
                  <div className="flex items-center gap-2 mb-6">
                    <Heart className="h-6 w-6 text-primary" />
                    <span className="font-bold">{language === "en" ? "Student Support Hub" : "छात्र सहायता केंद्र"}</span>
                  </div>

                  <nav className="space-y-2">
                    {visibleNavItems.map((item) => {
                      const isActive = pathname === item.href
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted"
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <item.icon className="h-4 w-4" />
                          {item.label}
                        </Link>
                      )
                    })}

                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-muted"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      {language === "en" ? "My Profile" : "मेरी प्रोफ़ाइल"}
                    </Link>

                    <Button
                      variant="ghost"
                      className="w-full justify-start px-3 py-2 h-auto font-medium"
                      onClick={() => {
                        setIsMobileMenuOpen(false)
                        handleSignOut()
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      <span className="text-destructive">
                        {language === "en" ? "Log Out" : "लॉग आउट"}
                      </span>
                    </Button>
                  </nav>

                  {/* Mobile User Profile */}
                  <div className="mt-6 pt-6 border-t">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="h-10 w-10 ring-2 ring-primary">
                        <AvatarFallback className="bg-primary text-primary-foreground text-base font-semibold">
                          {user?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                    <Button
                      onClick={handleSignOut}
                      variant="outline"
                      className="w-full justify-start gap-2 text-destructive bg-transparent"
                    >
                      <LogOut className="h-4 w-4" />
                      {t("signOut", language)}
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  )
}
