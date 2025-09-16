"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { BookOpen, Users, Calendar, GraduationCap, Clock, MapPin, Star, Trophy, Play, UserPlus } from "lucide-react"
import { getCurrentLanguage } from "@/lib/i18n"

export default function AcademicCornerPage() {
  const [selectedProfessor, setSelectedProfessor] = useState("")
  const [appointmentDate, setAppointmentDate] = useState("")
  const [appointmentSlot, setAppointmentSlot] = useState("")
  const [appointmentReason, setAppointmentReason] = useState("")
  const language = getCurrentLanguage()

  const academicResources = [
    {
      title: language === "en" ? "Study Techniques for Indian Students" : "भारतीय छात्रों के लिए अध्ययन तकनीकें",
      description:
        language === "en"
          ? "Effective study methods adapted for Indian education system"
          : "भारतीय शिक्षा प्रणाली के लिए अनुकूलित प्रभावी अध्ययन विधियां",
      category: language === "en" ? "Study Tips" : "अध्ययन सुझाव",
      readTime: "5 min",
    },
    {
      title: language === "en" ? "Managing Academic Pressure" : "शैक्षणिक दबाव का प्रबंधन",
      description:
        language === "en"
          ? "Strategies to handle competitive academic environment"
          : "प्रतिस्पर्धी शैक्षणिक वातावरण को संभालने की रणनीतियां",
      category: language === "en" ? "Mental Health" : "मानसिक स्वास्थ्य",
      readTime: "7 min",
    },
    {
      title: language === "en" ? "Career Planning After Graduation" : "स्नातक के बाद करियर योजना",
      description:
        language === "en"
          ? "Guide to career options and planning in India"
          : "भारत में करियर विकल्प और योजना बनाने की गाइड",
      category: language === "en" ? "Career" : "करियर",
      readTime: "10 min",
    },
    {
      title: language === "en" ? "Time Management for Students" : "छात्रों के लिए समय प्रबंधन",
      description:
        language === "en"
          ? "Balance studies, activities, and personal time"
          : "अध्ययन, गतिविधियों और व्यक्तिगत समय को संतुलित करें",
      category: language === "en" ? "Productivity" : "उत्पादकता",
      readTime: "6 min",
    },
  ]

  const professors = [
    { id: "1", name: "Dr. Priya Sharma", department: "Computer Science", rating: 4.8 },
    { id: "2", name: "Prof. Rajesh Kumar", department: "Mathematics", rating: 4.6 },
    { id: "3", name: "Dr. Anita Patel", department: "Psychology", rating: 4.9 },
    { id: "4", name: "Prof. Suresh Gupta", department: "Physics", rating: 4.7 },
  ]

  const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"]

  const studyGroups = [
    {
      id: "1",
      name: language === "en" ? "Data Structures Study Circle" : "डेटा स्ट्रक्चर अध्ययन मंडली",
      subject: "Computer Science",
      members: 8,
      maxMembers: 12,
      schedule: language === "en" ? "Mon, Wed, Fri - 6:00 PM" : "सोम, बुध, शुक्र - 6:00 PM",
      level: language === "en" ? "Intermediate" : "मध्यम",
      points: 50,
    },
    {
      id: "2",
      name: language === "en" ? "Calculus Problem Solving" : "कैलकुलस समस्या समाधान",
      subject: "Mathematics",
      members: 6,
      maxMembers: 10,
      schedule: language === "en" ? "Tue, Thu - 7:00 PM" : "मंगल, गुरु - 7:00 PM",
      level: language === "en" ? "Advanced" : "उन्नत",
      points: 75,
    },
    {
      id: "3",
      name: language === "en" ? "Physics Lab Prep Group" : "भौतिकी प्रयोगशाला तैयारी समूह",
      subject: "Physics",
      members: 5,
      maxMembers: 8,
      schedule: language === "en" ? "Sat - 10:00 AM" : "शनि - 10:00 AM",
      level: language === "en" ? "Beginner" : "शुरुआती",
      points: 30,
    },
  ]

  const handleAppointmentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle appointment booking logic here
    alert(language === "en" ? "Appointment request submitted!" : "अपॉइंटमेंट अनुरोध सबमिट किया गया!")
  }

  const joinStudyGroup = (groupId: string) => {
    // Handle study group joining logic here
    alert(language === "en" ? "Joined study group successfully!" : "अध्ययन समूह में सफलतापूर्वक शामिल हो गए!")
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">{language === "en" ? "Academic Corner" : "शैक्षणिक कॉर्नर"}</h1>
          </div>
          <p className="text-muted-foreground">
            {language === "en"
              ? "Academic resources, mentorship, and peer study groups"
              : "शैक्षणिक संसाधन, मार्गदर्शन और सहकर्मी अध्ययन समूह"}
          </p>
        </div>

        <Tabs defaultValue="resources" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="resources" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              {language === "en" ? "Resource Hub" : "संसाधन केंद्र"}
            </TabsTrigger>
            <TabsTrigger value="mentors" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {language === "en" ? "Mentor Connect" : "गुरु संपर्क"}
            </TabsTrigger>
            <TabsTrigger value="study-groups" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {language === "en" ? "Study Circles" : "अध्ययन मंडली"}
            </TabsTrigger>
          </TabsList>

          {/* Academic Resource Hub */}
          <TabsContent value="resources" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  {language === "en" ? "Academic Resource Hub" : "शैक्षणिक संसाधन केंद्र"}
                </CardTitle>
                <CardDescription>
                  {language === "en"
                    ? "Curated academic tips and resources for Indian students"
                    : "भारतीय छात्रों के लिए चुनिंदा शैक्षणिक सुझाव और संसाधन"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {academicResources.map((resource, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <Badge variant="secondary">{resource.category}</Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {resource.readTime}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm mb-1">{resource.title}</h3>
                          <p className="text-xs text-muted-foreground leading-relaxed">{resource.description}</p>
                        </div>
                        <Button size="sm" variant="outline" className="w-full bg-transparent">
                          <Play className="h-3 w-3 mr-1" />
                          {language === "en" ? "Read Article" : "लेख पढ़ें"}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mentor & Faculty Connect */}
          <TabsContent value="mentors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  {language === "en" ? "Book Appointment with Faculty" : "फैकल्टी के साथ अपॉइंटमेंट बुक करें"}
                </CardTitle>
                <CardDescription>
                  {language === "en"
                    ? "Schedule one-on-one sessions with professors and mentors"
                    : "प्रोफेसरों और गुरुओं के साथ व्यक्तिगत सत्र निर्धारित करें"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAppointmentSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="professor">{language === "en" ? "Select Professor" : "प्रोफेसर चुनें"}</Label>
                      <Select value={selectedProfessor} onValueChange={setSelectedProfessor}>
                        <SelectTrigger>
                          <SelectValue placeholder={language === "en" ? "Choose a professor" : "एक प्रोफेसर चुनें"} />
                        </SelectTrigger>
                        <SelectContent>
                          {professors.map((prof) => (
                            <SelectItem key={prof.id} value={prof.id}>
                              <div className="flex items-center justify-between w-full">
                                <span>{prof.name}</span>
                                <div className="flex items-center gap-1 ml-2">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  <span className="text-xs">{prof.rating}</span>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date">{language === "en" ? "Preferred Date" : "पसंदीदा तारीख"}</Label>
                      <Input
                        id="date"
                        type="date"
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="slot">{language === "en" ? "Time Slot" : "समय स्लॉट"}</Label>
                      <Select value={appointmentSlot} onValueChange={setAppointmentSlot}>
                        <SelectTrigger>
                          <SelectValue placeholder={language === "en" ? "Select time" : "समय चुनें"} />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((slot) => (
                            <SelectItem key={slot} value={slot}>
                              {slot}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reason">{language === "en" ? "Reason for Meeting" : "मिलने का कारण"}</Label>
                      <Textarea
                        id="reason"
                        value={appointmentReason}
                        onChange={(e) => setAppointmentReason(e.target.value)}
                        placeholder={
                          language === "en"
                            ? "Brief description of what you'd like to discuss..."
                            : "आप जिस बारे में चर्चा करना चाहते हैं उसका संक्षिप्त विवरण..."
                        }
                        rows={3}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    {language === "en" ? "Book Appointment" : "अपॉइंटमेंट बुक करें"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Peer Study Circles */}
          <TabsContent value="study-groups" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  {language === "en" ? "Peer Study Circles" : "सहकर्मी अध्ययन मंडली"}
                </CardTitle>
                <CardDescription>
                  {language === "en"
                    ? "Join virtual study groups and earn points for participation"
                    : "वर्चुअल अध्ययन समूहों में शामिल हों और भागीदारी के लिए अंक अर्जित करें"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {studyGroups.map((group) => (
                    <Card key={group.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <Badge variant="outline">{group.subject}</Badge>
                          <div className="flex items-center gap-1 text-amber-600">
                            <Trophy className="h-3 w-3" />
                            <span className="text-xs font-medium">{group.points} pts</span>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-semibold text-sm mb-1">{group.name}</h3>
                          <div className="space-y-1 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>
                                {group.members}/{group.maxMembers} members
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{group.schedule}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{group.level}</span>
                            </div>
                          </div>
                        </div>

                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() => joinStudyGroup(group.id)}
                          disabled={group.members >= group.maxMembers}
                        >
                          <UserPlus className="h-3 w-3 mr-1" />
                          {group.members >= group.maxMembers
                            ? language === "en"
                              ? "Full"
                              : "भरा हुआ"
                            : language === "en"
                              ? "Join Group"
                              : "समूह में शामिल हों"}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
