"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Timer, Play, Wind, Pause, Info } from "lucide-react"
import { BreathingAnimation } from "@/components/wellness/breathing-animation"
import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function BreathingPage() {
  const [isBreathing, setIsBreathing] = useState(false)
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale')
  const [progress, setProgress] = useState(0)
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)
  const [activePattern, setActivePattern] = useState<string | null>(null)

  const breathingPatterns = [
    {
      id: "478",
      name: "4-7-8 Breathing",
      description: "A natural tranquilizer for the nervous system",
      details: [
        "Find a comfortable position",
        "Touch the tip of your tongue to the roof of your mouth",
        "Exhale completely through your mouth",
        "Close your mouth and inhale through your nose for 4 seconds",
        "Hold your breath for 7 seconds",
        "Exhale completely through your mouth for 8 seconds",
        "Repeat this cycle up to 4 times"
      ],
      inhale: 4,
      hold: 7,
      exhale: 8,
      benefits: [
        "Reduces anxiety",
        "Helps manage stress",
        "Improves sleep quality",
        "Controls emotional responses"
      ]
    },
    {
      id: "box",
      name: "Box Breathing",
      description: "Used by Navy SEALs to stay calm and focused",
      details: [
        "Sit upright in a comfortable position",
        "Inhale deeply through your nose for 4 seconds",
        "Hold your breath for 4 seconds",
        "Exhale slowly through your mouth for 4 seconds",
        "Pause for 4 seconds before the next breath",
        "Repeat the cycle"
      ],
      inhale: 4,
      hold: 4,
      exhale: 4,
      pause: 4,
      benefits: [
        "Reduces stress",
        "Improves concentration",
        "Regulates blood pressure",
        "Increases mental clarity"
      ]
    },
    {
      id: "relaxation",
      name: "Deep Relaxation",
      description: "Promotes deep relaxation and mindfulness",
      details: [
        "Find a quiet, comfortable space",
        "Close your eyes and focus on your breathing",
        "Inhale deeply through your nose for 6 seconds",
        "Feel your diaphragm expand",
        "Exhale slowly through your mouth for 6 seconds",
        "Notice the sensation of relaxation"
      ],
      inhale: 6,
      hold: 0,
      exhale: 6,
      benefits: [
        "Reduces muscle tension",
        "Lowers heart rate",
        "Promotes mindfulness",
        "Enhances relaxation response"
      ]
    }
  ]

  const startBreathing = (pattern: typeof breathingPatterns[0]) => {
    setIsBreathing(true)
    setActivePattern(pattern.id)
    setCurrentPhase('inhale')
    setProgress(0)

    // Calculate total cycle time
    const totalTime = pattern.inhale + 
                     (pattern.hold || 0) + 
                     pattern.exhale + 
                     (pattern.pause || 0)
    let timeElapsed = 0
    let cycleCount = 0

    const interval = setInterval(() => {
      timeElapsed += 0.1
      
      // Calculate progress for current phase
      const cycleTime = timeElapsed % totalTime
      const progressPercent = (cycleTime / totalTime) * 100
      setProgress(progressPercent)

      // Determine current phase
      if (cycleTime < pattern.inhale) {
        setCurrentPhase('inhale')
      } else if (cycleTime < pattern.inhale + (pattern.hold || 0)) {
        setCurrentPhase('hold')
      } else if (cycleTime < pattern.inhale + (pattern.hold || 0) + pattern.exhale) {
        setCurrentPhase('exhale')
      } else {
        setCurrentPhase('pause')
      }

      // Reset cycle
      if (cycleTime >= totalTime) {
        cycleCount++
        timeElapsed = 0
        setProgress(0)
      }
    }, 100)

    setTimer(interval)
  }

  const stopBreathing = () => {
    if (timer) {
      clearInterval(timer)
    }
    setIsBreathing(false)
    setActivePattern(null)
    setProgress(0)
  }

  useEffect(() => {
    return () => {
      if (timer) {
        clearInterval(timer)
      }
    }
  }, [timer])

  return (
    <div className="space-y-8">
      {/* Title and Introduction */}
      <div>
        <h2 className="text-2xl font-semibold mb-2">Breathing Exercises</h2>
        <p className="text-muted-foreground">
          Practice these breathing techniques to reduce stress, increase focus, and promote relaxation.
        </p>
      </div>

      {/* Breathing Patterns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {breathingPatterns.map((pattern) => (
          <Card key={pattern.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Wind className="h-5 w-5" />
                  {pattern.name}
                </span>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Info className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{pattern.name}</AlertDialogTitle>
                      <AlertDialogDescription>
                        <div className="space-y-4">
                          <p className="font-medium">{pattern.description}</p>
                          
                          <div>
                            <h4 className="font-semibold mb-2">Instructions:</h4>
                            <ul className="list-disc pl-5 space-y-1">
                              {pattern.details.map((detail, i) => (
                                <li key={i}>{detail}</li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2">Benefits:</h4>
                            <ul className="list-disc pl-5 space-y-1">
                              {pattern.benefits.map((benefit, i) => (
                                <li key={i}>{benefit}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                  </AlertDialogContent>
                </AlertDialog>
              </CardTitle>
              <CardDescription>{pattern.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {activePattern === pattern.id ? (
                <div className="space-y-6 flex-1 flex flex-col">
                  <div className="flex-1 flex flex-col items-center">
                    <div className="relative w-full flex-1 flex flex-col items-center justify-center min-h-[300px]">
                      <div className="mb-8">
                        <BreathingAnimation
                          type={pattern.id as "478" | "box" | "relaxation"}
                          phase={currentPhase}
                          progress={progress}
                          isActive={activePattern === pattern.id}
                        />
                      </div>
                    </div>
                    
                    <div className="w-full max-w-md">
                      <Progress 
                        value={progress} 
                        className="h-2 rounded-full" 
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-center w-full">
                    <Button 
                      variant="outline" 
                      className="w-full max-w-[200px]" 
                      onClick={() => stopBreathing()}
                    >
                      <Pause className="mr-2 h-4 w-4" />
                      Stop
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    <ul className="text-sm space-y-1 text-muted-foreground mb-6">
                      <li>• Inhale: {pattern.inhale} seconds</li>
                      {pattern.hold > 0 && <li>• Hold: {pattern.hold} seconds</li>}
                      <li>• Exhale: {pattern.exhale} seconds</li>
                      {pattern.pause && <li>• Pause: {pattern.pause} seconds</li>}
                    </ul>
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={() => startBreathing(pattern)}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Start Exercise
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
