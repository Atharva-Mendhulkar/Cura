"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LanguageToggle } from "@/components/ui/language-toggle"
import { Heart, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react"
import { CAMPUSES } from "@/lib/constants"
import { t, getCurrentLanguage } from "@/lib/i18n"
import type { Language } from "@/lib/types"
import Link from "next/link"

export default function SignUpPage() {
  const [language, setCurrentLanguage] = useState<Language>("en")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    campus: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    setCurrentLanguage(getCurrentLanguage())
    // Pre-fill campus if selected on landing page
    const selectedCampus = localStorage.getItem("selectedCampus")
    if (selectedCampus) {
      setFormData((prev) => ({ ...prev, campus: selectedCampus }))
    }
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Validation
      if (formData.password !== formData.confirmPassword) {
        throw new Error(language === "en" ? "Passwords do not match" : "पासवर्ड मेल नहीं खाते")
      }

      if (formData.password.length < 6) {
        throw new Error(
          language === "en" ? "Password must be at least 6 characters" : "पासवर्ड कम से कम 6 अक्षर का होना चाहिए",
        )
      }

      if (!formData.campus) {
        throw new Error(language === "en" ? "Please select your campus" : "कृपया अपना कैंपस चुनें")
      }

      // TODO: Implement actual user registration with Supabase
      // For now, simulate registration
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock successful registration
      setSuccess(true)

      // Auto-redirect after success
      setTimeout(() => {
        window.location.href = "/auth/signin"
      }, 2000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h2 className="text-xl font-semibold">
              {language === "en" ? "Account Created Successfully!" : "खाता सफलतापूर्वक बनाया गया!"}
            </h2>
            <p className="text-muted-foreground">
              {language === "en" ? "Redirecting you to sign in..." : "आपको साइन इन पर रीडायरेक्ट कर रहे हैं..."}
            </p>
          </CardContent>
        </Card>
      </div>
    )
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

        {/* Sign Up Form */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle>{t("signUp", language)}</CardTitle>
            <CardDescription>
              {language === "en"
                ? "Create your account to get started with mental health support"
                : "मानसिक स्वास्थ्य सहायता शुरू करने के लिए अपना खाता बनाएं"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">{language === "en" ? "Full Name" : "पूरा नाम"}</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder={language === "en" ? "Enter your full name" : "अपना पूरा नाम दर्ज करें"}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t("email", language)}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder={language === "en" ? "your.email@example.com" : "आपका.ईमेल@example.com"}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="campus">{language === "en" ? "Campus" : "कैंपस"}</Label>
                <Select value={formData.campus} onValueChange={(value) => handleInputChange("campus", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={language === "en" ? "Select your campus" : "अपना कैंपस चुनें"} />
                  </SelectTrigger>
                  <SelectContent>
                    {CAMPUSES.map((campus) => (
                      <SelectItem key={campus} value={campus}>
                        {campus}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t("password", language)}</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder={language === "en" ? "Create a password (min 6 chars)" : "पासवर्ड बनाएं (न्यूनतम 6 अक्षर)"}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t("confirmPassword", language)}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  placeholder={language === "en" ? "Confirm your password" : "अपने पासवर्ड की पुष्टि करें"}
                  required
                  disabled={loading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t("loading", language) : t("signUp", language)}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {language === "en" ? "Already have an account?" : "पहले से खाता है?"}
              </p>
              <Link href="/auth/signin" className="text-sm text-primary hover:text-primary/80 transition-colors">
                {t("signIn", language)}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
