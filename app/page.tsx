"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LanguageToggle } from "@/components/ui/language-toggle"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Heart, Shield, Users, BookOpen, Brain, Calendar, Trophy, ArrowRight, CheckCircle } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { getCurrentLanguage } from "@/lib/i18n"
import type { Language } from "@/lib/types"

export default function HomePage() {
  const [language, setCurrentLanguage] = useState<Language>("en")
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  const [privacyConsent, setPrivacyConsent] = useState(false)
  const [user, setUser] = useState(getCurrentUser())

  useEffect(() => {
    setCurrentLanguage(getCurrentLanguage())

    if (user) {
      window.location.href = "/dashboard"
      return
    }

    // Check if privacy consent was already given
    const consent = localStorage.getItem("privacyConsent")
    if (consent === "true") {
      setPrivacyConsent(true)
    }
  }, [user])

  const features = [
    {
      icon: Heart,
      title: language === "en" ? "Mental Health First-Aid" : "मानसिक स्वास्थ्य प्राथमिक चिकित्सा",
      description:
        language === "en"
          ? "AI-powered chatbot for crisis detection and coping strategies"
          : "संकट की पहचान और मुकाबला रणनीतियों के लिए AI-संचालित चैटबॉट",
    },
    {
      icon: Calendar,
      title: language === "en" ? "Appointment Booking" : "अपॉइंटमेंट बुकिंग",
      description:
        language === "en"
          ? "Secure, encrypted booking with counselors and mentors"
          : "काउंसलर और मेंटर के साथ सुरक्षित, एन्क्रिप्टेड बुकिंग",
    },
    {
      icon: Users,
      title: language === "en" ? "Peer Support Forums" : "सहकर्मी सहायता फोरम",
      description:
        language === "en" ? "Anonymous community support with moderation" : "मॉडरेशन के साथ गुमनाम समुदायिक सहायता",
    },
    {
      icon: BookOpen,
      title: language === "en" ? "Academic Corner" : "शैक्षणिक कॉर्नर",
      description:
        language === "en" ? "Study resources and academic support tools" : "अध्ययन संसाधन और शैक्षणिक सहायता उपकरण",
    },
    {
      icon: Brain,
      title: language === "en" ? "Mental Health Quizzes" : "मानसिक स्वास्थ्य प्रश्नावली",
      description:
        language === "en" ? "PHQ-9, GAD-7 assessments with instant reports" : "तत्काल रिपोर्ट के साथ PHQ-9, GAD-7 मूल्यांकन",
    },
    {
      icon: Trophy,
      title: language === "en" ? "Career Corner" : "करियर कॉर्नर",
      description:
        language === "en"
          ? "Job opportunities, career resources, and professional guidance"
          : "नौकरी के अवसर, करियर संसाधन और पेशेवर मार्गदर्शन",
    },
  ]

  const handleGetStarted = () => {
    setShowPrivacyModal(true)
  }

  const handlePrivacyAccept = () => {
    if (!privacyConsent) {
      alert(
        language === "en"
          ? "Please accept the privacy policy to continue"
          : "जारी रखने के लिए कृपया गोपनीयता नीति स्वीकार करें",
      )
      return
    }
    // Store privacy consent and redirect to auth
    localStorage.setItem("privacyConsent", "true")
    window.location.href = "/auth/signin"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold animate-fade-in">{language === "en" ? "Cura" : "क्यूरा"}</h1>
          </div>
          <LanguageToggle />
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <Badge variant="secondary" className="mb-4">
            {language === "en"
              ? "Privacy-First • Multilingual • Student-Focused"
              : "गोपनीयता-प्रथम • बहुभाषी • छात्र-केंद्रित"}
          </Badge>

          <h2 className="text-4xl md:text-6xl font-bold text-balance leading-tight animate-slide-up">
            {language === "en"
              ? "Your Mental Health & Academic Success Partner"
              : "आपका मानसिक स्वास्थ्य और शैक्षणिक सफलता साथी"}
          </h2>

          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            {language === "en"
              ? "A comprehensive platform combining mental health first-aid, peer support, academic tools, and career guidance - all in one secure, student-friendly space."
              : "मानसिक स्वास्थ्य प्राथमिक चिकित्सा, सहकर्मी सहायता, शैक्षणिक उपकरण और करियर मार्गदर्शन को मिलाने वाला एक व्यापक मंच - सब कुछ एक सुरक्षित, छात्र-अनुकूल स्थान में।"}
          </p>

          <div className="max-w-md mx-auto">
            <Button size="lg" className="w-full" onClick={handleGetStarted}>
              {language === "en" ? "Get Started" : "शुरू करें"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">
            {language === "en" ? "Everything You Need in One Place" : "एक ही स्थान पर आपकी सभी आवश्यकताएं"}
          </h3>
          <p className="text-muted-foreground text-lg">
            {language === "en"
              ? "Comprehensive support for your mental health and academic journey"
              : "आपकी मानसिक स्वास्थ्य और शैक्षणिक यात्रा के लिए व्यापक सहायता"}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <feature.icon className="h-10 w-10 text-primary mb-2" />
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Privacy & Security */}
      <section className="bg-card py-16">
        <div className="container mx-auto px-4 text-center">
          <Shield className="h-16 w-16 text-primary mx-auto mb-6" />
          <h3 className="text-2xl font-bold mb-4">
            {language === "en" ? "Your Privacy is Our Priority" : "आपकी गोपनीयता हमारी प्राथमिकता है"}
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            {language === "en"
              ? "End-to-end encryption, user-controlled data sharing, and transparent consent flows ensure your sensitive information stays secure and private."
              : "एंड-टू-एंड एन्क्रिप्शन, उपयोगकर्ता-नियंत्रित डेटा साझाकरण, और पारदर्शी सहमति प्रवाह यह सुनिश्चित करते हैं कि आपकी संवेदनशील जानकारी सुरक्षित और निजी रहे।"}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            {language === "en"
              ? "© 2024 Cura. Built with privacy and care for student wellbeing."
              : "© 2024 छात्र सहायता केंद्र। छात्र कल्याण के लिए गोपनीयता और देखभाल के साथ निर्मित।"}
          </p>
        </div>
      </footer>

      {/* Privacy Consent Modal */}
      <Dialog open={showPrivacyModal} onOpenChange={setShowPrivacyModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{language === "en" ? "Privacy & Consent" : "गोपनीयता और सहमति"}</DialogTitle>
            <DialogDescription>
              {language === "en"
                ? "Please review and accept our privacy practices to continue."
                : "जारी रखने के लिए कृपया हमारी गोपनीयता प्रथाओं की समीक्षा करें और स्वीकार करें।"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>
                  {language === "en"
                    ? "Your data is encrypted and stored securely"
                    : "आपका डेटा एन्क्रिप्टेड और सुरक्षित रूप से संग्रहीत है"}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>
                  {language === "en"
                    ? "You control what information is shared with counselors"
                    : "आप नियंत्रित करते हैं कि काउंसलर के साथ कौन सी जानकारी साझा की जाती है"}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>
                  {language === "en"
                    ? "Anonymous options available for peer support"
                    : "सहकर्मी सहायता के लिए गुमनाम विकल्प उपलब्ध"}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>
                  {language === "en"
                    ? "You can export or delete your data anytime"
                    : "आप किसी भी समय अपना डेटा निर्यात या हटा सकते हैं"}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="privacy-consent"
                checked={privacyConsent}
                onCheckedChange={(checked) => setPrivacyConsent(checked as boolean)}
              />
              <label htmlFor="privacy-consent" className="text-sm">
                {language === "en"
                  ? "I understand and accept the privacy practices"
                  : "मैं गोपनीयता प्रथाओं को समझता हूं और स्वीकार करता हूं"}
              </label>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowPrivacyModal(false)} className="flex-1 bg-transparent">
                {language === "en" ? "Cancel" : "रद्द करें"}
              </Button>
              <Button onClick={handlePrivacyAccept} className="flex-1">
                {language === "en" ? "Continue" : "जारी रखें"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
