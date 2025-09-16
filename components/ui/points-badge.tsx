"use client"

import { Badge } from "./badge"
import { Card } from "./card"
import { Trophy, Flame, Star } from "lucide-react"

interface PointsBadgeProps {
  points: number
  streak: number
  level: number
  className?: string
}

export function PointsBadge({ points, streak, level, className }: PointsBadgeProps) {
  return (
    <Card className={`p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-accent" />
          <div>
            <p className="text-sm font-medium">{points} pts</p>
            <p className="text-xs text-muted-foreground">Level {level}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-medium">{streak}</span>
          </div>

          <Badge variant="secondary" className="bg-accent text-accent-foreground">
            <Star className="h-3 w-3 mr-1" />
            Active
          </Badge>
        </div>
      </div>
    </Card>
  )
}
