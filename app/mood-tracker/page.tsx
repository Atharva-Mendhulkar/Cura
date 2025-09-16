"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/ui/auth-guard"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { MoodSelector } from "@/components/ui/mood-selector"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, TrendingUp, Download, Eye, EyeOff } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { getCurrentUser } from "@/lib/auth"
import { getCurrentLanguage } from "@/lib/i18n"
import type { MoodEntry } from "@/lib/types"

export default function MoodTrackerPage() {
  const [user, setUser] = useState(getCurrentUser())
  const [language, setCurrentLanguage] = useState(getCurrentLanguage())
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([])
  const [showPrivateEntries, setShowPrivateEntries] = useState(false)
  const [currentStreak, setCurrentStreak] = useState(0)

  useEffect(() => {
    setCurrentLanguage(getCurrentLanguage())
    loadMoodEntries()
    calculateStreak()
  }, [])

  const loadMoodEntries = () => {
    // Load mood entries from localStorage
    const entries: MoodEntry[] = []
    for (let i = 0; i < 30; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toDateString()
      const savedMood = localStorage.getItem(`mood-${dateStr}`)
      if (savedMood) {
        entries.push(JSON.parse(savedMood))
      }
    }
    setMoodEntries(entries.reverse())
  }

  const calculateStreak = () => {
    let streak = 0
    const today = new Date()
    for (let i = 0; i < 30; i++) {
      const date = new Date()
      date.setDate(today.getDate() - i)
      const dateStr = date.toDateString()
      const savedMood = localStorage.getItem(`mood-${dateStr}`)
      if (savedMood) {
        streak++
      } else {
        break
      }
    }
    setCurrentStreak(streak)
  }

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

    const today = new Date().toDateString()
    localStorage.setItem(`mood-${today}`, JSON.stringify(moodEntry))
    loadMoodEntries()
    calculateStreak()
  }

  const getChartData = () => {
    return moodEntries
      .filter((entry) => showPrivateEntries || !entry.isPrivate)
      .slice(-14)
      .map((entry) => ({
        date: new Date(entry.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        mood: entry.mood,
        emoji: entry.emoji,
      }))
  }

  const getAverageMood = () => {
    const visibleEntries = moodEntries.filter((entry) => showPrivateEntries || !entry.isPrivate)
    if (visibleEntries.length === 0) return 0
    return (visibleEntries.reduce((sum, entry) => sum + entry.mood, 0) / visibleEntries.length).toFixed(1)
  }

  const exportData = () => {
    const dataToExport = moodEntries.filter((entry) => showPrivateEntries || !entry.isPrivate)
    const csvContent = [
      "Date,Mood,Emoji,Note",
      ...dataToExport.map((entry) =>
        [new Date(entry.timestamp).toLocaleDateString(), entry.mood, entry.emoji, `"${entry.note || ""}"`].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "mood-data.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <AuthGuard requiredRole="student">
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{language === "en" ? "Mood Tracker" : "मूड ट्रैकर"}</h1>
              <p className="text-muted-foreground">
                {language === "en"
                  ? "Track your daily emotions and identify patterns"
                  : "अपनी दैनिक भावनाओं को ट्रैक करें और पैटर्न की पहचान करें"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPrivateEntries(!showPrivateEntries)}
                className="bg-transparent"
              >
                {showPrivateEntries ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {language === "en" ? "Private" : "निजी"}
              </Button>
              <Button variant="outline" size="sm" onClick={exportData} className="bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                {language === "en" ? "Export" : "निर्यात"}
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === "en" ? "Current Streak" : "वर्तमान स्ट्रीक"}
                    </p>
                    <p className="text-2xl font-bold">{currentStreak}</p>
                    <p className="text-xs text-muted-foreground">{language === "en" ? "days" : "दिन"}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{language === "en" ? "Average Mood" : "औसत मूड"}</p>
                    <p className="text-2xl font-bold">{getAverageMood()}</p>
                    <p className="text-xs text-muted-foreground">{language === "en" ? "out of 5" : "5 में से"}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{language === "en" ? "Total Entries" : "कुल एंट्रीज"}</p>
                    <p className="text-2xl font-bold">{moodEntries.length}</p>
                    <p className="text-xs text-muted-foreground">{language === "en" ? "recorded" : "रिकॉर्ड किए गए"}</p>
                  </div>
                  <Badge variant="secondary" className="bg-accent text-accent-foreground">
                    {language === "en" ? "Active" : "सक्रिय"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Today's Mood Entry */}
          <Card>
            <CardHeader>
              <CardTitle>{language === "en" ? "How are you feeling today?" : "आज आप कैसा महसूस कर रहे हैं?"}</CardTitle>
              <CardDescription>
                {language === "en"
                  ? "Your daily mood check-in helps track patterns and progress"
                  : "आपकी दैनिक मूड जांच पैटर्न और प्रगति को ट्रैक करने में मदद करती है"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MoodSelector onMoodSelect={handleMoodSubmit} />
            </CardContent>
          </Card>

          {/* Mood Chart */}
          {getChartData().length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{language === "en" ? "Mood Trends" : "मूड रुझान"}</CardTitle>
                <CardDescription>
                  {language === "en" ? "Your mood patterns over the last 2 weeks" : "पिछले 2 सप्ताह में आपके मूड पैटर्न"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={getChartData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[1, 5]} />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload
                            return (
                              <div className="bg-background border rounded-lg p-3 shadow-lg">
                                <p className="font-medium">{label}</p>
                                <p className="text-sm">
                                  {language === "en" ? "Mood:" : "मूड:"} {data.emoji} ({data.mood}/5)
                                </p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="mood"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Entries */}
          <Card>
            <CardHeader>
              <CardTitle>{language === "en" ? "Recent Entries" : "हाल की एंट्रीज"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {moodEntries
                  .filter((entry) => showPrivateEntries || !entry.isPrivate)
                  .slice(0, 5)
                  .map((entry) => (
                    <div key={entry.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <span className="text-2xl">{entry.emoji}</span>
                      <div className="flex-1">
                        <p className="font-medium">
                          {new Date(entry.timestamp).toLocaleDateString(language === "hi" ? "hi-IN" : "en-US", {
                            weekday: "long",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                        {entry.note && <p className="text-sm text-muted-foreground">{entry.note}</p>}
                      </div>
                      <Badge variant="outline">{entry.mood}/5</Badge>
                    </div>
                  ))}

                {moodEntries.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>{language === "en" ? "No mood entries yet" : "अभी तक कोई मूड एंट्री नहीं"}</p>
                    <p className="text-sm">
                      {language === "en" ? "Start tracking your mood today!" : "आज अपना मूड ट्रैक करना शुरू करें!"}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
