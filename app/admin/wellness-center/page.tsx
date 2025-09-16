"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, RotateCcw, Sparkles } from "lucide-react"
import { Line, Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)

export default function WellnessCenterPage() {
  const [dailyStreak, setDailyStreak] = useState(7)
  const [meditationTime, setMeditationTime] = useState(15 * 60) // 15 minutes in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [currentTime, setCurrentTime] = useState(15 * 60)
  const [breathingPhase, setBreathingPhase] = useState<"inhale" | "hold" | "exhale">("inhale")
  const [breathingCount, setBreathingCount] = useState(0)
  const [isBreathingActive, setIsBreathingActive] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const breathingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Mock mood data
  const moodData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Mood Score",
        data: [4, 3, 5, 4, 5, 3, 4],
        borderColor: "rgb(236, 72, 153)",
        backgroundColor: "rgba(236, 72, 153, 0.1)",
        tension: 0.4,
      },
    ],
  }

  const moodBarData = {
    labels: ["Excellent", "Good", "Okay", "Poor"],
    datasets: [
      {
        label: "Days",
        data: [12, 18, 8, 3],
        backgroundColor: [
          "rgba(34, 197, 94, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(251, 191, 36, 0.8)",
          "rgba(239, 68, 68, 0.8)",
        ],
      },
    ],
  }

  const wellnessGoals = [
    { name: "Daily meditation", current: 5, total: 7, percentage: 71 },
    { name: "Breathing exercises", current: 6, total: 7, percentage: 86 },
    { name: "Mood tracking", current: 7, total: 7, percentage: 100 },
  ]

  const exercises = [
    {
      title: "Breathing Exercise",
      subtitle: "4-7-8 technique",
      duration: "5 min",
      difficulty: "Beginner",
      description: "Inhale for 4 seconds, hold for 7 seconds, exhale for 8 seconds",
    },
    {
      title: "Guided Meditation",
      subtitle: "Mindfulness for stress relief",
      duration: "10 min",
      difficulty: "Intermediate",
      description: "Focus on breath awareness and present moment mindfulness",
    },
    {
      title: "Energy Boost",
      subtitle: "Quick body activation",
      duration: "3 min",
      difficulty: "Beginner",
      description: "Simple movements to energize your body and mind",
    },
    {
      title: "Sleep Preparation",
      subtitle: "Relaxation for better sleep",
      duration: "15 min",
      difficulty: "Beginner",
      description: "Progressive muscle relaxation and calming visualization",
    },
  ]

  // Timer functionality
  useEffect(() => {
    if (isTimerRunning && currentTime > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((prev) => prev - 1)
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isTimerRunning, currentTime])

  // Breathing exercise functionality
  useEffect(() => {
    if (isBreathingActive) {
      const phases = [
        { phase: "inhale", duration: 4000 },
        { phase: "hold", duration: 7000 },
        { phase: "exhale", duration: 8000 },
      ]
      let currentPhaseIndex = 0

      const runBreathingCycle = () => {
        const currentPhaseData = phases[currentPhaseIndex]
        setBreathingPhase(currentPhaseData.phase as "inhale" | "hold" | "exhale")

        breathingIntervalRef.current = setTimeout(() => {
          currentPhaseIndex = (currentPhaseIndex + 1) % phases.length
          if (currentPhaseIndex === 0) {
            setBreathingCount((prev) => prev + 1)
          }
          runBreathingCycle()
        }, currentPhaseData.duration)
      }

      runBreathingCycle()
    } else {
      if (breathingIntervalRef.current) {
        clearTimeout(breathingIntervalRef.current)
      }
    }

    return () => {
      if (breathingIntervalRef.current) {
        clearTimeout(breathingIntervalRef.current)
      }
    }
  }, [isBreathingActive])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning)
  }

  const resetTimer = () => {
    setIsTimerRunning(false)
    setCurrentTime(meditationTime)
  }

  const toggleBreathing = () => {
    setIsBreathingActive(!isBreathingActive)
    if (!isBreathingActive) {
      setBreathingCount(0)
      setBreathingPhase("inhale")
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
            Wellness Center
          </h1>
          <Sparkles className="h-8 w-8 text-pink-500 animate-pulse" />
        </div>
        <p className="text-xl text-muted-foreground">Take care of your mental and physical well-being</p>
        <div className="flex items-center justify-center gap-2">
          <Badge
            variant="secondary"
            className="text-lg px-4 py-2 bg-gradient-to-r from-pink-500/20 to-violet-500/20 animate-pulse"
          >
            🔥 {dailyStreak} Day Streak
          </Badge>
        </div>
      </div>

      {/* Weekly Mood Overview */}
      <Card className="border-pink-200 dark:border-pink-800">
        <CardHeader>
          <CardTitle className="text-pink-600 dark:text-pink-400">Track your emotional well-being</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium mb-4">Weekly Mood Trend</h4>
              <Line
                data={moodData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                  },
                  scales: {
                    y: { beginAtZero: true, max: 5 },
                  },
                }}
              />
            </div>
            <div>
              <h4 className="text-sm font-medium mb-4">Mood Distribution</h4>
              <Bar
                data={moodBarData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                  },
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wellness Goals */}
      <Card className="border-violet-200 dark:border-violet-800">
        <CardHeader>
          <CardTitle className="text-violet-600 dark:text-violet-400">Your progress this week</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {wellnessGoals.map((goal, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{goal.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {goal.current}/{goal.total} days
                  </span>
                </div>
                <Progress value={goal.percentage} className="h-3 animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Guided Meditation Timer */}
      <Card className="border-pink-200 dark:border-pink-800">
        <CardHeader>
          <CardTitle className="text-pink-600 dark:text-pink-400">Guided Meditation Timer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <div className="w-48 h-48 rounded-full border-8 border-pink-200 dark:border-pink-800 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold text-pink-600 dark:text-pink-400">{formatTime(currentTime)}</div>
                  <div className="text-sm text-muted-foreground">minutes</div>
                </div>
              </div>
              <div
                className="absolute inset-0 rounded-full border-8 border-transparent border-t-pink-500 animate-spin"
                style={{
                  animationDuration: isTimerRunning ? "2s" : "0s",
                  opacity: isTimerRunning ? 1 : 0,
                }}
              />
            </div>
            <div className="flex gap-4">
              <Button onClick={toggleTimer} size="lg" className="bg-pink-500 hover:bg-pink-600">
                {isTimerRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                {isTimerRunning ? "Pause" : "Start"}
              </Button>
              <Button onClick={resetTimer} variant="outline" size="lg">
                <RotateCcw className="h-5 w-5" />
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Breathing Exercise */}
      <Card className="border-violet-200 dark:border-violet-800">
        <CardHeader>
          <CardTitle className="text-violet-600 dark:text-violet-400">4-7-8 Breathing Exercise</CardTitle>
          <p className="text-sm text-muted-foreground">
            Inhale for 4 seconds, hold for 7 seconds, exhale for 8 seconds
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <div
                className={`w-32 h-32 rounded-full border-4 transition-all duration-1000 flex items-center justify-center ${
                  breathingPhase === "inhale"
                    ? "scale-125 border-green-500 bg-green-500/20"
                    : breathingPhase === "hold"
                      ? "scale-125 border-yellow-500 bg-yellow-500/20"
                      : "scale-75 border-blue-500 bg-blue-500/20"
                }`}
              >
                <div className="text-center">
                  <div className="text-lg font-bold capitalize">{breathingPhase}</div>
                  <div className="text-sm text-muted-foreground">Cycle {breathingCount}</div>
                </div>
              </div>
            </div>
            <Button onClick={toggleBreathing} size="lg" className="bg-violet-500 hover:bg-violet-600">
              {isBreathingActive ? "Stop" : "Start"} Breathing
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Exercise Library */}
      <Card>
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
            Mindful Exercises
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {exercises.map((exercise, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-pink-100 dark:border-pink-900"
              >
                <CardContent className="p-4 space-y-3">
                  <div className="space-y-1">
                    <Badge variant="secondary" className="text-xs">
                      {exercise.difficulty}
                    </Badge>
                    <h4 className="font-semibold">{exercise.title}</h4>
                    <p className="text-sm text-muted-foreground">{exercise.subtitle}</p>
                    <p className="text-xs text-muted-foreground">{exercise.description}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-pink-600 dark:text-pink-400">{exercise.duration}</span>
                    <Button size="sm" className="bg-gradient-to-r from-pink-500 to-violet-500">
                      Start
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
