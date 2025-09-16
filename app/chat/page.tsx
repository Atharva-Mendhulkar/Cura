"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { AuthGuard } from "@/components/ui/auth-guard"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Send, Bot, User, AlertTriangle, Phone } from "lucide-react"
import { CrisisAlert } from "@/components/ui/crisis-alert"
import { getCurrentUser } from "@/lib/auth"
import { getCurrentLanguage } from "@/lib/i18n"
import { CRISIS_HOTLINES } from "@/lib/constants"

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
  crisis?: boolean
}

export default function ChatPage() {
  const [user, setUser] = useState(getCurrentUser())
  const [language, setCurrentLanguage] = useState(getCurrentLanguage())
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showCrisisAlert, setShowCrisisAlert] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setCurrentLanguage(getCurrentLanguage())
    // Initialize with welcome message
    const welcomeMessage: Message = {
      id: "welcome",
      type: "bot",
      content:
        language === "en"
          ? "Hello! I'm your AI mental health assistant. I'm here to listen and provide support 24/7. How are you feeling today?"
          : "नमस्ते! मैं आपका AI मानसिक स्वास्थ्य सहायक हूं। मैं 24/7 सुनने और सहायता प्रदान करने के लिए यहां हूं। आज आप कैसा महसूस कर रहे हैं?",
      timestamp: new Date(),
    }
    setMessages([welcomeMessage])
  }, [language])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const detectCrisis = (message: string): boolean => {
    const crisisKeywords = [
      "suicide",
      "kill myself",
      "end it all",
      "don't want to live",
      "hurt myself",
      "आत्महत्या",
      "खुद को मार",
      "जीना नहीं चाहता",
      "खुद को नुकसान",
    ]
    return crisisKeywords.some((keyword) => message.toLowerCase().includes(keyword))
  }

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    // Crisis detection
    if (detectCrisis(userMessage)) {
      setShowCrisisAlert(true)
      return language === "en"
        ? "I'm very concerned about what you've shared. Your life has value and there are people who want to help. Please consider reaching out to a crisis counselor immediately."
        : "आपने जो साझा किया है उससे मैं बहुत चिंतित हूं। आपके जीवन का मूल्य है और ऐसे लोग हैं जो मदद करना चाहते हैं। कृपया तुरंत किसी संकट काउंसलर से संपर्क करने पर विचार करें।"
    }

    // Anxiety responses
    if (lowerMessage.includes("anxious") || lowerMessage.includes("anxiety") || lowerMessage.includes("चिंता")) {
      return language === "en"
        ? "I understand you're feeling anxious. Try this breathing exercise: Breathe in for 4 counts, hold for 4, breathe out for 6. Repeat 3 times. What's making you feel anxious right now?"
        : "मैं समझता हूं कि आप चिंतित महसूस कर रहे हैं। इस सांस लेने का अभ्यास करें: 4 गिनती के लिए सांस लें, 4 के लिए रोकें, 6 के लिए सांस छोड़ें। 3 बार दोहराएं। अभी आपको क्या चिंतित कर रहा है?"
    }

    // Depression responses
    if (lowerMessage.includes("depressed") || lowerMessage.includes("sad") || lowerMessage.includes("उदास")) {
      return language === "en"
        ? "I hear that you're feeling down. These feelings are valid and you're not alone. Sometimes talking about what's bothering you can help. What's been weighing on your mind lately?"
        : "मैं सुन रहा हूं कि आप उदास महसूस कर रहे हैं। ये भावनाएं वैध हैं और आप अकेले नहीं हैं। कभी-कभी जो आपको परेशान कर रहा है उसके बारे में बात करना मदद कर सकता है। हाल ही में आपके मन में क्या बात है?"
    }

    // Stress responses
    if (lowerMessage.includes("stress") || lowerMessage.includes("overwhelmed") || lowerMessage.includes("तनाव")) {
      return language === "en"
        ? "Stress can feel overwhelming, but you can manage it. Try breaking down your tasks into smaller steps. What's the most pressing thing you need to handle right now?"
        : "तनाव भारी लग सकता है, लेकिन आप इसे संभाल सकते हैं। अपने कार्यों को छोटे चरणों में बांटने की कोशिश करें। अभी आपको सबसे जरूरी क्या संभालना है?"
    }

    // Sleep issues
    if (lowerMessage.includes("sleep") || lowerMessage.includes("insomnia") || lowerMessage.includes("नींद")) {
      return language === "en"
        ? "Sleep issues can really affect your mood and energy. Try establishing a bedtime routine: no screens 1 hour before bed, keep your room cool and dark. How many hours of sleep are you getting?"
        : "नींद की समस्याएं वास्तव में आपके मूड और ऊर्जा को प्रभावित कर सकती हैं। सोने का एक नियम बनाने की कोशिश करें: सोने से 1 घंटे पहले कोई स्क्रीन नहीं, अपने कमरे को ठंडा और अंधेरा रखें। आप कितने घंटे सो रहे हैं?"
    }

    // General supportive responses
    const supportiveResponses = {
      en: [
        "Thank you for sharing that with me. Your feelings are important and valid. Can you tell me more about what you're experiencing?",
        "I'm here to listen and support you. It takes courage to reach out. What would be most helpful for you right now?",
        "That sounds challenging. You're taking a positive step by talking about it. How long have you been feeling this way?",
        "I appreciate you trusting me with this. Remember that seeking help is a sign of strength. What coping strategies have you tried before?",
      ],
      hi: [
        "मेरे साथ साझा करने के लिए धन्यवाद। आपकी भावनाएं महत्वपूर्ण और वैध हैं। क्या आप मुझे बता सकते हैं कि आप क्या अनुभव कर रहे हैं?",
        "मैं सुनने और आपका समर्थन करने के लिए यहां हूं। संपर्क करने में साहस लगता है। अभी आपके लिए सबसे मददगार क्या होगा?",
        "यह चुनौतीपूर्ण लगता है। इसके बारे में बात करके आप एक सकारात्मक कदम उठा रहे हैं। आप कब से ऐसा महसूस कर रहे हैं?",
        "मुझ पर भरोसा करने के लिए मैं आपकी सराहना करता हूं। याद रखें कि मदद मांगना ताकत का संकेत है। आपने पहले कौन सी मुकाबला रणनीतियां आजमाई हैं?",
      ],
    }

    const responses = supportiveResponses[language]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    // Simulate typing delay
    setTimeout(
      () => {
        const botResponse: Message = {
          id: `bot-${Date.now()}`,
          type: "bot",
          content: generateBotResponse(inputMessage),
          timestamp: new Date(),
          crisis: detectCrisis(inputMessage),
        }

        setMessages((prev) => [...prev, botResponse])
        setIsTyping(false)
      },
      1000 + Math.random() * 2000,
    )
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const quickResponses = {
    en: [
      "I'm feeling anxious",
      "I can't sleep",
      "I'm stressed about exams",
      "I feel overwhelmed",
      "I need someone to talk to",
    ],
    hi: [
      "मैं चिंतित महसूस कर रहा हूं",
      "मुझे नींद नहीं आ रही",
      "मैं परीक्षाओं को लेकर तनावग्रस्त हूं",
      "मैं अभिभूत महसूस करता हूं",
      "मुझे किसी से बात करने की जरूरत है",
    ],
  }

  if (showCrisisAlert) {
    return (
      <AuthGuard requiredRole="student">
        <DashboardLayout>
          <div className="max-w-md mx-auto mt-8">
            <CrisisAlert
              severity="critical"
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

  return (
    <AuthGuard requiredRole="student">
      <DashboardLayout>
        <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col">
          {/* Header */}
          <Card className="mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                {language === "en" ? "AI Mental Health Assistant" : "AI मानसिक स्वास्थ्य सहायक"}
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {language === "en" ? "Online" : "ऑनलाइन"}
                </Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {language === "en"
                  ? "Available 24/7 • Confidential • Crisis support available"
                  : "24/7 उपलब्ध • गोपनीय • संकट सहायता उपलब्ध"}
              </p>
            </CardHeader>
          </Card>

          {/* Messages */}
          <Card className="flex-1 flex flex-col">
            <CardContent className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === "user"
                        ? "bg-primary text-primary-foreground"
                        : message.crisis
                          ? "bg-red-50 border border-red-200 text-red-900"
                          : "bg-muted"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.type === "bot" && (
                        <div className="shrink-0">
                          {message.crisis ? (
                            <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                          ) : (
                            <Bot className="h-4 w-4 text-primary mt-0.5" />
                          )}
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                      {message.type === "user" && <User className="h-4 w-4 mt-0.5 shrink-0" />}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3 flex items-center gap-2">
                    <Bot className="h-4 w-4 text-primary" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </CardContent>

            {/* Quick Responses */}
            {messages.length <= 1 && (
              <div className="p-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">
                  {language === "en" ? "Quick responses:" : "त्वरित प्रतिक्रियाएं:"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {quickResponses[language].map((response, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setInputMessage(response)}
                      className="text-xs bg-transparent"
                    >
                      {response}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    language === "en"
                      ? "Type your message... Press Enter to send"
                      : "अपना संदेश टाइप करें... भेजने के लिए Enter दबाएं"
                  }
                  disabled={isTyping}
                  className="flex-1"
                />
                <Button onClick={sendMessage} disabled={!inputMessage.trim() || isTyping}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Crisis Hotline */}
          <Card className="mt-4 bg-red-50 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-red-600" />
                <div className="flex-1">
                  <p className="font-medium text-red-900">{language === "en" ? "Crisis Support" : "संकट सहायता"}</p>
                  <p className="text-sm text-red-800">
                    {language === "en" ? "If you're in immediate danger, call:" : "यदि आप तत्काल खतरे में हैं, तो कॉल करें:"}{" "}
                    {CRISIS_HOTLINES[language].national}
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
