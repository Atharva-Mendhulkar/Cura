"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Flame, Trophy } from "lucide-react"
import { getCurrentLanguage } from "@/lib/i18n"

interface DailyStreakProps {
  streak: number
}

export function DailyStreak({ streak }: DailyStreakProps) {
  const language = getCurrentLanguage()

  const getStreakMessage = () => {
    if (streak === 0) {
      return language === "en" ? "Start your wellness journey today!" : "आज अपनी कल्याण यात्रा शुरू करें!"
    }
    if (streak < 7) {
      return language === "en" ? "Great start! Keep it up!" : "बेहतरीन शुरुआत! इसे जारी रखें!"
    }
    if (streak < 30) {
      return language === "en" ? "Amazing consistency!" : "अद्भुत निरंतरता!"
    }
    return language === "en" ? "You're a wellness champion!" : "आप एक कल्याण चैंपियन हैं!"
  }

  const getStreakColor = () => {
    if (streak === 0) return "text-gray-500"
    if (streak < 7) return "text-orange-500"
    if (streak < 30) return "text-red-500"
    return "text-purple-500"
  }

  // Generate week view
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    const isCompleted = i < streak && streak <= 7 ? true : i < 7
    return {
      day: date.toLocaleDateString(language === "hi" ? "hi-IN" : "en-US", { weekday: "short" }),
      date: date.getDate(),
      completed: isCompleted,
    }
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className={`h-5 w-5 ${getStreakColor()}`} />
            <CardTitle className="text-lg">{language === "en" ? "Daily Streak" : "दैनिक स्ट्रीक"}</CardTitle>
          </div>
          <Badge variant="secondary" className="bg-accent text-accent-foreground">
            <Trophy className="h-3 w-3 mr-1" />
            {streak} {language === "en" ? "days" : "दिन"}
          </Badge>
        </div>
        <CardDescription>{getStreakMessage()}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Week View */}
        <div className="flex justify-between items-center">
          {weekDays.map((day, index) => (
            <div key={index} className="flex flex-col items-center space-y-1">
              <span className="text-xs text-muted-foreground">{day.day}</span>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                  day.completed
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground border-2 border-dashed border-muted-foreground/30"
                }`}
              >
                {day.completed ? "✓" : day.date}
              </div>
            </div>
          ))}
        </div>

        {/* Progress Message */}
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            {language === "en"
              ? "Complete daily activities to maintain your streak and earn bonus points!"
              : "अपनी स्ट्रीक बनाए रखने और बोनस अंक अर्जित करने के लिए दैनिक गतिविधियां पूरी करें!"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
