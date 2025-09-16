"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/ui/auth-guard"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Plus, Search, Flag, Lock, Heart } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { getCurrentLanguage } from "@/lib/i18n"
import type { JournalEntry } from "@/lib/types"

export default function JournalingPage() {
  const [user, setUser] = useState(getCurrentUser())
  const [language, setCurrentLanguage] = useState(getCurrentLanguage())
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([])
  const [showNewEntry, setShowNewEntry] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPrompt, setSelectedPrompt] = useState("")

  const [newEntry, setNewEntry] = useState({
    title: "",
    content: "",
    flagForCounselor: false,
    isEncrypted: true,
  })

  useEffect(() => {
    setCurrentLanguage(getCurrentLanguage())
    loadJournalEntries()
  }, [])

  const loadJournalEntries = () => {
    const entries = JSON.parse(localStorage.getItem(`journal-${user?.id}`) || "[]")
    setJournalEntries(entries)
  }

  const saveJournalEntry = () => {
    if (!newEntry.title.trim() || !newEntry.content.trim()) {
      alert(language === "en" ? "Please fill in both title and content" : "कृपया शीर्षक और सामग्री दोनों भरें")
      return
    }

    const entry: JournalEntry = {
      id: `journal-${Date.now()}`,
      userId: user?.id || "",
      title: newEntry.title,
      content: newEntry.content,
      sentiment: analyzeSentiment(newEntry.content),
      flagForCounselor: newEntry.flagForCounselor,
      isEncrypted: newEntry.isEncrypted,
      createdAt: new Date(),
    }

    const updatedEntries = [entry, ...journalEntries]
    setJournalEntries(updatedEntries)
    localStorage.setItem(`journal-${user?.id}`, JSON.stringify(updatedEntries))

    // Reset form
    setNewEntry({
      title: "",
      content: "",
      flagForCounselor: false,
      isEncrypted: true,
    })
    setShowNewEntry(false)
    setSelectedPrompt("")

    // Award points
    const currentProgress = JSON.parse(localStorage.getItem(`progress-${user?.id}`) || "{}")
    const newProgress = {
      ...currentProgress,
      totalPoints: (currentProgress.totalPoints || 0) + 15,
    }
    localStorage.setItem(`progress-${user?.id}`, JSON.stringify(newProgress))

    alert(language === "en" ? "Journal entry saved!" : "जर्नल एंट्री सेव हो गई!")
  }

  const analyzeSentiment = (content: string): "positive" | "neutral" | "negative" => {
    // Simple sentiment analysis - in real app, use proper NLP
    const positiveWords = ["happy", "good", "great", "amazing", "wonderful", "excited", "grateful", "blessed"]
    const negativeWords = ["sad", "bad", "terrible", "awful", "depressed", "anxious", "worried", "stressed"]

    const words = content.toLowerCase().split(/\s+/)
    const positiveCount = words.filter((word) => positiveWords.includes(word)).length
    const negativeCount = words.filter((word) => negativeWords.includes(word)).length

    if (positiveCount > negativeCount) return "positive"
    if (negativeCount > positiveCount) return "negative"
    return "neutral"
  }

  const journalPrompts = {
    en: [
      "What am I grateful for today?",
      "What challenges did I overcome this week?",
      "How do I want to grow as a person?",
      "What made me smile today?",
      "What are my goals for tomorrow?",
      "How am I taking care of my mental health?",
      "What did I learn about myself recently?",
      "What relationships am I nurturing?",
    ],
    hi: [
      "आज मैं किस बात के लिए आभारी हूं?",
      "इस सप्ताह मैंने कौन सी चुनौतियों पर काबू पाया?",
      "मैं एक व्यक्ति के रूप में कैसे बढ़ना चाहता हूं?",
      "आज मुझे किस बात ने मुस्कराया?",
      "कल के लिए मेरे लक्ष्य क्या हैं?",
      "मैं अपने मानसिक स्वास्थ्य की देखभाल कैसे कर रहा हूं?",
      "मैंने हाल ही में अपने बारे में क्या सीखा?",
      "मैं कौन से रिश्तों का पोषण कर रहा हूं?",
    ],
  }

  const filteredEntries = journalEntries.filter(
    (entry) =>
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-100 text-green-800"
      case "negative":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "😊"
      case "negative":
        return "😔"
      default:
        return "😐"
    }
  }

  return (
    <AuthGuard requiredRole="student">
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{language === "en" ? "Journaling" : "जर्नलिंग"}</h1>
              <p className="text-muted-foreground">
                {language === "en"
                  ? "Express your thoughts and feelings in a safe, private space"
                  : "अपने विचारों और भावनाओं को एक सुरक्षित, निजी स्थान में व्यक्त करें"}
              </p>
            </div>

            <Button onClick={() => setShowNewEntry(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {language === "en" ? "New Entry" : "नई एंट्री"}
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{language === "en" ? "Total Entries" : "कुल एंट्रीज"}</p>
                    <p className="text-2xl font-bold">{journalEntries.length}</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{language === "en" ? "This Month" : "इस महीने"}</p>
                    <p className="text-2xl font-bold">
                      {
                        journalEntries.filter(
                          (entry) =>
                            new Date(entry.createdAt).getMonth() === new Date().getMonth() &&
                            new Date(entry.createdAt).getFullYear() === new Date().getFullYear(),
                        ).length
                      }
                    </p>
                  </div>
                  <Heart className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === "en" ? "Flagged for Review" : "समीक्षा के लिए फ्लैग किए गए"}
                    </p>
                    <p className="text-2xl font-bold">
                      {journalEntries.filter((entry) => entry.flagForCounselor).length}
                    </p>
                  </div>
                  <Flag className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* New Entry Form */}
          {showNewEntry && (
            <Card>
              <CardHeader>
                <CardTitle>{language === "en" ? "New Journal Entry" : "नई जर्नल एंट्री"}</CardTitle>
                <CardDescription>
                  {language === "en"
                    ? "Write about your thoughts, feelings, or experiences"
                    : "अपने विचारों, भावनाओं या अनुभवों के बारे में लिखें"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Guided Prompts */}
                <div className="space-y-2">
                  <Label>
                    {language === "en"
                      ? "Need inspiration? Try a guided prompt:"
                      : "प्रेरणा चाहिए? एक निर्देशित प्रॉम्प्ट आज़माएं:"}
                  </Label>
                  <Select value={selectedPrompt} onValueChange={setSelectedPrompt}>
                    <SelectTrigger>
                      <SelectValue placeholder={language === "en" ? "Choose a prompt..." : "एक प्रॉम्प्ट चुनें..."} />
                    </SelectTrigger>
                    <SelectContent>
                      {journalPrompts[language].map((prompt, index) => (
                        <SelectItem key={index} value={prompt}>
                          {prompt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">{language === "en" ? "Title" : "शीर्षक"}</Label>
                  <Input
                    id="title"
                    value={newEntry.title}
                    onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                    placeholder={
                      selectedPrompt ||
                      (language === "en" ? "Give your entry a title..." : "अपनी एंट्री को एक शीर्षक दें...")
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">{language === "en" ? "Content" : "सामग्री"}</Label>
                  <Textarea
                    id="content"
                    value={newEntry.content}
                    onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                    placeholder={
                      language === "en"
                        ? "Write your thoughts here... This is your safe space."
                        : "यहाँ अपने विचार लिखें... यह आपका सुरक्षित स्थान है।"
                    }
                    className="min-h-[200px]"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="encrypt"
                      checked={newEntry.isEncrypted}
                      onCheckedChange={(checked) => setNewEntry({ ...newEntry, isEncrypted: checked })}
                    />
                    <Label htmlFor="encrypt" className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      {language === "en" ? "Encrypt entry" : "एंट्री को एन्क्रिप्ट करें"}
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="flag"
                      checked={newEntry.flagForCounselor}
                      onCheckedChange={(checked) => setNewEntry({ ...newEntry, flagForCounselor: checked })}
                    />
                    <Label htmlFor="flag" className="flex items-center gap-2">
                      <Flag className="h-4 w-4" />
                      {language === "en" ? "Share with counselor" : "काउंसलर के साथ साझा करें"}
                    </Label>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={saveJournalEntry} className="flex-1">
                    {language === "en" ? "Save Entry" : "एंट्री सेव करें"}
                  </Button>
                  <Button variant="outline" onClick={() => setShowNewEntry(false)} className="bg-transparent">
                    {language === "en" ? "Cancel" : "रद्द करें"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={language === "en" ? "Search your entries..." : "अपनी एंट्रीज खोजें..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Journal Entries */}
          <div className="space-y-4">
            {filteredEntries.map((entry) => (
              <Card key={entry.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{entry.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      {entry.isEncrypted && <Lock className="h-4 w-4 text-muted-foreground" />}
                      {entry.flagForCounselor && <Flag className="h-4 w-4 text-orange-500" />}
                      <Badge variant="outline" className={getSentimentColor(entry.sentiment)}>
                        {getSentimentIcon(entry.sentiment)} {entry.sentiment}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription>
                    {new Date(entry.createdAt).toLocaleDateString(language === "hi" ? "hi-IN" : "en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed line-clamp-3">{entry.content}</p>
                </CardContent>
              </Card>
            ))}

            {filteredEntries.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    {language === "en" ? "No journal entries yet" : "अभी तक कोई जर्नल एंट्री नहीं"}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {language === "en"
                      ? "Start your journaling journey today. Writing helps process emotions and track personal growth."
                      : "आज अपनी जर्नलिंग यात्रा शुरू करें। लेखन भावनाओं को संसाधित करने और व्यक्तिगत विकास को ट्रैक करने में मदद करता है।"}
                  </p>
                  <Button onClick={() => setShowNewEntry(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    {language === "en" ? "Write First Entry" : "पहली एंट्री लिखें"}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
