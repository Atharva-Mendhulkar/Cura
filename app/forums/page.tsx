"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/ui/auth-guard"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Users, Plus, Search, MessageSquare, ThumbsUp, Flag, Shield, Eye, Clock, TrendingUp, Heart } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { getCurrentLanguage } from "@/lib/i18n"
import type { ForumThread } from "@/lib/types"

export default function ForumsPage() {
  const [user, setUser] = useState(getCurrentUser())
  const [language, setCurrentLanguage] = useState(getCurrentLanguage())
  const [threads, setThreads] = useState<ForumThread[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showNewThreadModal, setShowNewThreadModal] = useState(false)
  const [newThread, setNewThread] = useState({
    title: "",
    content: "",
    category: "",
    isAnonymous: false,
  })

  useEffect(() => {
    setCurrentLanguage(getCurrentLanguage())
    loadForumThreads()
  }, [])

  const loadForumThreads = () => {
    // Load existing threads or create mock data
    const savedThreads = JSON.parse(localStorage.getItem("forum-threads") || "[]")
    if (savedThreads.length === 0) {
      const mockThreads: ForumThread[] = [
        {
          id: "thread-1",
          authorId: "user-123",
          title: language === "en" ? "Dealing with exam anxiety" : "परीक्षा की चिंता से निपटना",
          content:
            language === "en"
              ? "I've been feeling really anxious about my upcoming exams. Any tips on how to manage this stress?"
              : "मैं अपनी आगामी परीक्षाओं को लेकर वास्तव में चिंतित महसूस कर रहा हूं। इस तनाव को प्रबंधित करने के लिए कोई सुझाव?",
          isAnonymous: false,
          category: "Academic Stress",
          replies: [
            {
              id: "reply-1",
              threadId: "thread-1",
              authorId: "user-456",
              content:
                language === "en"
                  ? "I found that breaking study sessions into smaller chunks really helped me. Also, deep breathing exercises before exams work wonders!"
                  : "मैंने पाया कि अध्ययन सत्रों को छोटे हिस्सों में बांटना वास्तव में मेरी मदद करता है। साथ ही, परीक्षा से पहले गहरी सांस लेने के व्यायाम चमत्कार करते हैं!",
              isAnonymous: false,
              upvotes: 5,
              createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
            },
          ],
          upvotes: 8,
          isModerated: false,
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        },
        {
          id: "thread-2",
          authorId: "anonymous",
          title: language === "en" ? "Feeling lonely on campus" : "कैंपस में अकेलापन महसूस करना",
          content:
            language === "en"
              ? "I'm having trouble making friends and feel isolated. How do others cope with loneliness?"
              : "मुझे दोस्त बनाने में परेशानी हो रही है और मैं अलग-थलग महसूस कर रहा हूं। दूसरे अकेलेपन से कैसे निपटते हैं?",
          isAnonymous: true,
          category: "Social Support",
          replies: [],
          upvotes: 12,
          isModerated: false,
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        },
      ]
      setThreads(mockThreads)
      localStorage.setItem("forum-threads", JSON.stringify(mockThreads))
    } else {
      setThreads(savedThreads)
    }
  }

  const categories = [
    { value: "all", label: language === "en" ? "All Categories" : "सभी श्रेणियां" },
    { value: "Academic Stress", label: language === "en" ? "Academic Stress" : "शैक्षणिक तनाव" },
    { value: "Social Support", label: language === "en" ? "Social Support" : "सामाजिक सहायता" },
    { value: "Mental Health", label: language === "en" ? "Mental Health" : "मानसिक स्वास्थ्य" },
    { value: "Career Guidance", label: language === "en" ? "Career Guidance" : "करियर मार्गदर्शन" },
    { value: "Relationships", label: language === "en" ? "Relationships" : "रिश्ते" },
    { value: "General", label: language === "en" ? "General" : "सामान्य" },
  ]

  const createThread = () => {
    if (!newThread.title.trim() || !newThread.content.trim() || !newThread.category) {
      alert(language === "en" ? "Please fill all required fields" : "कृपया सभी आवश्यक फ़ील्ड भरें")
      return
    }

    const thread: ForumThread = {
      id: `thread-${Date.now()}`,
      authorId: newThread.isAnonymous ? "anonymous" : user?.id || "",
      title: newThread.title,
      content: newThread.content,
      isAnonymous: newThread.isAnonymous,
      category: newThread.category,
      replies: [],
      upvotes: 0,
      isModerated: false,
      createdAt: new Date(),
    }

    const updatedThreads = [thread, ...threads]
    setThreads(updatedThreads)
    localStorage.setItem("forum-threads", JSON.stringify(updatedThreads))

    // Award points
    const currentProgress = JSON.parse(localStorage.getItem(`progress-${user?.id}`) || "{}")
    const newProgress = {
      ...currentProgress,
      totalPoints: (currentProgress.totalPoints || 0) + 20,
    }
    localStorage.setItem(`progress-${user?.id}`, JSON.stringify(newProgress))

    // Reset form
    setNewThread({
      title: "",
      content: "",
      category: "",
      isAnonymous: false,
    })
    setShowNewThreadModal(false)

    alert(language === "en" ? "Thread created successfully!" : "थ्रेड सफलतापूर्वक बनाया गया!")
  }

  const upvoteThread = (threadId: string) => {
    const updatedThreads = threads.map((thread) =>
      thread.id === threadId ? { ...thread, upvotes: thread.upvotes + 1 } : thread,
    )
    setThreads(updatedThreads)
    localStorage.setItem("forum-threads", JSON.stringify(updatedThreads))
  }

  const filteredThreads = threads.filter((thread) => {
    const matchesSearch =
      thread.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      thread.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || thread.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getAuthorName = (authorId: string, isAnonymous: boolean) => {
    if (isAnonymous) return language === "en" ? "Anonymous" : "गुमनाम"
    if (authorId === user?.id) return language === "en" ? "You" : "आप"
    return language === "en" ? "Student" : "छात्र"
  }

  const getTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return language === "en" ? "Just now" : "अभी"
    if (diffInHours < 24) return `${diffInHours}${language === "en" ? "h ago" : " घंटे पहले"}`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}${language === "en" ? "d ago" : " दिन पहले"}`
  }

  return (
    <AuthGuard requiredRole="student">
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{language === "en" ? "Peer Support Forums" : "सहकर्मी सहायता फोरम"}</h1>
              <p className="text-muted-foreground">
                {language === "en"
                  ? "Connect with fellow students and share experiences in a safe, moderated environment"
                  : "साथी छात्रों से जुड़ें और एक सुरक्षित, मॉडरेटेड वातावरण में अनुभव साझा करें"}
              </p>
            </div>

            <Button onClick={() => setShowNewThreadModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {language === "en" ? "New Thread" : "नया थ्रेड"}
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{language === "en" ? "Total Threads" : "कुल थ्रेड"}</p>
                    <p className="text-2xl font-bold">{threads.length}</p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{language === "en" ? "Active Today" : "आज सक्रिय"}</p>
                    <p className="text-2xl font-bold">
                      {
                        threads.filter(
                          (thread) =>
                            new Date(thread.createdAt).toDateString() === new Date().toDateString() ||
                            thread.replies.some(
                              (reply) => new Date(reply.createdAt).toDateString() === new Date().toDateString(),
                            ),
                        ).length
                      }
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{language === "en" ? "Your Posts" : "आपकी पोस्ट"}</p>
                    <p className="text-2xl font-bold">
                      {threads.filter((thread) => thread.authorId === user?.id).length}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{language === "en" ? "Helpful Votes" : "सहायक वोट"}</p>
                    <p className="text-2xl font-bold">
                      {threads
                        .filter((thread) => thread.authorId === user?.id)
                        .reduce((sum, thread) => sum + thread.upvotes, 0)}
                    </p>
                  </div>
                  <Heart className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={language === "en" ? "Search discussions..." : "चर्चाओं में खोजें..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Forum Guidelines */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="space-y-2">
                  <h3 className="font-medium text-blue-900">
                    {language === "en" ? "Community Guidelines" : "समुदायिक दिशानिर्देश"}
                  </h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• {language === "en" ? "Be respectful and supportive" : "सम्मानजनक और सहायक बनें"}</li>
                    <li>
                      • {language === "en" ? "No personal attacks or harassment" : "कोई व्यक्तिगत हमला या उत्पीड़न नहीं"}
                    </li>
                    <li>
                      • {language === "en" ? "Keep discussions relevant and helpful" : "चर्चाओं को प्रासंगिक और सहायक रखें"}
                    </li>
                    <li>• {language === "en" ? "Report inappropriate content" : "अनुचित सामग्री की रिपोर्ट करें"}</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Forum Threads */}
          <div className="space-y-4">
            {filteredThreads.map((thread) => (
              <Card key={thread.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Thread Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{thread.category}</Badge>
                          {thread.isAnonymous && (
                            <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                              <Eye className="h-3 w-3 mr-1" />
                              {language === "en" ? "Anonymous" : "गुमनाम"}
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{thread.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{thread.content}</p>
                      </div>
                    </div>

                    {/* Thread Footer */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                              {thread.isAnonymous ? "?" : getAuthorName(thread.authorId, thread.isAnonymous).charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground">
                            {getAuthorName(thread.authorId, thread.isAnonymous)}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {getTimeAgo(thread.createdAt)}
                        </div>

                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MessageSquare className="h-3 w-3" />
                          {thread.replies.length} {language === "en" ? "replies" : "उत्तर"}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => upvoteThread(thread.id)}
                          className="flex items-center gap-1"
                        >
                          <ThumbsUp className="h-4 w-4" />
                          {thread.upvotes}
                        </Button>

                        <Button variant="ghost" size="sm">
                          <Flag className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Recent Replies */}
                    {thread.replies.length > 0 && (
                      <div className="pl-4 border-l-2 border-muted space-y-3">
                        {thread.replies.slice(-2).map((reply) => (
                          <div key={reply.id} className="bg-muted/50 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <Avatar className="h-5 w-5">
                                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                  {reply.isAnonymous ? "?" : "S"}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium">
                                {getAuthorName(reply.authorId, reply.isAnonymous)}
                              </span>
                              <span className="text-xs text-muted-foreground">{getTimeAgo(reply.createdAt)}</span>
                            </div>
                            <p className="text-sm leading-relaxed">{reply.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredThreads.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    {language === "en" ? "No discussions found" : "कोई चर्चा नहीं मिली"}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {language === "en"
                      ? "Be the first to start a conversation in this community"
                      : "इस समुदाय में बातचीत शुरू करने वाले पहले व्यक्ति बनें"}
                  </p>
                  <Button onClick={() => setShowNewThreadModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    {language === "en" ? "Start Discussion" : "चर्चा शुरू करें"}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* New Thread Modal */}
          <Dialog open={showNewThreadModal} onOpenChange={setShowNewThreadModal}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{language === "en" ? "Start New Discussion" : "नई चर्चा शुरू करें"}</DialogTitle>
                <DialogDescription>
                  {language === "en"
                    ? "Share your thoughts, ask questions, or seek support from the community"
                    : "अपने विचार साझा करें, प्रश्न पूछें, या समुदाय से सहायता मांगें"}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">{language === "en" ? "Title" : "शीर्षक"}</Label>
                  <Input
                    id="title"
                    value={newThread.title}
                    onChange={(e) => setNewThread({ ...newThread, title: e.target.value })}
                    placeholder={
                      language === "en" ? "What would you like to discuss?" : "आप किस बारे में चर्चा करना चाहते हैं?"
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">{language === "en" ? "Category" : "श्रेणी"}</Label>
                  <Select
                    value={newThread.category}
                    onValueChange={(value) => setNewThread({ ...newThread, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={language === "en" ? "Select a category..." : "एक श्रेणी चुनें..."} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.slice(1).map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">{language === "en" ? "Content" : "सामग्री"}</Label>
                  <textarea
                    id="content"
                    value={newThread.content}
                    onChange={(e) => setNewThread({ ...newThread, content: e.target.value })}
                    placeholder={
                      language === "en"
                        ? "Share your thoughts, experiences, or questions..."
                        : "अपने विचार, अनुभव या प्रश्न साझा करें..."
                    }
                    className="w-full min-h-32 p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={newThread.isAnonymous}
                    onChange={(e) => setNewThread({ ...newThread, isAnonymous: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="anonymous" className="text-sm">
                    {language === "en" ? "Post anonymously" : "गुमनाम रूप से पोस्ट करें"}
                  </Label>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setShowNewThreadModal(false)}>
                    {language === "en" ? "Cancel" : "रद्द करें"}
                  </Button>
                  <Button onClick={createThread}>{language === "en" ? "Create Thread" : "थ्रेड बनाएं"}</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
