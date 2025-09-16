"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/ui/auth-guard"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { LanguageToggle } from "@/components/ui/language-toggle"
import { User, Shield, Bell, Globe, Download, Trash2, Lock, Smartphone, Mail, Calendar } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { getCurrentLanguage } from "@/lib/i18n"

export default function SettingsPage() {
  const [user, setUser] = useState(getCurrentUser())
  const [language, setCurrentLanguage] = useState(getCurrentLanguage())
  const [settings, setSettings] = useState({
    // Privacy Settings
    dataSharing: false,
    anonymousMode: false,
    encryptJournal: true,
    shareWithCounselors: false,

    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    appointmentReminders: true,
    forumReplies: true,
    moodReminders: true,

    // Profile Settings
    displayName: user?.name || "",
    email: user?.email || "",
    campus: user?.campus || "",
    year: user?.year || "",

    // App Settings
    darkMode: false,
    language: language,
    autoSave: true,
  })

  useEffect(() => {
    setCurrentLanguage(getCurrentLanguage())
    loadSettings()
  }, [])

  const loadSettings = () => {
    const savedSettings = JSON.parse(localStorage.getItem(`settings-${user?.id}`) || "{}")
    setSettings((prev) => ({ ...prev, ...savedSettings }))
  }

  const saveSettings = () => {
    localStorage.setItem(`settings-${user?.id}`, JSON.stringify(settings))
    alert(language === "en" ? "Settings saved successfully!" : "सेटिंग्स सफलतापूर्वक सहेजी गईं!")
  }

  const exportData = () => {
    const userData = {
      profile: user,
      settings: settings,
      moodData: JSON.parse(localStorage.getItem(`mood-data-${user?.id}`) || "[]"),
      journalEntries: JSON.parse(localStorage.getItem(`journal-entries-${user?.id}`) || "[]"),
      progress: JSON.parse(localStorage.getItem(`progress-${user?.id}`) || "{}"),
    }

    const dataStr = JSON.stringify(userData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `student-hub-data-${new Date().toISOString().split("T")[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const deleteAllData = () => {
    const confirmMessage =
      language === "en"
        ? "Are you sure you want to delete all your data? This action cannot be undone."
        : "क्या आप वाकई अपना सारा डेटा हटाना चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती।"

    if (confirm(confirmMessage)) {
      // Clear all user data
      const keysToRemove = [
        `mood-data-${user?.id}`,
        `journal-entries-${user?.id}`,
        `progress-${user?.id}`,
        `settings-${user?.id}`,
        `quiz-results-${user?.id}`,
        `appointments-${user?.id}`,
      ]

      keysToRemove.forEach((key) => localStorage.removeItem(key))

      alert(language === "en" ? "All data deleted successfully" : "सभी डेटा सफलतापूर्वक हटा दिया गया")
      window.location.href = "/auth/signin"
    }
  }

  return (
    <AuthGuard requiredRole="student">
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold">{language === "en" ? "Settings" : "सेटिंग्स"}</h1>
            <p className="text-muted-foreground">
              {language === "en"
                ? "Manage your account, privacy, and app preferences"
                : "अपने खाते, गोपनीयता और ऐप प्राथमिकताओं को प्रबंधित करें"}
            </p>
          </div>

          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {language === "en" ? "Profile Information" : "प्रोफ़ाइल जानकारी"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">{language === "en" ? "Display Name" : "प्रदर्शन नाम"}</Label>
                  <Input
                    id="displayName"
                    value={settings.displayName}
                    onChange={(e) => setSettings({ ...settings, displayName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{language === "en" ? "Email" : "ईमेल"}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="campus">{language === "en" ? "Campus" : "कैंपस"}</Label>
                  <Select
                    value={settings.campus}
                    onValueChange={(value) => setSettings({ ...settings, campus: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={language === "en" ? "Select campus..." : "कैंपस चुनें..."} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="main">Main Campus</SelectItem>
                      <SelectItem value="north">North Campus</SelectItem>
                      <SelectItem value="south">South Campus</SelectItem>
                      <SelectItem value="east">East Campus</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">{language === "en" ? "Academic Year" : "शैक्षणिक वर्ष"}</Label>
                  <Select value={settings.year} onValueChange={(value) => setSettings({ ...settings, year: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder={language === "en" ? "Select year..." : "वर्ष चुनें..."} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1st">1st Year</SelectItem>
                      <SelectItem value="2nd">2nd Year</SelectItem>
                      <SelectItem value="3rd">3rd Year</SelectItem>
                      <SelectItem value="4th">4th Year</SelectItem>
                      <SelectItem value="graduate">Graduate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {language === "en" ? "Privacy & Data Control" : "गोपनीयता और डेटा नियंत्रण"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">{language === "en" ? "Data Sharing" : "डेटा साझाकरण"}</Label>
                  <p className="text-sm text-muted-foreground">
                    {language === "en"
                      ? "Allow anonymized data to be used for research purposes"
                      : "अनुसंधान उद्देश्यों के लिए गुमनाम डेटा का उपयोग करने की अनुमति दें"}
                  </p>
                </div>
                <Switch
                  checked={settings.dataSharing}
                  onCheckedChange={(checked) => setSettings({ ...settings, dataSharing: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">{language === "en" ? "Anonymous Mode" : "गुमनाम मोड"}</Label>
                  <p className="text-sm text-muted-foreground">
                    {language === "en"
                      ? "Hide your identity in forums and group activities"
                      : "फोरम और समूह गतिविधियों में अपनी पहचान छुपाएं"}
                  </p>
                </div>
                <Switch
                  checked={settings.anonymousMode}
                  onCheckedChange={(checked) => setSettings({ ...settings, anonymousMode: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">
                    {language === "en" ? "Encrypt Journal Entries" : "जर्नल प्रविष्टियों को एन्क्रिप्ट करें"}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {language === "en"
                      ? "Add extra security to your personal journal entries"
                      : "अपनी व्यक्तिगत जर्नल प्रविष्टियों में अतिरिक्त सुरक्षा जोड़ें"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-green-600" />
                  <Switch
                    checked={settings.encryptJournal}
                    onCheckedChange={(checked) => setSettings({ ...settings, encryptJournal: checked })}
                  />
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">
                    {language === "en" ? "Share with Counselors" : "काउंसलर के साथ साझा करें"}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {language === "en"
                      ? "Allow counselors to view your mood trends and journal insights"
                      : "काउंसलर को आपके मूड ट्रेंड और जर्नल अंतर्दृष्टि देखने की अनुमति दें"}
                  </p>
                </div>
                <Switch
                  checked={settings.shareWithCounselors}
                  onCheckedChange={(checked) => setSettings({ ...settings, shareWithCounselors: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                {language === "en" ? "Notifications" : "सूचनाएं"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {language === "en" ? "Email Notifications" : "ईमेल सूचनाएं"}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {language === "en" ? "Receive updates via email" : "ईमेल के माध्यम से अपडेट प्राप्त करें"}
                  </p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    {language === "en" ? "Push Notifications" : "पुश सूचनाएं"}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {language === "en" ? "Receive notifications on your device" : "अपने डिवाइस पर सूचनाएं प्राप्त करें"}
                  </p>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, pushNotifications: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {language === "en" ? "Appointment Reminders" : "अपॉइंटमेंट रिमाइंडर"}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {language === "en"
                      ? "Get reminded about upcoming appointments"
                      : "आगामी अपॉइंटमेंट के बारे में याद दिलाया जाए"}
                  </p>
                </div>
                <Switch
                  checked={settings.appointmentReminders}
                  onCheckedChange={(checked) => setSettings({ ...settings, appointmentReminders: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* App Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                {language === "en" ? "App Preferences" : "ऐप प्राथमिकताएं"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">{language === "en" ? "Language" : "भाषा"}</Label>
                  <p className="text-sm text-muted-foreground">
                    {language === "en" ? "Choose your preferred language" : "अपनी पसंदीदा भाषा चुनें"}
                  </p>
                </div>
                <LanguageToggle />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">{language === "en" ? "Auto-save" : "ऑटो-सेव"}</Label>
                  <p className="text-sm text-muted-foreground">
                    {language === "en" ? "Automatically save your progress" : "अपनी प्रगति को स्वचालित रूप से सहेजें"}
                  </p>
                </div>
                <Switch
                  checked={settings.autoSave}
                  onCheckedChange={(checked) => setSettings({ ...settings, autoSave: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                {language === "en" ? "Data Management" : "डेटा प्रबंधन"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={exportData} variant="outline" className="flex items-center gap-2 bg-transparent">
                  <Download className="h-4 w-4" />
                  {language === "en" ? "Export My Data" : "मेरा डेटा निर्यात करें"}
                </Button>

                <Button onClick={deleteAllData} variant="destructive" className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  {language === "en" ? "Delete All Data" : "सभी डेटा हटाएं"}
                </Button>
              </div>

              <p className="text-sm text-muted-foreground">
                {language === "en"
                  ? "Export your data for backup or transfer to another service. Deletion is permanent and cannot be undone."
                  : "बैकअप के लिए या किसी अन्य सेवा में स्थानांतरित करने के लिए अपना डेटा निर्यात करें। हटाना स्थायी है और इसे पूर्ववत नहीं किया जा सकता।"}
              </p>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={saveSettings} size="lg">
              {language === "en" ? "Save Settings" : "सेटिंग्स सहेजें"}
            </Button>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
