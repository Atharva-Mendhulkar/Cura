"use client"

import { useState, useEffect } from "react"
import { Button } from "./button"
import { getCurrentLanguage, setLanguage } from "@/lib/i18n"
import type { Language } from "@/lib/types"

export function LanguageToggle() {
  const [language, setCurrentLanguage] = useState<Language>("en")

  useEffect(() => {
    setCurrentLanguage(getCurrentLanguage())
  }, [])

  const toggleLanguage = () => {
    const newLanguage: Language = language === "en" ? "hi" : "en"
    setCurrentLanguage(newLanguage)
    setLanguage(newLanguage)
    // Trigger a page refresh to update all translations
    window.location.reload()
  }

  return (
    <Button variant="outline" size="sm" onClick={toggleLanguage} className="font-medium bg-transparent">
      {language === "en" ? "हिन्दी" : "English"}
    </Button>
  )
}
