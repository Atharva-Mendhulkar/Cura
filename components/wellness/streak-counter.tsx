"use client"

import { Card } from "@/components/ui/card"
import { Flame } from "lucide-react"

interface StreakCounterProps {
  streakDays: number
}

export function StreakCounter({ streakDays }: StreakCounterProps) {
  const getStreakColor = () => {
    if (streakDays === 0) return "text-muted-foreground"
    if (streakDays < 7) return "text-orange-500"
    if (streakDays < 30) return "text-red-500"
    return "text-purple-500"
  }

  return (
    <Card className="inline-flex items-center gap-2 px-4 py-2" aria-label={`Streak: ${streakDays} days`}>
      <Flame className={`h-5 w-5 ${getStreakColor()}`} />
    </Card>
  )
}
