"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LanguageToggle } from "@/components/ui/language-toggle"
import { Heart, ArrowLeft, AlertCircle } from "lucide-react"
import { t, getCurrentLanguage } from "@/lib/i18n"
import type { Language } from "@/lib/types"
import Link from "next/link"

export default function SignInPage() {
  const [language, setCurrentLanguage] = useState<Language>("en")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    setCurrentLanguage(getCurrentLanguage())
  }, [])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // TODO: Implement actual authentication with Supabase
      // For now, simulate authentication
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock authentication - in real app, validate credentials
      if (email && password) {
        const mockUser = {
          id: "user-123",
          email,
          name: email.split("@")[0],
          role: "student",
          campus: "Default Campus", // Default campus instead of user selection
          language,
        }
        localStorage.setItem("user", JSON.stringify(mockUser))
        localStorage.setItem("isAuthenticated", "true")

        // Redirect to dashboard
        window.location.href = "/dashboard"
      } else {
        throw new Error("Invalid credentials")
      }
    } catch (err) {
      setError(language === "en" ? "Invalid email or password" : "अमान्य ईमेल या पासवर्ड")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">{language === "en" ? "Back to home" : "होम पर वापस"}</span>
          </Link>

          <div className="flex items-center justify-center gap-2">
            <Heart className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold animate-fade-in">{language === "en" ? "Cura" : "क्यूरा"}</h1>
          </div>

          <div className="flex justify-center">
            <LanguageToggle />
          </div>
        </div>

        {/* Sign In Form */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle>{t("signIn", language)}</CardTitle>
            <CardDescription>
              {language === "en" ? "Welcome back to Cura" : "क्यूरा में वापस स्वागत है"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">{t("email", language)}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={language === "en" ? "your.email@example.com" : "आपका.ईमेल@example.com"}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t("password", language)}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={language === "en" ? "Enter your password" : "अपना पासवर्ड दर्ज करें"}
                  required
                  disabled={loading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t("loading", language) : t("signIn", language)}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {language === "en" ? "Don't have an account?" : "खाता नहीं है?"}
              </p>
              <Link href="/auth/signup" className="text-sm text-primary hover:text-primary/80 transition-colors">
                {t("signUp", language)}
              </Link>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground text-center mb-2">
                {language === "en" ? "Demo Credentials:" : "डेमो क्रेडेंशियल:"}
              </p>
              <div className="text-xs space-y-1">
                <p>
                  <strong>{language === "en" ? "Student:" : "छात्र:"}</strong> student@example.com / password123
                </p>
                <p>
                  <strong>{language === "en" ? "Counselor:" : "काउंसलर:"}</strong> counselor@example.com / password123
                </p>
                <p>
                  <strong>{language === "en" ? "Admin:" : "एडमिन:"}</strong> admin@example.com / password123
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <div className="text-center text-xs text-muted-foreground">
          <p>
            {language === "en"
              ? "By signing in, you agree to our privacy practices and data protection policies."
              : "साइन इन करके, आप हमारी गोपनीयता प्रथाओं और डेटा सुरक्षा नीतियों से सहमत होते हैं।"}
          </p>
        </div>
      </div>
    </div>
  )
}
