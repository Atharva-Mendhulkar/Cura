"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Wind } from "lucide-react"

interface BreathingGuideProps {
  onComplete: () => void
}

export function BreathingGuide({ onComplete }: BreathingGuideProps) {
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale")
  const [progress, setProgress] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [cycleCount, setCycleCount] = useState(0)
  const timerRef = useRef<number | null>(null)

  const phases = {
    inhale: { duration: 4000, message: "Inhale slowly..." },
    hold: { duration: 7000, message: "Hold your breath..." },
    exhale: { duration: 8000, message: "Exhale slowly..." },
  }

  useEffect(() => {
    if (!isActive) return

    const currentPhase = phases[phase]
    const startTime = Date.now()

    const updateProgress = () => {
      const elapsed = Date.now() - startTime
      const phaseProgress = (elapsed / currentPhase.duration) * 100
      
      if (phaseProgress >= 100) {
        // Move to next phase
        if (phase === "exhale") {
          setCycleCount(prev => prev + 1)
          setPhase("inhale")
        } else if (phase === "inhale") {
          setPhase("hold")
        } else {
          setPhase("exhale")
        }
        setProgress(0)
      } else {
        setProgress(phaseProgress)
        timerRef.current = requestAnimationFrame(updateProgress)
      }
    }

    timerRef.current = requestAnimationFrame(updateProgress)

    return () => {
      if (timerRef.current) {
        cancelAnimationFrame(timerRef.current)
      }
    }
  }, [phase, isActive])

  useEffect(() => {
    if (cycleCount === 3) {
      setIsActive(false)
      onComplete()
    }
  }, [cycleCount, onComplete])

  const toggleExercise = () => {
    if (isActive) {
      setIsActive(false)
      setCycleCount(0)
      setPhase("inhale")
      setProgress(0)
    } else {
      setIsActive(true)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wind className="h-6 w-6" />
          4-7-8 Breathing Exercise
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <p className="text-2xl font-semibold">{phases[phase].message}</p>
          <p className="text-sm text-muted-foreground mt-2">Cycle {cycleCount + 1} of 3</p>
        </div>

        <Progress value={progress} className="h-2" />

        <div className="flex justify-center">
          <Button onClick={toggleExercise} size="lg">
            {isActive ? "Stop" : "Start"} Exercise
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
