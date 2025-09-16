"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/ui/auth-guard"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Shield,
  Eye,
  CheckCircle,
  Clock,
  BarChart3,
  UserCheck,
  Flag,
  Heart,
  Brain,
} from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { getCurrentLanguage } from "@/lib/i18n"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface AdminStats {
  totalUsers: number
  activeUsers: number
  totalSessions: number
  crisisAlerts: number
  forumPosts: number
  appointmentsToday: number
  avgMoodScore: number
  completionRate: number
}

interface CrisisAlert {
  id: string
  userId: string
  userName: string
  type: "high-risk-quiz" | "crisis-keywords" | "mood-decline" | "emergency-contact"
  severity: "low" | "medium" | "high" | "critical"
  message: string
  timestamp: Date
  status: "pending" | "acknowledged" | "resolved"
  assignedTo?: string
}

interface UserOverview {
  id: string
  name: string
  email: string
  campus: string
  year: string
  lastActive: Date
  riskLevel: "low" | "medium" | "high"
  totalSessions: number
  avgMoodScore: number
  flaggedContent: number
}

export default function AdminDashboardPage() {
  const [user, setUser] = useState(getCurrentUser())
  const [language, setCurrentLanguage] = useState(getCurrentLanguage())
  const [currentTab, setCurrentTab] = useState("overview")
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalSessions: 0,
    crisisAlerts: 0,
    forumPosts: 0,
    appointmentsToday: 0,
    avgMoodScore: 0,
    completionRate: 0,
  })
  const [crisisAlerts, setCrisisAlerts] = useState<CrisisAlert[]>([])
  const [userOverviews, setUserOverviews] = useState<UserOverview[]>([])
  const [selectedTimeRange, setSelectedTimeRange] = useState("7d")

  useEffect(() => {
    setCurrentLanguage(getCurrentLanguage())
    loadAdminData()
  }, [])

  const loadAdminData = () => {
    // Mock admin statistics
    const mockStats: AdminStats = {
      totalUsers: 1247,
      activeUsers: 892,
      totalSessions: 3456,
      crisisAlerts: 12,
      forumPosts: 234,
      appointmentsToday: 18,
      avgMoodScore: 6.8,
      completionRate: 78.5,
    }

    // Mock crisis alerts
    const mockAlerts: CrisisAlert[] = [
      {
        id: "alert-1",
        userId: "user-123",
        userName: "Anonymous User",
        type: "high-risk-quiz",
        severity: "critical",
        message:
          language === "en"
            ? "PHQ-9 score indicates severe depression (Score: 22/27)"
            : "PHQ-9 स्कोर गंभीर अवसाद का संकेत देता है (स्कोर: 22/27)",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        status: "pending",
      },
      {
        id: "alert-2",
        userId: "user-456",
        userName: "Student A",
        type: "crisis-keywords",
        severity: "high",
        message:
          language === "en"
            ? "Crisis keywords detected in journal entry: 'self-harm', 'hopeless'"
            : "जर्नल प्रविष्टि में संकट कीवर्ड का पता चला: 'आत्म-हानि', 'निराशाजनक'",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: "acknowledged",
        assignedTo: "Dr. Smith",
      },
      {
        id: "alert-3",
        userId: "user-789",
        userName: "Student B",
        type: "mood-decline",
        severity: "medium",
        message:
          language === "en"
            ? "Consistent mood decline over 7 days (avg: 3.2/10)"
            : "7 दिनों में लगातार मूड में गिरावट (औसत: 3.2/10)",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        status: "resolved",
        assignedTo: "Dr. Johnson",
      },
    ]

    // Mock user overviews
    const mockUsers: UserOverview[] = [
      {
        id: "user-123",
        name: "Anonymous User",
        email: "user123@college.edu",
        campus: "Main Campus",
        year: "3rd Year",
        lastActive: new Date(Date.now() - 30 * 60 * 1000),
        riskLevel: "high",
        totalSessions: 45,
        avgMoodScore: 4.2,
        flaggedContent: 2,
      },
      {
        id: "user-456",
        name: "Student A",
        email: "student.a@college.edu",
        campus: "North Campus",
        year: "2nd Year",
        lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
        riskLevel: "medium",
        totalSessions: 23,
        avgMoodScore: 6.1,
        flaggedContent: 1,
      },
      {
        id: "user-789",
        name: "Student B",
        email: "student.b@college.edu",
        campus: "South Campus",
        year: "1st Year",
        lastActive: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        riskLevel: "low",
        totalSessions: 12,
        avgMoodScore: 7.8,
        flaggedContent: 0,
      },
    ]

    setStats(mockStats)
    setCrisisAlerts(mockAlerts)
    setUserOverviews(mockUsers)
  }

  const moodData = [
    { day: "Mon", mood: 4 },
    { day: "Tue", mood: 3 },
    { day: "Wed", mood: 5 },
    { day: "Thu", mood: 4 },
    { day: "Fri", mood: 5 },
    { day: "Sat", mood: 3 },
    { day: "Sun", mood: 4 },
  ]

  const moodDistributionData = [
    { category: "Excellent", count: 12 },
    { category: "Good", count: 18 },
    { category: "Okay", count: 8 },
    { category: "Poor", count: 3 },
  ]

  const handleAlertAction = (alertId: string, action: "acknowledge" | "resolve") => {
    setCrisisAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId
          ? {
              ...alert,
              status: action === "acknowledge" ? "acknowledged" : "resolved",
              assignedTo: action === "acknowledge" ? user?.name || "Current User" : alert.assignedTo,
            }
          : alert,
      ),
    )
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "acknowledged":
        return <Eye className="h-4 w-4" />
      case "resolved":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  return (
    <AuthGuard requiredRole="admin">
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{language === "en" ? "Admin Dashboard" : "एडमिन डैशबोर्ड"}</h1>
              <p className="text-muted-foreground">
                {language === "en"
                  ? "Monitor platform health, manage users, and respond to crisis situations"
                  : "प्लेटफॉर्म स्वास्थ्य की निगरानी करें, उपयोगकर्ताओं का प्रबंधन करें, और संकट स्थितियों का जवाब दें"}
              </p>
            </div>

            <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">24h</SelectItem>
                <SelectItem value="7d">7d</SelectItem>
                <SelectItem value="30d">30d</SelectItem>
                <SelectItem value="90d">90d</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Crisis Alerts Banner */}
          {crisisAlerts.filter((alert) => alert.status === "pending").length > 0 && (
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-medium text-red-900">
                      {language === "en" ? "Crisis Alerts Pending" : "संकट अलर्ट लंबित"}
                    </p>
                    <p className="text-sm text-red-700">
                      {crisisAlerts.filter((alert) => alert.status === "pending").length}{" "}
                      {language === "en" ? "alerts require immediate attention" : "अलर्ट तत्काल ध्यान देने की आवश्यकता है"}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto bg-transparent"
                    onClick={() => setCurrentTab("alerts")}
                  >
                    {language === "en" ? "View Alerts" : "अलर्ट देखें"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === "en" ? "Total Users" : "कुल उपयोगकर्ता"}
                    </p>
                    <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                    <p className="text-xs text-green-600">
                      {stats.activeUsers} {language === "en" ? "active" : "सक्रिय"}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{language === "en" ? "Crisis Alerts" : "संकट अलर्ट"}</p>
                    <p className="text-2xl font-bold">{stats.crisisAlerts}</p>
                    <p className="text-xs text-red-600">
                      {crisisAlerts.filter((alert) => alert.status === "pending").length}{" "}
                      {language === "en" ? "pending" : "लंबित"}
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === "en" ? "Avg Mood Score" : "औसत मूड स्कोर"}
                    </p>
                    <p className="text-2xl font-bold">{stats.avgMoodScore}/10</p>
                    <p className="text-xs text-green-600">
                      +0.3 {language === "en" ? "from last week" : "पिछले सप्ताह से"}
                    </p>
                  </div>
                  <Heart className="h-8 w-8 text-pink-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === "en" ? "Appointments Today" : "आज अपॉइंटमेंट"}
                    </p>
                    <p className="text-2xl font-bold">{stats.appointmentsToday}</p>
                    <p className="text-xs text-blue-600">
                      {Math.round(stats.completionRate)}% {language === "en" ? "completion" : "पूर्णता"}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">{language === "en" ? "Overview" : "अवलोकन"}</TabsTrigger>
              <TabsTrigger value="alerts">{language === "en" ? "Crisis Alerts" : "संकट अलर्ट"}</TabsTrigger>
              <TabsTrigger value="users">{language === "en" ? "User Management" : "उपयोगकर्ता प्रबंधन"}</TabsTrigger>
              <TabsTrigger value="analytics">{language === "en" ? "Analytics" : "विश्लेषण"}</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      {language === "en" ? "Weekly Mood Trend" : "साप्ताहिक मूड ट्रेंड"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={moodData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis domain={[0, 10]} />
                        <Tooltip />
                        <Line type="monotone" dataKey="mood" stroke="#ec4899" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      {language === "en" ? "Mood Distribution" : "मूड वितरण"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={moodDistributionData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      {language === "en" ? "Platform Activity" : "प्लेटफॉर्म गतिविधि"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>{language === "en" ? "Total Sessions" : "कुल सत्र"}</span>
                        <span className="font-bold">{stats.totalSessions.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>{language === "en" ? "Forum Posts" : "फोरम पोस्ट"}</span>
                        <span className="font-bold">{stats.forumPosts}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>{language === "en" ? "Active Users (7d)" : "सक्रिय उपयोगकर्ता (7d)"}</span>
                        <span className="font-bold">{stats.activeUsers}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      {language === "en" ? "Mental Health Metrics" : "मानसिक स्वास्थ्य मेट्रिक्स"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>{language === "en" ? "Average Mood" : "औसत मूड"}</span>
                        <span className="font-bold">{stats.avgMoodScore}/10</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>{language === "en" ? "High Risk Users" : "उच्च जोखिम उपयोगकर्ता"}</span>
                        <span className="font-bold text-red-600">
                          {userOverviews.filter((user) => user.riskLevel === "high").length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>{language === "en" ? "Crisis Interventions" : "संकट हस्तक्षेप"}</span>
                        <span className="font-bold">
                          {crisisAlerts.filter((alert) => alert.status === "resolved").length}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Crisis Alerts Tab */}
            <TabsContent value="alerts" className="space-y-4">
              {crisisAlerts.map((alert) => (
                <Card
                  key={alert.id}
                  className={`${
                    alert.severity === "critical"
                      ? "border-red-200 bg-red-50"
                      : alert.severity === "high"
                        ? "border-orange-200 bg-orange-50"
                        : ""
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            {getStatusIcon(alert.status)}
                            {alert.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{getTimeAgo(alert.timestamp)}</span>
                        </div>

                        <h3 className="text-lg font-semibold mb-2">{alert.userName}</h3>
                        <p className="text-muted-foreground mb-3">{alert.message}</p>

                        {alert.assignedTo && (
                          <p className="text-sm text-muted-foreground">
                            {language === "en" ? "Assigned to:" : "को सौंपा गया:"} {alert.assignedTo}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        {alert.status === "pending" && (
                          <>
                            <Button
                              onClick={() => handleAlertAction(alert.id, "acknowledge")}
                              variant="outline"
                              size="sm"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              {language === "en" ? "Acknowledge" : "स्वीकार करें"}
                            </Button>
                            <Button onClick={() => handleAlertAction(alert.id, "resolve")} size="sm">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              {language === "en" ? "Resolve" : "हल करें"}
                            </Button>
                          </>
                        )}
                        {alert.status === "acknowledged" && (
                          <Button onClick={() => handleAlertAction(alert.id, "resolve")} size="sm">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            {language === "en" ? "Mark Resolved" : "हल के रूप में चिह्नित करें"}
                          </Button>
                        )}
                        {alert.status === "resolved" && (
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {language === "en" ? "Resolved" : "हल हो गया"}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {crisisAlerts.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      {language === "en" ? "No crisis alerts" : "कोई संकट अलर्ट नहीं"}
                    </h3>
                    <p className="text-muted-foreground">
                      {language === "en" ? "All users are currently safe" : "सभी उपयोगकर्ता वर्तमान में सुरक्षित हैं"}
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* User Management Tab */}
            <TabsContent value="users" className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                  <Input placeholder={language === "en" ? "Search users..." : "उपयोगकर्ता खोजें..."} className="w-64" />
                  <Select defaultValue="all">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{language === "en" ? "All Risk Levels" : "सभी जोखिम स्तर"}</SelectItem>
                      <SelectItem value="high">{language === "en" ? "High Risk" : "उच्च जोखिम"}</SelectItem>
                      <SelectItem value="medium">{language === "en" ? "Medium Risk" : "मध्यम जोखिम"}</SelectItem>
                      <SelectItem value="low">{language === "en" ? "Low Risk" : "कम जोखिम"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                {userOverviews.map((userOverview) => (
                  <Card key={userOverview.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                            <UserCheck className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{userOverview.name}</h3>
                            <p className="text-sm text-muted-foreground">{userOverview.email}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline">{userOverview.campus}</Badge>
                              <Badge variant="outline">{userOverview.year}</Badge>
                              <Badge className={getRiskLevelColor(userOverview.riskLevel)}>
                                {userOverview.riskLevel} risk
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div>
                              <p>{language === "en" ? "Sessions" : "सत्र"}</p>
                              <p className="font-bold text-foreground">{userOverview.totalSessions}</p>
                            </div>
                            <div>
                              <p>{language === "en" ? "Avg Mood" : "औसत मूड"}</p>
                              <p className="font-bold text-foreground">{userOverview.avgMoodScore}/10</p>
                            </div>
                            <div>
                              <p>{language === "en" ? "Last Active" : "अंतिम सक्रिय"}</p>
                              <p className="font-bold text-foreground">{getTimeAgo(userOverview.lastActive)}</p>
                            </div>
                          </div>
                          {userOverview.flaggedContent > 0 && (
                            <Badge variant="destructive" className="mt-2">
                              <Flag className="h-3 w-3 mr-1" />
                              {userOverview.flaggedContent} flagged
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      {language === "en" ? "Usage Analytics" : "उपयोग विश्लेषण"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>{language === "en" ? "Daily Active Users" : "दैनिक सक्रिय उपयोगकर्ता"}</span>
                        <span className="font-bold">456</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>{language === "en" ? "Session Duration (avg)" : "सत्र अवधि (औसत)"}</span>
                        <span className="font-bold">23 min</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>{language === "en" ? "Feature Adoption" : "फीचर अपनाना"}</span>
                        <span className="font-bold">78%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      {language === "en" ? "Wellness Trends" : "कल्याण रुझान"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>{language === "en" ? "Mood Improvement" : "मूड सुधार"}</span>
                        <span className="font-bold text-green-600">+12%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>{language === "en" ? "Crisis Reduction" : "संकट में कमी"}</span>
                        <span className="font-bold text-green-600">-8%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>{language === "en" ? "Engagement Rate" : "सहभागिता दर"}</span>
                        <span className="font-bold">85%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
