"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/ui/auth-guard"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar, Clock, User, Video, CheckCircle, AlertCircle } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { getCurrentLanguage } from "@/lib/i18n"
import type { Appointment } from "@/lib/types"

interface Counselor {
  id: string
  name: string
  title: string
  specialties: string[]
  availability: string[]
  rating: number
  languages: string[]
}

export default function AppointmentsPage() {
  const [user, setUser] = useState(getCurrentUser())
  const [language, setCurrentLanguage] = useState(getCurrentLanguage())
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [counselors, setCounselors] = useState<Counselor[]>([])
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [selectedCounselor, setSelectedCounselor] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [appointmentNotes, setAppointmentNotes] = useState("")

  useEffect(() => {
    setCurrentLanguage(getCurrentLanguage())
    loadAppointments()
    loadCounselors()
  }, [])

  const loadAppointments = () => {
    const savedAppointments = JSON.parse(localStorage.getItem(`appointments-${user?.id}`) || "[]")
    setAppointments(savedAppointments)
  }

  const loadCounselors = () => {
    // Mock counselor data
    const mockCounselors: Counselor[] = [
      {
        id: "counselor-1",
        name: "Dr. Sarah Johnson",
        title: "Clinical Psychologist",
        specialties: ["Anxiety", "Depression", "Academic Stress"],
        availability: ["Monday", "Tuesday", "Wednesday", "Friday"],
        rating: 4.9,
        languages: ["English", "Hindi"],
      },
      {
        id: "counselor-2",
        name: "Dr. Rajesh Kumar",
        title: "Counseling Psychologist",
        specialties: ["Career Counseling", "Relationship Issues", "Self-esteem"],
        availability: ["Tuesday", "Thursday", "Saturday"],
        rating: 4.8,
        languages: ["Hindi", "English"],
      },
      {
        id: "counselor-3",
        name: "Dr. Priya Sharma",
        title: "Mental Health Counselor",
        specialties: ["Trauma", "PTSD", "Mindfulness"],
        availability: ["Monday", "Wednesday", "Thursday", "Friday"],
        rating: 4.9,
        languages: ["English", "Hindi"],
      },
    ]
    setCounselors(mockCounselors)
  }

  const bookAppointment = () => {
    if (!selectedCounselor || !selectedDate || !selectedTime) {
      alert(language === "en" ? "Please fill all required fields" : "कृपया सभी आवश्यक फ़ील्ड भरें")
      return
    }

    const counselor = counselors.find((c) => c.id === selectedCounselor)
    const appointment: Appointment = {
      id: `appointment-${Date.now()}`,
      studentId: user?.id || "",
      counselorId: selectedCounselor,
      scheduledAt: new Date(`${selectedDate}T${selectedTime}`),
      duration: 60,
      status: "scheduled",
      notes: appointmentNotes,
      isEncrypted: true,
      reminderSent: false,
    }

    const updatedAppointments = [appointment, ...appointments]
    setAppointments(updatedAppointments)
    localStorage.setItem(`appointments-${user?.id}`, JSON.stringify(updatedAppointments))

    // Reset form
    setSelectedCounselor("")
    setSelectedDate("")
    setSelectedTime("")
    setAppointmentNotes("")
    setShowBookingModal(false)

    alert(
      language === "en"
        ? `Appointment booked with ${counselor?.name} on ${new Date(`${selectedDate}T${selectedTime}`).toLocaleDateString()}`
        : `${counselor?.name} के साथ ${new Date(`${selectedDate}T${selectedTime}`).toLocaleDateString()} को अपॉइंटमेंट बुक हो गया`,
    )
  }

  const getAvailableSlots = () => {
    if (!selectedCounselor || !selectedDate) return []

    const counselor = counselors.find((c) => c.id === selectedCounselor)
    if (!counselor) return []

    const selectedDay = new Date(selectedDate).toLocaleDateString("en-US", { weekday: "long" })
    if (!counselor.availability.includes(selectedDay)) return []

    // Generate time slots (9 AM to 5 PM)
    const slots = []
    for (let hour = 9; hour < 17; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`)
      slots.push(`${hour.toString().padStart(2, "0")}:30`)
    }
    return slots
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "no-show":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Clock className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
      case "no-show":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const upcomingAppointments = appointments.filter(
    (apt) => apt.status === "scheduled" && new Date(apt.scheduledAt) > new Date(),
  )
  const pastAppointments = appointments.filter(
    (apt) => apt.status !== "scheduled" || new Date(apt.scheduledAt) <= new Date(),
  )

  return (
    <AuthGuard requiredRole="student">
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{language === "en" ? "Appointments" : "अपॉइंटमेंट"}</h1>
              <p className="text-muted-foreground">
                {language === "en"
                  ? "Book secure, confidential sessions with mental health professionals"
                  : "मानसिक स्वास्थ्य पेशेवरों के साथ सुरक्षित, गोपनीय सत्र बुक करें"}
              </p>
            </div>

            <Button onClick={() => setShowBookingModal(true)}>
              <Calendar className="h-4 w-4 mr-2" />
              {language === "en" ? "Book Appointment" : "अपॉइंटमेंट बुक करें"}
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{language === "en" ? "Upcoming" : "आगामी"}</p>
                    <p className="text-2xl font-bold">{upcomingAppointments.length}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{language === "en" ? "Completed" : "पूर्ण"}</p>
                    <p className="text-2xl font-bold">
                      {appointments.filter((apt) => apt.status === "completed").length}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
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
                        appointments.filter(
                          (apt) =>
                            new Date(apt.scheduledAt).getMonth() === new Date().getMonth() &&
                            new Date(apt.scheduledAt).getFullYear() === new Date().getFullYear(),
                        ).length
                      }
                    </p>
                  </div>
                  <User className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Appointments */}
          {upcomingAppointments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{language === "en" ? "Upcoming Appointments" : "आगामी अपॉइंटमेंट"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingAppointments.map((appointment) => {
                  const counselor = counselors.find((c) => c.id === appointment.counselorId)
                  return (
                    <div key={appointment.id} className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {counselor?.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <h3 className="font-medium">{counselor?.name}</h3>
                        <p className="text-sm text-muted-foreground">{counselor?.title}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(appointment.scheduledAt).toLocaleDateString(
                              language === "hi" ? "hi-IN" : "en-US",
                            )}
                          </span>
                          <span className="text-sm flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(appointment.scheduledAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getStatusColor(appointment.status)}>
                          {getStatusIcon(appointment.status)}
                          <span className="ml-1 capitalize">{appointment.status}</span>
                        </Badge>
                        <Button variant="outline" size="sm" className="bg-transparent">
                          <Video className="h-4 w-4 mr-1" />
                          {language === "en" ? "Join" : "जॉइन करें"}
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          )}

          {/* Available Counselors */}
          <Card>
            <CardHeader>
              <CardTitle>{language === "en" ? "Available Counselors" : "उपलब्ध काउंसलर"}</CardTitle>
              <CardDescription>
                {language === "en"
                  ? "Choose from our qualified mental health professionals"
                  : "हमारे योग्य मानसिक स्वास्थ्य पेशेवरों में से चुनें"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {counselors.map((counselor) => (
                  <Card key={counselor.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {counselor.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{counselor.name}</h3>
                          <p className="text-sm text-muted-foreground">{counselor.title}</p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            {language === "en" ? "Specialties:" : "विशेषताएं:"}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {counselor.specialties.slice(0, 2).map((specialty, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-muted-foreground">
                            {language === "en" ? "Languages:" : "भाषाएं:"} {counselor.languages.join(", ")}
                          </p>
                        </div>

                        <div className="flex items-center gap-1">
                          <span className="text-sm">⭐ {counselor.rating}</span>
                          <span className="text-xs text-muted-foreground">
                            ({Math.floor(Math.random() * 50) + 20} {language === "en" ? "reviews" : "समीक्षाएं"})
                          </span>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full bg-transparent"
                        onClick={() => {
                          setSelectedCounselor(counselor.id)
                          setShowBookingModal(true)
                        }}
                      >
                        {language === "en" ? "Book Session" : "सत्र बुक करें"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Past Appointments */}
          {pastAppointments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{language === "en" ? "Past Appointments" : "पिछले अपॉइंटमेंट"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pastAppointments.slice(0, 5).map((appointment) => {
                    const counselor = counselors.find((c) => c.id === appointment.counselorId)
                    return (
                      <div
                        key={appointment.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-muted text-muted-foreground">
                              {counselor?.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{counselor?.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(appointment.scheduledAt).toLocaleDateString(
                                language === "hi" ? "hi-IN" : "en-US",
                              )}
                            </p>
                          </div>
                        </div>

                        <Badge variant="outline" className={getStatusColor(appointment.status)}>
                          {getStatusIcon(appointment.status)}
                          <span className="ml-1 capitalize">{appointment.status}</span>
                        </Badge>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Booking Modal */}
          <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{language === "en" ? "Book Appointment" : "अपॉइंटमेंट बुक करें"}</DialogTitle>
                <DialogDescription>
                  {language === "en"
                    ? "Schedule a confidential session with a mental health professional"
                    : "मानसिक स्वास्थ्य पेशेवर के साथ एक गोपनीय सत्र शेड्यूल करें"}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{language === "en" ? "Select Counselor" : "काउंसलर चुनें"}</label>
                  <Select value={selectedCounselor} onValueChange={setSelectedCounselor}>
                    <SelectTrigger>
                      <SelectValue placeholder={language === "en" ? "Choose a counselor..." : "एक काउंसलर चुनें..."} />
                    </SelectTrigger>
                    <SelectContent>
                      {counselors.map((counselor) => (
                        <SelectItem key={counselor.id} value={counselor.id}>
                          {counselor.name} - {counselor.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{language === "en" ? "Select Date" : "तारीख चुनें"}</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{language === "en" ? "Select Time" : "समय चुनें"}</label>
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger>
                      <SelectValue placeholder={language === "en" ? "Choose a time..." : "समय चुनें..."} />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableSlots().map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {language === "en" ? "Notes (Optional)" : "नोट्स (वैकल्पिक)"}
                  </label>
                  <Textarea
                    value={appointmentNotes}
                    onChange={(e) => setAppointmentNotes(e.target.value)}
                    placeholder={
                      language === "en"
                        ? "Any specific topics you'd like to discuss..."
                        : "कोई विशिष्ट विषय जिस पर आप चर्चा करना चाहते हैं..."
                    }
                    className="min-h-[80px]"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={bookAppointment} className="flex-1">
                    {language === "en" ? "Book Appointment" : "अपॉइंटमेंट बुक करें"}
                  </Button>
                  <Button variant="outline" onClick={() => setShowBookingModal(false)} className="bg-transparent">
                    {language === "en" ? "Cancel" : "रद्द करें"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
