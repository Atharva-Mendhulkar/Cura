// Core types for Student Support Hub

export type UserRole = "student" | "counselor" | "admin"

export type Language = "en" | "hi"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  campus: string
  language: Language
  createdAt: Date
  lastActive: Date
}

export interface MoodEntry {
  id: string
  userId: string
  mood: number // 1-5 scale
  emoji: string
  note?: string
  voiceNote?: string
  timestamp: Date
  isPrivate: boolean
}

export interface JournalEntry {
  id: string
  userId: string
  title: string
  content: string
  sentiment: "positive" | "neutral" | "negative"
  flagForCounselor: boolean
  isEncrypted: boolean
  createdAt: Date
}

export interface QuizResult {
  id: string
  userId: string
  quizType: "PHQ-9" | "GAD-7" | "Sleep-Index"
  score: number
  severity: "minimal" | "mild" | "moderate" | "severe"
  responses: Record<string, number>
  completedAt: Date
  escalationTriggered: boolean
}

export interface Appointment {
  id: string
  studentId: string
  counselorId: string
  scheduledAt: Date
  duration: number // minutes
  status: "scheduled" | "completed" | "cancelled" | "no-show"
  notes?: string
  isEncrypted: boolean
  reminderSent: boolean
}

export interface ForumThread {
  id: string
  authorId: string
  title: string
  content: string
  isAnonymous: boolean
  category: string
  replies: ForumReply[]
  upvotes: number
  isModerated: boolean
  createdAt: Date
}

export interface ForumReply {
  id: string
  threadId: string
  authorId: string
  content: string
  isAnonymous: boolean
  upvotes: number
  createdAt: Date
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  pointsRequired: number
  category: "mood" | "journal" | "quiz" | "peer" | "academic"
}

export interface UserProgress {
  userId: string
  totalPoints: number
  currentStreak: number
  longestStreak: number
  badges: Badge[]
  level: number
}

export interface StudyTask {
  id: string
  userId: string
  title: string
  description: string
  dueDate: Date
  priority: "low" | "medium" | "high"
  completed: boolean
  pomodoroSessions: number
  estimatedTime: number // minutes
}

export interface CrisisAlert {
  id: string
  userId: string
  triggerType: "quiz" | "journal" | "chat"
  severity: "moderate" | "high" | "critical"
  content: string
  resolved: boolean
  counselorNotified: boolean
  createdAt: Date
}
