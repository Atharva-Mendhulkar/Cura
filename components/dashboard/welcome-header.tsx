"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sunrise, Sun, Moon } from "lucide-react"
import { getCurrentLanguage } from "@/lib/i18n"
import type { AuthUser } from "@/lib/auth"

interface WelcomeHeaderProps {
  user: AuthUser | null
}

export function WelcomeHeader({ user }: WelcomeHeaderProps) {
  const language = getCurrentLanguage()

  const getTimeOfDay = () => {
    const hour = new Date().getHours()
    if (hour < 12) return { greeting: "Good Morning", icon: Sunrise, time: "morning" }
    if (hour < 17) return { greeting: "Good Afternoon", icon: Sun, time: "afternoon" }
    return { greeting: "Good Evening", icon: Moon, time: "evening" }
  }

  const { greeting, icon: TimeIcon, time } = getTimeOfDay()

  const greetingTranslations = {
    morning: { en: "Good Morning", hi: "सुप्रभात" },
    afternoon: { en: "Good Afternoon", hi: "नमस्कार" },
    evening: { en: "Good Evening", hi: "शुभ संध्या" },
  }

  return (
    <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/10">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <TimeIcon className="h-5 w-5 text-primary" />
              <h1 className="text-2xl font-bold">
                {greetingTranslations[time][language]}, {user?.name?.split(" ")[0]}!
              </h1>
            </div>
            <p className="text-muted-foreground">
              {language === "en"
                ? "How are you feeling today? Let's check in with your wellbeing."
                : "आज आप कैसा महसूस कर रहे हैं? आइए अपनी भलाई की जांच करते हैं।"}
            </p>
          </div>

          <div className="text-right">
            <Badge variant="secondary" className="mb-2">
              {user?.campus}
            </Badge>
            <p className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString(language === "hi" ? "hi-IN" : "en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
