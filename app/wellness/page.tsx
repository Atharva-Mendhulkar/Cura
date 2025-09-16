"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"

export default function WellnessPage() {
  const exercises = [
    {
      title: "Stretching",
      description: "Simple stretching exercises to improve flexibility and reduce stress.",
      duration: "10 mins"
    },
    {
      title: "Yoga",
      description: "Basic yoga poses for relaxation and mindfulness.",
      duration: "15 mins"
    },
    {
      title: "Progressive Relaxation",
      description: "Systematic muscle relaxation technique for stress relief.",
      duration: "12 mins"
    }
  ]

  return (
    <div className="grid gap-6 p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {exercises.map((exercise, index) => (
          <Card key={index} className="p-6">
            <h3 className="text-xl font-semibold mb-2">{exercise.title}</h3>
            <p className="text-muted-foreground mb-4">{exercise.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{exercise.duration}</span>
              <Button size="sm">
                <Play className="w-4 h-4 mr-2" />
                Start
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
