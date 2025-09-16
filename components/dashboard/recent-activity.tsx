"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, BookOpen, Users, Calendar, ArrowRight } from "lucide-react"
import { getCurrentLanguage } from "@/lib/i18n"

export function RecentActivity() {
  const language = getCurrentLanguage()

  const activities = [
    {
      type: "mood",
      icon: TrendingUp,
      title: language === "en" ? "Mood Entry" : "मूड एंट्री",
      description: language === "en" ? "Logged feeling happy today" : "आज खुश महसूस करने का लॉग",
      time: language === "en" ? "2 hours ago" : "2 घंटे पहले",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      type: "journal",
      icon: BookOpen,
      title: language === "en" ? "Journal Entry" : "जर्नल एंट्री",
      description: language === "en" ? "Wrote about study goals" : "अध्ययन लक्ष्यों के बारे में लिखा",
      time: language === "en" ? "Yesterday" : "कल",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      type: "forum",
      icon: Users,
      title: language === "en" ? "Forum Post" : "फोरम पोस्ट",
      description: language === "en" ? "Helped a peer with anxiety tips" : "चिंता की युक्तियों के साथ एक साथी की मदद की",
      time: language === "en" ? "2 days ago" : "2 दिन पहले",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      type: "appointment",
      icon: Calendar,
      title: language === "en" ? "Appointment" : "अपॉइंटमेंट",
      description: language === "en" ? "Session with Dr. Sarah" : "डॉ. सारा के साथ सत्र",
      time: language === "en" ? "3 days ago" : "3 दिन पहले",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{language === "en" ? "Recent Activity" : "हाल की गतिविधि"}</CardTitle>
            <CardDescription>
              {language === "en" ? "Your wellness journey progress" : "आपकी कल्याण यात्रा की प्रगति"}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" className="bg-transparent">
            {language === "en" ? "View All" : "सभी देखें"}
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <div className={`p-2 rounded-full ${activity.bgColor}`}>
              <activity.icon className={`h-4 w-4 ${activity.color}`} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-sm">{activity.title}</p>
                <Badge variant="outline" className="text-xs">
                  +{activity.type === "mood" ? "10" : activity.type === "journal" ? "15" : "20"} pts
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground truncate">{activity.description}</p>
            </div>

            <span className="text-xs text-muted-foreground shrink-0">{activity.time}</span>
          </div>
        ))}

        {activities.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>{language === "en" ? "No recent activity" : "कोई हाल की गतिविधि नहीं"}</p>
            <p className="text-sm">
              {language === "en"
                ? "Start by logging your mood or writing in your journal"
                : "अपना मूड लॉग करके या अपनी जर्नल में लिखकर शुरुआत करें"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
