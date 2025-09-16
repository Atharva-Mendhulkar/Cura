"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/ui/auth-guard"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Briefcase,
  MapPin,
  Clock,
  ExternalLink,
  Search,
  BookOpen,
  Users,
  TrendingUp,
  Star,
  Building,
  GraduationCap,
} from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { getCurrentLanguage } from "@/lib/i18n"

interface JobListing {
  id: string
  title: string
  company: string
  location: string
  type: "full-time" | "part-time" | "internship" | "contract"
  experience: string
  salary: string
  description: string
  requirements: string[]
  postedDate: Date
  applicationUrl: string
  featured: boolean
}

interface CareerResource {
  id: string
  title: string
  type: "article" | "video" | "course" | "webinar"
  category: string
  description: string
  url: string
  duration?: string
  rating: number
}

export default function CareerCornerPage() {
  const [user, setUser] = useState(getCurrentUser())
  const [language, setCurrentLanguage] = useState(getCurrentLanguage())
  const [currentView, setCurrentView] = useState<"jobs" | "resources" | "guidance">("jobs")
  const [jobListings, setJobListings] = useState<JobListing[]>([])
  const [careerResources, setCareerResources] = useState<CareerResource[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedJobType, setSelectedJobType] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")

  useEffect(() => {
    setCurrentLanguage(getCurrentLanguage())
    loadCareerData()
  }, [])

  const loadCareerData = () => {
    // Mock job listings
    const mockJobs: JobListing[] = [
      {
        id: "job-1",
        title: language === "en" ? "Software Engineering Intern" : "सॉफ्टवेयर इंजीनियरिंग इंटर्न",
        company: "TechCorp",
        location: language === "en" ? "Mumbai, India" : "मुंबई, भारत",
        type: "internship",
        experience: language === "en" ? "0-1 years" : "0-1 वर्ष",
        salary: "₹25,000 - ₹35,000/month",
        description:
          language === "en"
            ? "Join our dynamic team as a Software Engineering Intern and work on cutting-edge projects."
            : "हमारी गतिशील टीम में सॉफ्टवेयर इंजीनियरिंग इंटर्न के रूप में शामिल हों और अत्याधुनिक परियोजनाओं पर काम करें।",
        requirements: [
          language === "en" ? "Computer Science or related field" : "कंप्यूटर साइंस या संबंधित क्षेत्र",
          language === "en" ? "Knowledge of Python/Java" : "Python/Java का ज्ञान",
          language === "en" ? "Strong problem-solving skills" : "मजबूत समस्या समाधान कौशल",
        ],
        postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        applicationUrl: "#",
        featured: true,
      },
      {
        id: "job-2",
        title: language === "en" ? "Marketing Associate" : "मार्केटिंग एसोसिएट",
        company: "StartupXYZ",
        location: language === "en" ? "Bangalore, India" : "बैंगलोर, भारत",
        type: "full-time",
        experience: language === "en" ? "1-2 years" : "1-2 वर्ष",
        salary: "₹4,00,000 - ₹6,00,000/year",
        description:
          language === "en"
            ? "Looking for a creative marketing professional to join our growing startup."
            : "हमारे बढ़ते स्टार्टअप में शामिल होने के लिए एक रचनात्मक मार्केटिंग पेशेवर की तलाश है।",
        requirements: [
          language === "en" ? "Marketing or Business degree" : "मार्केटिंग या बिजनेस डिग्री",
          language === "en" ? "Social media experience" : "सोशल मीडिया अनुभव",
          language === "en" ? "Creative thinking" : "रचनात्मक सोच",
        ],
        postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        applicationUrl: "#",
        featured: false,
      },
    ]

    // Mock career resources
    const mockResources: CareerResource[] = [
      {
        id: "resource-1",
        title: language === "en" ? "Resume Writing Masterclass" : "रिज्यूमे लेखन मास्टरक्लास",
        type: "course",
        category: language === "en" ? "Career Development" : "करियर विकास",
        description:
          language === "en"
            ? "Learn how to create a compelling resume that stands out to employers"
            : "सीखें कि कैसे एक आकर्षक रिज्यूमे बनाया जाए जो नियोक्ताओं के लिए अलग हो",
        url: "#",
        duration: "2 hours",
        rating: 4.8,
      },
      {
        id: "resource-2",
        title: language === "en" ? "Interview Skills Workshop" : "इंटरव्यू स्किल्स वर्कशॉप",
        type: "webinar",
        category: language === "en" ? "Interview Prep" : "इंटरव्यू तैयारी",
        description:
          language === "en"
            ? "Master the art of interviewing with practical tips and mock sessions"
            : "व्यावहारिक सुझावों और मॉक सेशन के साथ इंटरव्यू की कला में महारत हासिल करें",
        url: "#",
        duration: "1.5 hours",
        rating: 4.9,
      },
    ]

    setJobListings(mockJobs)
    setCareerResources(mockResources)
  }

  const filteredJobs = jobListings.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedJobType === "all" || job.type === selectedJobType
    const matchesLocation = selectedLocation === "all" || job.location.includes(selectedLocation)
    return matchesSearch && matchesType && matchesLocation
  })

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case "full-time":
        return "bg-green-100 text-green-800 border-green-200"
      case "part-time":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "internship":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "contract":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case "article":
        return <BookOpen className="h-4 w-4" />
      case "video":
        return <BookOpen className="h-4 w-4" />
      case "course":
        return <GraduationCap className="h-4 w-4" />
      case "webinar":
        return <Users className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  const getTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return language === "en" ? "Today" : "आज"
    if (diffInDays === 1) return language === "en" ? "Yesterday" : "कल"
    return `${diffInDays} ${language === "en" ? "days ago" : "दिन पहले"}`
  }

  return (
    <AuthGuard requiredRole="student">
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold">{language === "en" ? "Career Corner" : "करियर कॉर्नर"}</h1>
            <p className="text-muted-foreground">
              {language === "en"
                ? "Explore job opportunities, career resources, and professional guidance"
                : "नौकरी के अवसरों, करियर संसाधनों और पेशेवर मार्गदर्शन का अन्वेषण करें"}
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex gap-2">
            <Button variant={currentView === "jobs" ? "default" : "outline"} onClick={() => setCurrentView("jobs")}>
              <Briefcase className="h-4 w-4 mr-2" />
              {language === "en" ? "Job Listings" : "नौकरी सूची"}
            </Button>
            <Button
              variant={currentView === "resources" ? "default" : "outline"}
              onClick={() => setCurrentView("resources")}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              {language === "en" ? "Resources" : "संसाधन"}
            </Button>
            <Button
              variant={currentView === "guidance" ? "default" : "outline"}
              onClick={() => setCurrentView("guidance")}
            >
              <Users className="h-4 w-4 mr-2" />
              {language === "en" ? "Guidance" : "मार्गदर्शन"}
            </Button>
          </div>

          {/* Job Listings View */}
          {currentView === "jobs" && (
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={language === "en" ? "Search jobs..." : "नौकरियां खोजें..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={selectedJobType} onValueChange={setSelectedJobType}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder={language === "en" ? "Job Type" : "नौकरी प्रकार"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{language === "en" ? "All Types" : "सभी प्रकार"}</SelectItem>
                    <SelectItem value="full-time">{language === "en" ? "Full-time" : "पूर्णकालिक"}</SelectItem>
                    <SelectItem value="part-time">{language === "en" ? "Part-time" : "अंशकालिक"}</SelectItem>
                    <SelectItem value="internship">{language === "en" ? "Internship" : "इंटर्नशिप"}</SelectItem>
                    <SelectItem value="contract">{language === "en" ? "Contract" : "अनुबंध"}</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder={language === "en" ? "Location" : "स्थान"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{language === "en" ? "All Locations" : "सभी स्थान"}</SelectItem>
                    <SelectItem value="Mumbai">{language === "en" ? "Mumbai" : "मुंबई"}</SelectItem>
                    <SelectItem value="Delhi">{language === "en" ? "Delhi" : "दिल्ली"}</SelectItem>
                    <SelectItem value="Bangalore">{language === "en" ? "Bangalore" : "बैंगलोर"}</SelectItem>
                    <SelectItem value="Pune">{language === "en" ? "Pune" : "पुणे"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Job Cards */}
              <div className="space-y-4">
                {filteredJobs.map((job) => (
                  <Card
                    key={job.id}
                    className={`hover:shadow-md transition-shadow ${job.featured ? "ring-2 ring-blue-200" : ""}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold">{job.title}</h3>
                            {job.featured && (
                              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                <Star className="h-3 w-3 mr-1" />
                                {language === "en" ? "Featured" : "फीचर्ड"}
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center gap-1">
                              <Building className="h-4 w-4" />
                              {job.company}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {job.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {getTimeAgo(job.postedDate)}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mb-3">
                            <Badge className={getJobTypeColor(job.type)}>{job.type}</Badge>
                            <Badge variant="outline">{job.experience}</Badge>
                            <Badge variant="outline">{job.salary}</Badge>
                          </div>

                          <p className="text-muted-foreground mb-3 leading-relaxed">{job.description}</p>

                          <div className="space-y-2">
                            <p className="text-sm font-medium">{language === "en" ? "Requirements:" : "आवश्यकताएं:"}</p>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              {job.requirements.map((req, index) => (
                                <li key={index} className="flex items-center gap-2">
                                  <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                                  {req}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="ml-6">
                          <Button asChild>
                            <a href={job.applicationUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              {language === "en" ? "Apply" : "आवेदन करें"}
                            </a>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {filteredJobs.length === 0 && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">
                        {language === "en" ? "No jobs found" : "कोई नौकरी नहीं मिली"}
                      </h3>
                      <p className="text-muted-foreground">
                        {language === "en"
                          ? "Try adjusting your search criteria or check back later for new opportunities"
                          : "अपने खोज मानदंडों को समायोजित करने का प्रयास करें या नए अवसरों के लिए बाद में वापस जांचें"}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* Resources View */}
          {currentView === "resources" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {careerResources.map((resource) => (
                  <Card key={resource.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        {getResourceTypeIcon(resource.type)}
                        <Badge variant="outline">{resource.type}</Badge>
                        <div className="flex items-center gap-1 ml-auto">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm">{resource.rating}</span>
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold mb-2">{resource.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{resource.category}</p>
                      <p className="text-muted-foreground mb-4 leading-relaxed">{resource.description}</p>

                      <div className="flex items-center justify-between">
                        {resource.duration && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {resource.duration}
                          </div>
                        )}
                        <Button asChild size="sm">
                          <a href={resource.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            {language === "en" ? "Access" : "पहुंच"}
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Guidance View */}
          {currentView === "guidance" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {language === "en" ? "Career Counseling" : "करियर काउंसलिंग"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {language === "en"
                      ? "Get personalized career guidance from our professional counselors"
                      : "हमारे पेशेवर काउंसलर से व्यक्तिगत करियर मार्गदर्शन प्राप्त करें"}
                  </p>
                  <Button>{language === "en" ? "Book Session" : "सत्र बुक करें"}</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    {language === "en" ? "Industry Insights" : "उद्योग अंतर्दृष्टि"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {language === "en"
                      ? "Stay updated with the latest industry trends and job market insights"
                      : "नवीनतम उद्योग रुझानों और नौकरी बाजार की अंतर्दृष्टि के साथ अपडेट रहें"}
                  </p>
                  <Button variant="outline">{language === "en" ? "View Insights" : "अंतर्दृष्टि देखें"}</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    {language === "en" ? "Skill Assessment" : "कौशल मूल्यांकन"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {language === "en"
                      ? "Assess your skills and get recommendations for improvement"
                      : "अपने कौशल का आकलन करें और सुधार के लिए सिफारिशें प्राप्त करें"}
                  </p>
                  <Button variant="outline">{language === "en" ? "Take Assessment" : "मूल्यांकन लें"}</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    {language === "en" ? "Resume Builder" : "रिज्यूमे बिल्डर"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {language === "en"
                      ? "Create a professional resume with our guided builder tool"
                      : "हमारे गाइडेड बिल्डर टूल के साथ एक पेशेवर रिज्यूमे बनाएं"}
                  </p>
                  <Button variant="outline">{language === "en" ? "Build Resume" : "रिज्यूमे बनाएं"}</Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
