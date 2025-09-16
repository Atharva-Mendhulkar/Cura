"use client"

import { AlertTriangle, Phone, Calendar } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "./alert"
import { Button } from "./button"
import { Card } from "./card"
import { CRISIS_HOTLINES } from "@/lib/constants"
import { t, getCurrentLanguage } from "@/lib/i18n"

interface CrisisAlertProps {
  severity: "moderate" | "high" | "critical"
  onBookCounselor: () => void
  onDismiss: () => void
}

export function CrisisAlert({ severity, onBookCounselor, onDismiss }: CrisisAlertProps) {
  const language = getCurrentLanguage()
  const hotline = CRISIS_HOTLINES[language]

  const getSeverityColor = () => {
    switch (severity) {
      case "critical":
        return "border-red-500 bg-red-50"
      case "high":
        return "border-orange-500 bg-orange-50"
      case "moderate":
        return "border-yellow-500 bg-yellow-50"
    }
  }

  return (
    <Card className={`p-6 ${getSeverityColor()}`}>
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>{t("crisisDetected", language)}</AlertTitle>
        <AlertDescription className="mt-2">{t("crisisMessage", language)}</AlertDescription>
      </Alert>

      <div className="mt-4 space-y-3">
        {severity === "critical" && (
          <Button variant="destructive" className="w-full" onClick={() => window.open(`tel:${hotline.national}`)}>
            <Phone className="h-4 w-4 mr-2" />
            {hotline.label}
          </Button>
        )}

        <Button variant="default" className="w-full" onClick={onBookCounselor}>
          <Calendar className="h-4 w-4 mr-2" />
          {t("bookCounselor", language)}
        </Button>

        <Button variant="outline" className="w-full bg-transparent" onClick={onDismiss}>
          {t("cancel", language)}
        </Button>
      </div>
    </Card>
  )
}
