"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { MessageCircle, Send, Bot, User, AlertTriangle, Phone } from "lucide-react"
import { getCurrentLanguage } from "@/lib/i18n"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  type?: "crisis" | "normal"
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        getCurrentLanguage() === "en"
          ? "Hello! I'm your mental health support assistant. I'm here to listen and provide guidance. How are you feeling today?"
          : "नमस्ते! मैं आपका मानसिक स्वास्थ्य सहायक हूं। मैं यहां सुनने और मार्गदर्शन प्रदान करने के लिए हूं। आज आप कैसा महसूस कर रहे हैं?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const language = getCurrentLanguage()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Crisis keywords detection
  const crisisKeywords = [
    "suicide",
    "kill myself",
    "end it all",
    "hurt myself",
    "die",
    "death",
    "आत्महत्या",
    "खुद को मारना",
    "मरना",
    "दुख",
    "अंत",
  ]

  const detectCrisis = (message: string): boolean => {
    return crisisKeywords.some((keyword) => message.toLowerCase().includes(keyword.toLowerCase()))
  }

  // Mock responses based on message content
  const generateResponse = (userMessage: string): string => {
    const isCrisis = detectCrisis(userMessage)

    if (isCrisis) {
      return language === "en"
        ? "I'm very concerned about what you've shared. Please know that you're not alone and help is available. I strongly encourage you to reach out to a crisis helpline immediately: National Suicide Prevention Lifeline: 988. Would you like me to help you find local emergency resources?"
        : "मैं आपकी बात से बहुत चिंतित हूं। कृपया जानें कि आप अकेले नहीं हैं और सहायता उपलब्ध है। मैं आपसे तुरंत क्राइसिस हेल्पलाइन से संपर्क करने का आग्रह करता हूं। क्या आप चाहते हैं कि मैं आपको स्थानीय आपातकालीन संसाधन खोजने में मदद करूं?"
    }

    // Simple keyword-based responses
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes("anxious") || lowerMessage.includes("anxiety") || lowerMessage.includes("चिंता")) {
      return language === "en"
        ? "I understand you're feeling anxious. Anxiety is very common among students. Try some deep breathing exercises: breathe in for 4 counts, hold for 4, breathe out for 4. Would you like to talk about what's making you feel anxious?"
        : "मैं समझता हूं कि आप चिंतित महसूस कर रहे हैं। छात्रों में चिंता बहुत आम है। कुछ गहरी सांस लेने के व्यायाम करें: 4 गिनती के लिए सांस लें, 4 के लिए रोकें, 4 के लिए सांस छोड़ें। क्या आप इस बारे में बात करना चाहते हैं कि आपको क्या चिंतित कर रहा है?"
    }

    if (lowerMessage.includes("stressed") || lowerMessage.includes("stress") || lowerMessage.includes("तनाव")) {
      return language === "en"
        ? "Stress is a normal part of student life, but it's important to manage it well. Consider breaking large tasks into smaller ones, taking regular breaks, and practicing self-care. What's causing you the most stress right now?"
        : "तनाव छात्र जीवन का एक सामान्य हिस्सा है, लेकिन इसे अच्छी तरह से प्रबंधित करना महत्वपूर्ण है। बड़े कार्यों को छोटे भागों में बांटने, नियमित ब्रेक लेने और स्व-देखभाल का अभ्यास करने पर विचार करें। अभी आपको सबसे ज्यादा तनाव किस बात का है?"
    }

    if (lowerMessage.includes("sad") || lowerMessage.includes("depressed") || lowerMessage.includes("उदास")) {
      return language === "en"
        ? "I'm sorry you're feeling this way. It's okay to feel sad sometimes, and it's brave of you to reach out. Remember that these feelings are temporary. Have you been able to talk to friends, family, or a counselor about how you're feeling?"
        : "मुझे खुशी है कि आपने इस बारे में बात की। कभी-कभी उदास महसूस करना ठीक है, और मदद मांगना बहादुरी की बात है। याद रखें कि ये भावनाएं अस्थायी हैं। क्या आप अपने दोस्तों, परिवार या किसी काउंसलर से अपनी भावनाओं के बारे में बात कर पाए हैं?"
    }

    // Default responses
    const defaultResponses =
      language === "en"
        ? [
            "Thank you for sharing that with me. Can you tell me more about how you're feeling?",
            "I'm here to listen. What would be most helpful for you right now?",
            "That sounds challenging. How has this been affecting your daily life?",
            "I appreciate you opening up. What support do you feel you need most?",
          ]
        : [
            "मुझसे यह साझा करने के लिए धन्यवाद। क्या आप मुझे बता सकते हैं कि आप कैसा महसूस कर रहे हैं?",
            "मैं यहां सुनने के लिए हूं। अभी आपके लिए सबसे मददगार क्या होगा?",
            "यह चुनौतीपूर्ण लगता है। इसका आपके दैनिक जीवन पर क्या प्रभाव पड़ा है?",
            "मैं आपके खुलेपन की सराहना करता हूं। आपको लगता है कि आपको सबसे ज्यादा किस सहायता की जरूरत है?",
          ]

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages.map((m) => ({ sender: m.sender, content: m.content })),
          language,
        }),
      })
      if (!res.ok) {
        throw new Error(`API error ${res.status}`)
      }
      const data = await res.json()

      const replyText = data?.reply || generateResponse(userMessage.content)
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: replyText,
        sender: "bot",
        timestamp: new Date(),
        type: detectCrisis(userMessage.content) ? "crisis" : "normal",
      }
      setMessages((prev) => [...prev, botResponse])
    } catch (e) {
      const fallback: Message = {
        id: (Date.now() + 2).toString(),
        content:
          language === "en"
            ? "Sorry, I’m having trouble responding right now. Please try again."
            : "क्षमा करें, मैं अभी जवाब देने में असमर्थ हूं। कृपया दोबारा प्रयास करें।",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, fallback])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <MessageCircle className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">
              {language === "en" ? "Mental Health Chatbot" : "मानसिक स्वास्थ्य चैटबॉट"}
            </h1>
          </div>
          <p className="text-muted-foreground">
            {language === "en"
              ? "24/7 AI-powered mental health support and guidance"
              : "24/7 AI-संचालित मानसिक स्वास्थ्य सहायता और मार्गदर्शन"}
          </p>
        </div>

        {/* Crisis Disclaimer */}
        <Alert className="border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>{language === "en" ? "Important:" : "महत्वपूर्ण:"}</strong>{" "}
            {language === "en"
              ? "This chatbot is not a replacement for professional help. If you're in crisis, please contact emergency services immediately or call a crisis helpline."
              : "यह चैटबॉट पेशेवर सहायता का विकल्प नहीं है। यदि आप संकट में हैं, तो कृपया तुरंत आपातकालीन सेवाओं से संपर्क करें या क्राइसिस हेल्पलाइन पर कॉल करें।"}
          </AlertDescription>
        </Alert>

        {/* Chat Interface */}
        <Card className="h-[600px] flex flex-col">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              {language === "en" ? "Chat with AI Assistant" : "AI असिस्टेंट के साथ चैट करें"}
              <Badge variant="secondary" className="ml-auto">
                {language === "en" ? "Online" : "ऑनलाइन"}
              </Badge>
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-w-0">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 items-start w-full`}
                >
                  {message.sender === "bot" && (
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <Bot className="h-4 w-4 text-primary-foreground" />
                      </div>
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] w-fit rounded-lg p-3 ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground ml-auto"
                        : message.type === "crisis"
                          ? "bg-red-50 border border-red-200 text-red-900"
                          : "bg-muted"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words break-all [overflow-wrap:anywhere]">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>

                  {message.sender === "user" && (
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onKeyDown={handleKeyDown}
                  placeholder={language === "en" ? "Type your message..." : "अपना संदेश टाइप करें..."}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={isLoading || !inputMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Resources */}
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Phone className="h-4 w-4 text-red-600" />
              <h3 className="font-semibold text-red-900">
                {language === "en" ? "Emergency Resources" : "आपातकालीन संसाधन"}
              </h3>
            </div>
            <div className="text-sm text-red-800 space-y-1">
              <p>
                <strong>{language === "en" ? "Crisis Helpline:" : "क्राइसिस हेल्पलाइन:"}</strong> 14416
              </p>
              <p>
                <strong>{language === "en" ? "Emergency:" : "आपातकाल:"}</strong> 112
              </p>
              <p>
                <strong>{language === "en" ? "Campus Counseling:" : "कैंपस काउंसलिंग:"}</strong> Available 24/7
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
