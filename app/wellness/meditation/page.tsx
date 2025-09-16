"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Timer, Play, Pause, RotateCcw, Volume2 } from "lucide-react"

export default function MeditationPage() {
  const [activeSession, setActiveSession] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const meditationSessions = [
    {
      id: "mindful",
      name: "Mindful Breathing",
      description: "Focus on your breath with this guided meditation",
      duration: 300, // 5 minutes
      audioUrl: "/meditations/mindful-breathing.mp3"
    },
    {
      id: "body-scan",
      name: "Body Scan",
      description: "Progressive relaxation through body awareness",
      duration: 600, // 10 minutes
      audioUrl: "/meditations/body-scan.mp3"
    },
    {
      id: "loving-kindness",
      name: "Loving-Kindness",
      description: "Cultivate compassion and positive emotions",
      duration: 900, // 15 minutes
      audioUrl: "/meditations/loving-kindness.mp3"
    }
  ]

  const startSession = (session: typeof meditationSessions[0]) => {
    setActiveSession(session.id)
    setIsPlaying(true)
    setProgress(0)

    // Set up audio
    if (audioRef.current) {
      audioRef.current.src = session.audioUrl
      audioRef.current.play()
    }

    // Set up progress timer
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsPlaying(false)
          setActiveSession(null)
          return 0
        }
        return prev + (100 / (session.duration / 1))
      })
    }, 1000)

    setTimer(interval)
  }

  const pauseSession = () => {
    setIsPlaying(false)
    if (timer) {
      clearInterval(timer)
    }
    if (audioRef.current) {
      audioRef.current.pause()
    }
  }

  const resumeSession = () => {
    setIsPlaying(true)
    if (audioRef.current) {
      audioRef.current.play()
    }
  }

  const stopSession = () => {
    setIsPlaying(false)
    setActiveSession(null)
    setProgress(0)
    if (timer) {
      clearInterval(timer)
    }
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <audio ref={audioRef} />
      
      {meditationSessions.map((session) => (
        <Card key={session.id}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5" />
              {session.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{session.description}</p>
            <div className="space-y-4">
              {activeSession === session.id ? (
                <>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Time Remaining</span>
                    <span>{formatTime(Math.ceil(session.duration * (1 - progress / 100)))}</span>
                  </div>
                  <Progress value={progress} />
                  <div className="flex gap-2">
                    {isPlaying ? (
                      <Button 
                        variant="outline" 
                        className="flex-1" 
                        onClick={pauseSession}
                      >
                        <Pause className="mr-2 h-4 w-4" />
                        Pause
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        className="flex-1" 
                        onClick={resumeSession}
                      >
                        <Play className="mr-2 h-4 w-4" />
                        Resume
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      onClick={stopSession}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <Button 
                  className="w-full" 
                  onClick={() => startSession(session)}
                >
                  <Play className="mr-2 h-4 w-4" />
                  Start {formatTime(session.duration)} Session
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
