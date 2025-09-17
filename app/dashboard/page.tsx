"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/ui/auth-guard"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { MoodSelector } from "@/components/ui/mood-selector"
import { PointsBadge } from "@/components/ui/points-badge"
import { QuickActionTiles } from "@/components/dashboard/quick-action-tiles"
import { DailyStreak } from "@/components/dashboard/daily-streak"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { WelcomeHeader } from "@/components/dashboard/welcome-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, TrendingUp, Calendar, Users } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { t, getCurrentLanguage } from "@/lib/i18n"
import type { MoodEntry, UserProgress } from "@/lib/types"

export default function DashboardPage() {
  const [user, setUser] = useState(getCurrentUser())
  const [language, setCurrentLanguage] = useState(getCurrentLanguage())
  const [todaysMood, setTodaysMood] = useState<MoodEntry | null>(null)
  const [userProgress, setUserProgress] = useState<UserProgress>({
    userId: user?.id || "",
    totalPoints: 245,
    currentStreak: 7,
    longestStreak: 12,
    badges: [],
    level: 3,
  })
  const [showMoodSelector, setShowMoodSelector] = useState(false)

  useEffect(() => {
    setCurrentLanguage(getCurrentLanguage())
    // Check if user has logged mood today
    const today = new Date().toDateString()
    const savedMood = localStorage.getItem(`mood-${today}`)
    if (savedMood) {
      setTodaysMood(JSON.parse(savedMood))
    } else {
      setShowMoodSelector(true)
    }

    // Load user progress from localStorage
    const savedProgress = localStorage.getItem(`progress-${user?.id}`)
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress))
    }
  }, [user?.id])

  const handleMoodSubmit = (mood: number, note?: string) => {
    const moodEntry: MoodEntry = {
      id: `mood-${Date.now()}`,
      userId: user?.id || "",
      mood,
      emoji: ["😢", "😔", "😐", "😊", "😄"][mood - 1],
      note,
      timestamp: new Date(),
      isPrivate: false,
    }

    // Save mood entry
    const today = new Date().toDateString()
    localStorage.setItem(`mood-${today}`, JSON.stringify(moodEntry))
    setTodaysMood(moodEntry)
    setShowMoodSelector(false)

    // Update points and streak
    const newProgress = {
      ...userProgress,
      totalPoints: userProgress.totalPoints + 10,
      currentStreak: userProgress.currentStreak + 1,
    }
    setUserProgress(newProgress)
    localStorage.setItem(`progress-${user?.id}`, JSON.stringify(newProgress))

    // Show success message
    setTimeout(() => {
      alert(t("moodSaved", language))
    }, 500)
  }

  const quickStats = [
    {
      title: language === "en" ? "This Week" : "इस सप्ताह",
      value: "5/7",
      description: language === "en" ? "Mood entries" : "मूड एंट्रीज",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: language === "en" ? "Next Session" : "अगला सत्र",
      value: language === "en" ? "Tomorrow" : "कल",
      description: language === "en" ? "Study planning" : "अध्ययन योजना",
      icon: Calendar,
      color: "text-blue-600",
    },
    {
      title: language === "en" ? "Forum Posts" : "फोरम पोस्ट",
      value: "3",
      description: language === "en" ? "This month" : "इस महीने",
      icon: Users,
      color: "text-purple-600",
    },
  ]

  return (
    <AuthGuard requiredRole="student">
      <DashboardLayout>
        <div className="space-y-6">
          {/* Welcome Header */}
          <WelcomeHeader user={user} />

          {/* Points and Streak */}
          <PointsBadge
            points={userProgress.totalPoints}
            streak={userProgress.currentStreak}
            level={userProgress.level}
          />

          {/* Today's Mood Section */}
          {showMoodSelector ? (
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">{t("todaysMood", language)}</h2>
              <MoodSelector onMoodSelect={handleMoodSubmit} />
            </div>
          ) : todaysMood ? (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  {t("todaysMood", language)}
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {language === "en" ? "Completed" : "पूर्ण"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{todaysMood.emoji}</span>
                  <div>
                    <p className="font-medium">{language === "en" ? "Feeling good today!" : "आज अच्छा महसूस कर रहे हैं!"}</p>
                    {todaysMood.note && <p className="text-sm text-muted-foreground">{todaysMood.note}</p>}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 bg-transparent"
                  onClick={() => setShowMoodSelector(true)}
                >
                  {language === "en" ? "Update Mood" : "मूड अपडेट करें"}
                </Button>
              </CardContent>
            </Card>
          ) : null}

          {/* Quick Help Button */}
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-primary">{t("quickHelp", language)}</h3>
                  <p className="text-sm text-muted-foreground">
                    {language === "en"
                      ? "Need someone to talk to? Our AI assistant is here 24/7"
                      : "किसी से बात करने की जरूरत है? हमारा AI असिस्टेंट 24/7 यहाँ है"}
                  </p>
                </div>
                <Button className="shrink-0" onClick={() => (window.location.href = "/chatbot") }>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {language === "en" ? "Chat Now" : "अभी चैट करें"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickStats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.description}</p>
                    </div>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Action Tiles */}
          <QuickActionTiles />

          {/* Daily Streak */}
          <DailyStreak streak={userProgress.currentStreak} />

          {/* Recent Activity */}
          <RecentActivity />
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
