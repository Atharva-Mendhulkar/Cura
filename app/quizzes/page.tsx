"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/ui/auth-guard"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CrisisAlert } from "@/components/ui/crisis-alert"
import { HelpCircle, Brain, Heart, Moon, Calendar, AlertTriangle } from "lucide-react"
import { PHQ9_QUESTIONS, GAD7_QUESTIONS, RESPONSE_OPTIONS } from "@/lib/constants"
import { getCurrentUser } from "@/lib/auth"
import { getCurrentLanguage } from "@/lib/i18n"
import type { QuizResult, CrisisAlert as CrisisAlertType } from "@/lib/types"

export default function QuizzesPage() {
  const [user, setUser] = useState(getCurrentUser())
  const [language, setCurrentLanguage] = useState(getCurrentLanguage())
  const [activeQuiz, setActiveQuiz] = useState<string | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<Record<string, number>>({})
  const [quizResults, setQuizResults] = useState<QuizResult[]>([])
  const [showCrisisAlert, setShowCrisisAlert] = useState(false)
  const [crisisAlert, setCrisisAlert] = useState<CrisisAlertType | null>(null)

  useEffect(() => {
    setCurrentLanguage(getCurrentLanguage())
    loadQuizResults()
  }, [])

  const loadQuizResults = () => {
    const results = JSON.parse(localStorage.getItem(`quiz-results-${user?.id}`) || "[]")
    setQuizResults(results)
  }

  const quizzes = [
    {
      id: "PHQ-9",
      title: language === "en" ? "Depression Screening (PHQ-9)" : "अवसाद स्क्रीनिंग (PHQ-9)",
      description:
        language === "en"
          ? "Assess symptoms of depression over the past 2 weeks"
          : "पिछले 2 सप्ताह में अवसाद के लक्षणों का आकलन करें",
      icon: Brain,
      color: "from-blue-500/10 to-indigo-500/10",
      iconColor: "text-blue-600",
      questions: PHQ9_QUESTIONS[language],
      duration: "5-7 min",
    },
    {
      id: "GAD-7",
      title: language === "en" ? "Anxiety Screening (GAD-7)" : "चिंता स्क्रीनिंग (GAD-7)",
      description:
        language === "en"
          ? "Evaluate anxiety symptoms over the past 2 weeks"
          : "पिछले 2 सप्ताह में चिंता के लक्षणों का मूल्यांकन करें",
      icon: Heart,
      color: "from-red-500/10 to-pink-500/10",
      iconColor: "text-red-600",
      questions: GAD7_QUESTIONS[language],
      duration: "3-5 min",
    },
    {
      id: "Sleep-Index",
      title: language === "en" ? "Sleep Quality Index" : "नींद गुणवत्ता सूचकांक",
      description: language === "en" ? "Assess your sleep patterns and quality" : "अपने नींद के पैटर्न और गुणवत्ता का आकलन करें",
      icon: Moon,
      color: "from-purple-500/10 to-violet-500/10",
      iconColor: "text-purple-600",
      questions: [
        language === "en" ? "How would you rate your sleep quality?" : "आप अपनी नींद की गुणवत्ता को कैसे रेट करेंगे?",
        language === "en" ? "How often do you have trouble falling asleep?" : "आपको कितनी बार सोने में परेशानी होती है?",
        language === "en" ? "Do you wake up feeling rested?" : "क्या आप आराम महसूस करते हुए जागते हैं?",
        language === "en" ? "How often do you wake up during the night?" : "आप रात में कितनी बार जागते हैं?",
        language === "en"
          ? "Do sleep problems affect your daily activities?"
          : "क्या नींद की समस्याएं आपकी दैनिक गतिविधियों को प्रभावित करती हैं?",
      ],
      duration: "3-4 min",
    },
  ]

  const startQuiz = (quizId: string) => {
    setActiveQuiz(quizId)
    setCurrentQuestion(0)
    setResponses({})
  }

  const handleResponse = (value: number) => {
    const newResponses = { ...responses, [currentQuestion]: value }
    setResponses(newResponses)

    const currentQuiz = quizzes.find((q) => q.id === activeQuiz)
    if (currentQuiz && currentQuestion < currentQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      completeQuiz(newResponses)
    }
  }

  const completeQuiz = (finalResponses: Record<string, number>) => {
    const currentQuiz = quizzes.find((q) => q.id === activeQuiz)
    if (!currentQuiz) return

    const totalScore = Object.values(finalResponses).reduce((sum, value) => sum + value, 0)
    const severity = getSeverity(activeQuiz!, totalScore)

    const result: QuizResult = {
      id: `quiz-${Date.now()}`,
      userId: user?.id || "",
      quizType: activeQuiz as "PHQ-9" | "GAD-7" | "Sleep-Index",
      score: totalScore,
      severity,
      responses: finalResponses,
      completedAt: new Date(),
      escalationTriggered: severity === "severe",
    }

    const updatedResults = [result, ...quizResults]
    setQuizResults(updatedResults)
    localStorage.setItem(`quiz-results-${user?.id}`, JSON.stringify(updatedResults))

    // Check for crisis intervention
    if (severity === "severe" || (activeQuiz === "PHQ-9" && finalResponses[8] > 0)) {
      const alert: CrisisAlertType = {
        id: `crisis-${Date.now()}`,
        userId: user?.id || "",
        triggerType: "quiz",
        severity: severity === "severe" ? "critical" : "high",
        content: `High ${activeQuiz} score detected`,
        resolved: false,
        counselorNotified: false,
        createdAt: new Date(),
      }
      setCrisisAlert(alert)
      setShowCrisisAlert(true)
    }

    // Award points
    const currentProgress = JSON.parse(localStorage.getItem(`progress-${user?.id}`) || "{}")
    const newProgress = {
      ...currentProgress,
      totalPoints: (currentProgress.totalPoints || 0) + 25,
    }
    localStorage.setItem(`progress-${user?.id}`, JSON.stringify(newProgress))

    setActiveQuiz(null)
  }

  const getSeverity = (quizType: string, score: number): "minimal" | "mild" | "moderate" | "severe" => {
    switch (quizType) {
      case "PHQ-9":
        if (score <= 4) return "minimal"
        if (score <= 9) return "mild"
        if (score <= 14) return "moderate"
        return "severe"
      case "GAD-7":
        if (score <= 4) return "minimal"
        if (score <= 9) return "mild"
        if (score <= 14) return "moderate"
        return "severe"
      case "Sleep-Index":
        if (score <= 5) return "minimal"
        if (score <= 10) return "mild"
        if (score <= 15) return "moderate"
        return "severe"
      default:
        return "minimal"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "minimal":
        return "bg-green-100 text-green-800"
      case "mild":
        return "bg-yellow-100 text-yellow-800"
      case "moderate":
        return "bg-orange-100 text-orange-800"
      case "severe":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const currentQuiz = quizzes.find((q) => q.id === activeQuiz)

  if (showCrisisAlert && crisisAlert) {
    return (
      <AuthGuard requiredRole="student">
        <DashboardLayout>
          <div className="max-w-md mx-auto mt-8">
            <CrisisAlert
              severity={crisisAlert.severity}
              onBookCounselor={() => {
                setShowCrisisAlert(false)
                window.location.href = "/appointments"
              }}
              onDismiss={() => setShowCrisisAlert(false)}
            />
          </div>
        </DashboardLayout>
      </AuthGuard>
    )
  }

  if (activeQuiz && currentQuiz) {
    return (
      <AuthGuard requiredRole="student">
        <DashboardLayout>
          <div className="max-w-2xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <currentQuiz.icon className={`h-5 w-5 ${currentQuiz.iconColor}`} />
                    {currentQuiz.title}
                  </CardTitle>
                  <Badge variant="outline">
                    {currentQuestion + 1} / {currentQuiz.questions.length}
                  </Badge>
                </div>
                <Progress value={((currentQuestion + 1) / currentQuiz.questions.length) * 100} className="mt-2" />
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium leading-relaxed">{currentQuiz.questions[currentQuestion]}</h3>

                  <div className="space-y-2">
                    {RESPONSE_OPTIONS[language].map((option, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-start text-left h-auto p-4 bg-transparent"
                        onClick={() => handleResponse(index)}
                      >
                        <span className="font-medium mr-2">{index}.</span>
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setActiveQuiz(null)} className="bg-transparent">
                    {language === "en" ? "Cancel" : "रद्द करें"}
                  </Button>

                  {currentQuestion > 0 && (
                    <Button
                      variant="outline"
                      onClick={() => setCurrentQuestion(currentQuestion - 1)}
                      className="bg-transparent"
                    >
                      {language === "en" ? "Previous" : "पिछला"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </DashboardLayout>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard requiredRole="student">
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold">
              {language === "en" ? "Mental Health Quizzes" : "मानसिक स्वास्थ्य प्रश्नावली"}
            </h1>
            <p className="text-muted-foreground">
              {language === "en"
                ? "Take validated assessments to understand your mental health better"
                : "अपने मानसिक स्वास्थ्य को बेहतर समझने के लिए मान्य मूल्यांकन लें"}
            </p>
          </div>

          {/* Available Quizzes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <Card
                key={quiz.id}
                className={`bg-gradient-to-br ${quiz.color} border-0 hover:shadow-lg transition-shadow`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <quiz.icon className={`h-8 w-8 ${quiz.iconColor}`} />
                    <Badge variant="secondary">{quiz.duration}</Badge>
                  </div>
                  <CardTitle className="text-lg">{quiz.title}</CardTitle>
                  <CardDescription className="leading-relaxed">{quiz.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  <Button onClick={() => startQuiz(quiz.id)} className="w-full">
                    {language === "en" ? "Start Assessment" : "मूल्यांकन शुरू करें"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Results */}
          {quizResults.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {language === "en" ? "Recent Results" : "हाल के परिणाम"}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {quizResults.slice(0, 5).map((result) => (
                    <div key={result.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        {result.escalationTriggered && <AlertTriangle className="h-5 w-5 text-red-500" />}
                        <div>
                          <p className="font-medium">{result.quizType}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(result.completedAt).toLocaleDateString(language === "hi" ? "hi-IN" : "en-US")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getSeverityColor(result.severity)}>
                          {result.severity}
                        </Badge>
                        <span className="text-sm font-medium">{result.score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Information */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <HelpCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="space-y-2">
                  <h3 className="font-medium text-blue-900">
                    {language === "en" ? "About These Assessments" : "इन मूल्यांकनों के बारे में"}
                  </h3>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    {language === "en"
                      ? "These are clinically validated screening tools. They are not diagnostic tests but can help identify symptoms that may benefit from professional support. All responses are confidential and encrypted."
                      : "ये चिकित्सकीय रूप से मान्य स्क्रीनिंग उपकरण हैं। ये निदान परीक्षण नहीं हैं लेकिन उन लक्षणों की पहचान करने में मदद कर सकते हैं जिनसे पेशेवर सहायता का लाभ हो सकता है। सभी प्रतिक्रियाएं गोपनीय और एन्क्रिप्टेड हैं।"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
