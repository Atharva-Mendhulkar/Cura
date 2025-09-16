"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, BookOpen, HelpCircle, Calendar, Users, MessageCircle, Briefcase, ArrowRight } from "lucide-react"
import { getCurrentLanguage } from "@/lib/i18n"
import Link from "next/link"

export function QuickActionTiles() {
  const language = getCurrentLanguage()

  const tiles = [
    {
      href: "/mood-tracker",
      icon: TrendingUp,
      title: language === "en" ? "Mood Tracker" : "मूड ट्रैकर",
      description: language === "en" ? "Track your daily emotions" : "अपनी दैनिक भावनाओं को ट्रैक करें",
      color: "from-green-500/10 to-emerald-500/10",
      iconColor: "text-green-600",
      badge: language === "en" ? "Daily" : "दैनिक",
    },
    {
      href: "/journaling",
      icon: BookOpen,
      title: language === "en" ? "Journaling" : "जर्नलिंग",
      description: language === "en" ? "Express your thoughts safely" : "अपने विचारों को सुरक्षित रूप से व्यक्त करें",
      color: "from-blue-500/10 to-cyan-500/10",
      iconColor: "text-blue-600",
      badge: language === "en" ? "Private" : "निजी",
    },
    {
      href: "/quizzes",
      icon: HelpCircle,
      title: language === "en" ? "Mental Health Quizzes" : "मानसिक स्वास्थ्य प्रश्नावली",
      description: language === "en" ? "PHQ-9, GAD-7 assessments" : "PHQ-9, GAD-7 मूल्यांकन",
      color: "from-purple-500/10 to-violet-500/10",
      iconColor: "text-purple-600",
      badge: language === "en" ? "Assessment" : "मूल्यांकन",
    },
    {
      href: "/appointments",
      icon: Calendar,
      title: language === "en" ? "Book Appointment" : "अपॉइंटमेंट बुक करें",
      description: language === "en" ? "Schedule with counselors" : "काउंसलर के साथ शेड्यूल करें",
      color: "from-orange-500/10 to-red-500/10",
      iconColor: "text-orange-600",
      badge: language === "en" ? "Secure" : "सुरक्षित",
    },
    {
      href: "/forums",
      icon: Users,
      title: language === "en" ? "Peer Support" : "सहकर्मी सहायता",
      description: language === "en" ? "Connect with community" : "समुदाय से जुड़ें",
      color: "from-pink-500/10 to-rose-500/10",
      iconColor: "text-pink-600",
      badge: language === "en" ? "Community" : "समुदाय",
    },
    {
      href: "/chatbot",
      icon: MessageCircle,
      title: language === "en" ? "Mental Health Chatbot" : "मानसिक स्वास्थ्य चैटबॉट",
      description: language === "en" ? "24/7 AI support & guidance" : "24/7 AI सहायता और मार्गदर्शन",
      color: "from-amber-500/10 to-yellow-500/10",
      iconColor: "text-amber-600",
      badge: language === "en" ? "AI" : "AI",
    },
    {
      href: "/career-corner",
      icon: Briefcase,
      title: language === "en" ? "Career Corner" : "करियर कॉर्नर",
      description: language === "en" ? "Job opportunities & career guidance" : "नौकरी के अवसर और करियर मार्गदर्शन",
      color: "from-indigo-500/10 to-purple-500/10",
      iconColor: "text-indigo-600",
      badge: language === "en" ? "Career" : "करियर",
    },
    {
      href: "/academic-corner",
      icon: Briefcase,
      title: language === "en" ? "Academic Corner" : "शैक्षणिक कॉर्नर",
      description: language === "en" ? "Resources, mentors & study groups" : "संसाधन, गुरु और अध्ययन समूह",
      color: "from-teal-500/10 to-green-500/10",
      iconColor: "text-teal-600",
      badge: language === "en" ? "Academic" : "शैक्षणिक",
    },
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{language === "en" ? "Quick Actions" : "त्वरित क्रियाएं"}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tiles.map((tile, index) => (
          <Link key={index} href={tile.href}>
            <Card
              className={`h-full hover:shadow-lg transition-all duration-200 bg-gradient-to-br ${tile.color} border-0 hover:scale-105`}
            >
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <tile.icon className={`h-6 w-6 ${tile.iconColor}`} />
                  <Badge variant="secondary" className="text-xs">
                    {tile.badge}
                  </Badge>
                </div>

                <div className="space-y-1">
                  <h3 className="font-semibold text-sm leading-tight">{tile.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{tile.description}</p>
                </div>

                <div className="flex items-center justify-end">
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
