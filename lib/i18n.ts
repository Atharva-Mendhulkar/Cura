// Internationalization utilities for Student Support Hub

import type { Language } from "./types"

export const translations = {
  en: {
    // Navigation
    dashboard: "Dashboard",
    moodTracker: "Mood Tracker",
    journaling: "Journaling",
    quizzes: "Quizzes",
    appointments: "Appointments",
    forums: "Forums",
    studyPlanner: "Study Planner",
    careerCorner: "Career Corner",
    settings: "Settings",

    // Common
    save: "Save",
    cancel: "Cancel",
    submit: "Submit",
    loading: "Loading...",
    error: "Error",
    success: "Success",

    // Auth
    signIn: "Sign In",
    signUp: "Sign Up",
    signOut: "Sign Out",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",

    // Dashboard
    welcomeBack: "Welcome back",
    todaysMood: "Today's Mood",
    quickHelp: "Quick Help",
    currentStreak: "Current Streak",
    totalPoints: "Total Points",

    // Mood Tracking
    howAreYouFeeling: "How are you feeling today?",
    addNote: "Add a note (optional)",
    moodSaved: "Mood saved successfully",

    // Crisis
    crisisDetected: "We noticed you might need support",
    crisisMessage:
      "Your responses indicate you may be experiencing distress. Would you like to speak with a counselor?",
    crisisHotline: "Crisis Hotline",
    bookCounselor: "Book Counselor",

    // Privacy
    privacyNotice: "Privacy Notice",
    dataEncrypted: "Your data is encrypted and secure",
    consentRequired: "Consent required for data sharing",

    // Gamification
    pointsEarned: "Points Earned",
    badgeUnlocked: "Badge Unlocked!",
    streakMaintained: "Streak Maintained",

    // Errors
    networkError: "Network error. Please try again.",
    validationError: "Please check your input.",
    unauthorized: "Please sign in to continue.",
  },
  hi: {
    // Navigation
    dashboard: "डैशबोर्ड",
    moodTracker: "मूड ट्रैकर",
    journaling: "जर्नलिंग",
    quizzes: "प्रश्नावली",
    appointments: "अपॉइंटमेंट",
    forums: "फोरम",
    studyPlanner: "अध्ययन योजनाकार",
    careerCorner: "करियर कॉर्नर",
    settings: "सेटिंग्स",

    // Common
    save: "सेव करें",
    cancel: "रद्द करें",
    submit: "जमा करें",
    loading: "लोड हो रहा है...",
    error: "त्रुटि",
    success: "सफलता",

    // Auth
    signIn: "साइन इन",
    signUp: "साइन अप",
    signOut: "साइन आउट",
    email: "ईमेल",
    password: "पासवर्ड",
    confirmPassword: "पासवर्ड की पुष्टि करें",

    // Dashboard
    welcomeBack: "वापस स्वागत है",
    todaysMood: "आज का मूड",
    quickHelp: "त्वरित सहायता",
    currentStreak: "वर्तमान स्ट्रीक",
    totalPoints: "कुल अंक",

    // Mood Tracking
    howAreYouFeeling: "आज आप कैसा महसूस कर रहे हैं?",
    addNote: "एक नोट जोड़ें (वैकल्पिक)",
    moodSaved: "मूड सफलतापूर्वक सेव हो गया",

    // Crisis
    crisisDetected: "हमने देखा है कि आपको सहायता की आवश्यकता हो सकती है",
    crisisMessage: "आपके उत्तर बताते हैं कि आप परेशानी में हो सकते हैं। क्या आप किसी काउंसलर से बात करना चाहेंगे?",
    crisisHotline: "क्राइसिस हॉटलाइन",
    bookCounselor: "काउंसलर बुक करें",

    // Privacy
    privacyNotice: "गोपनीयता सूचना",
    dataEncrypted: "आपका डेटा एन्क्रिप्टेड और सुरक्षित है",
    consentRequired: "डेटा साझाकरण के लिए सहमति आवश्यक",

    // Gamification
    pointsEarned: "अंक अर्जित",
    badgeUnlocked: "बैज अनलॉक!",
    streakMaintained: "स्ट्रीक बनाए रखा",

    // Errors
    networkError: "नेटवर्क त्रुटि। कृपया पुनः प्रयास करें।",
    validationError: "कृपया अपना इनपुट जांचें।",
    unauthorized: "जारी रखने के लिए कृपया साइन इन करें।",
  },
} as const

export function t(key: keyof typeof translations.en, language: Language = "en"): string {
  return translations[language][key] || translations.en[key] || key
}

export function getCurrentLanguage(): Language {
  if (typeof window !== "undefined") {
    return (localStorage.getItem("language") as Language) || "en"
  }
  return "en"
}

export function setLanguage(language: Language): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("language", language)
  }
}
