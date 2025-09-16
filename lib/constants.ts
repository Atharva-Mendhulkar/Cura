// Constants for Student Support Hub

export const CAMPUSES = [
  "IIT Delhi",
  "IIT Bombay",
  "IIT Madras",
  "IIT Kanpur",
  "IIT Kharagpur",
  "BITS Pilani",
  "NIT Trichy",
  "Delhi University",
  "Jawaharlal Nehru University",
  "Other",
] as const

export const MOOD_EMOJIS = [
  { value: 1, emoji: "😢", label: { en: "Very Sad", hi: "बहुत उदास" } },
  { value: 2, emoji: "😔", label: { en: "Sad", hi: "उदास" } },
  { value: 3, emoji: "😐", label: { en: "Neutral", hi: "सामान्य" } },
  { value: 4, emoji: "😊", label: { en: "Happy", hi: "खुश" } },
  { value: 5, emoji: "😄", label: { en: "Very Happy", hi: "बहुत खुश" } },
] as const

export const PHQ9_QUESTIONS = {
  en: [
    "Little interest or pleasure in doing things",
    "Feeling down, depressed, or hopeless",
    "Trouble falling or staying asleep, or sleeping too much",
    "Feeling tired or having little energy",
    "Poor appetite or overeating",
    "Feeling bad about yourself or that you are a failure",
    "Trouble concentrating on things",
    "Moving or speaking slowly, or being fidgety",
    "Thoughts that you would be better off dead",
  ],
  hi: [
    "चीजों में कम रुचि या खुशी महसूस करना",
    "उदास, निराश, या निराशाजनक महसूस करना",
    "सोने में परेशानी या बहुत ज्यादा सोना",
    "थकान या कम ऊर्जा महसूस करना",
    "भूख न लगना या ज्यादा खाना",
    "अपने बारे में बुरा महसूस करना या असफल होने का एहसास",
    "चीजों पर ध्यान केंद्रित करने में परेशानी",
    "धीरे बोलना या बेचैनी महसूस करना",
    "यह सोचना कि आप मर जाएं तो बेहतर होगा",
  ],
} as const

export const GAD7_QUESTIONS = {
  en: [
    "Feeling nervous, anxious, or on edge",
    "Not being able to stop or control worrying",
    "Worrying too much about different things",
    "Trouble relaxing",
    "Being so restless that it is hard to sit still",
    "Becoming easily annoyed or irritable",
    "Feeling afraid, as if something awful might happen",
  ],
  hi: [
    "घबराहट, चिंता, या बेचैनी महसूस करना",
    "चिंता को रोकने या नियंत्रित करने में असमर्थ होना",
    "अलग-अलग चीजों के बारे में बहुत ज्यादा चिंता करना",
    "आराम करने में परेशानी",
    "इतनी बेचैनी कि बैठना मुश्किल हो",
    "आसानी से परेशान या चिड़चिड़ाहट होना",
    "डर लगना, जैसे कुछ भयानक होने वाला हो",
  ],
} as const

export const RESPONSE_OPTIONS = {
  en: ["Not at all", "Several days", "More than half the days", "Nearly every day"],
  hi: ["बिल्कुल नहीं", "कई दिन", "आधे से ज्यादा दिन", "लगभग हर दिन"],
} as const

export const CRISIS_HOTLINES = {
  en: {
    national: "1800-599-0019",
    label: "National Mental Health Helpline",
  },
  hi: {
    national: "1800-599-0019",
    label: "राष्ट्रीय मानसिक स्वास्थ्य हेल्पलाइन",
  },
} as const

export const FEATURE_FLAGS = {
  MOOD_TRACKING: true,
  JOURNALING: true,
  QUIZZES: true,
  APPOINTMENTS: true,
  FORUMS: true,
  STUDY_PLANNER: true,
  CAREER_CORNER: true,
  GAMIFICATION: true,
  VOICE_NOTES: false, // Disabled for MVP
  VIDEO_CALLS: false, // Disabled for MVP
  AI_CHATBOT: true,
} as const

export const POINT_REWARDS = {
  DAILY_MOOD: 10,
  JOURNAL_ENTRY: 15,
  QUIZ_COMPLETION: 25,
  FORUM_POST: 20,
  FORUM_REPLY: 10,
  STUDY_SESSION: 5,
  STREAK_BONUS: 50, // Weekly streak bonus
} as const
