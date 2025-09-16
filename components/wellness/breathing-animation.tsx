"use client"

import React from 'react'
import { cn } from '@/lib/utils'

interface BreathingAnimationProps {
  type: "478" | "box" | "relaxation"
  phase: "inhale" | "hold" | "exhale" | "pause"
  progress: number
  isActive: boolean
}

export function BreathingAnimation({ type, phase, progress, isActive }: BreathingAnimationProps) {
  if (type === "478") {
    return (
      <div className="relative w-48 h-48 mx-auto">
        {/* Circle animations */}
        <div 
          className={cn(
            "absolute inset-0 rounded-full border-4 border-primary/20 transition-all duration-300",
            phase === "inhale" && "scale-100 animate-circle-expand",
            phase === "hold" && "scale-150",
            phase === "exhale" && "animate-circle-contract",
            !isActive && "scale-100"
          )}
        />
        <div 
          className={cn(
            "absolute inset-0 rounded-full bg-primary/5 transform transition-all duration-300",
            phase === "inhale" && "scale-100 animate-circle-expand",
            phase === "hold" && "scale-150",
            phase === "exhale" && "animate-circle-contract",
            !isActive && "scale-100"
          )}
        />
        
        {/* Centered phase text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className={cn(
              "text-lg font-medium transition-all duration-300",
              phase === "inhale" ? "opacity-100 scale-100" : "opacity-0 scale-95"
            )}
          >
            Inhale (4s)
          </div>
          <div 
            className={cn(
              "absolute text-lg font-medium transition-all duration-300",
              phase === "hold" ? "opacity-100 scale-100" : "opacity-0 scale-95"
            )}
          >
            Hold (7s)
          </div>
          <div 
            className={cn(
              "text-lg font-medium transition-all duration-300",
              phase === "exhale" ? "opacity-100 scale-100" : "opacity-0 scale-95"
            )}
          >
            Exhale (8s)
          </div>
        </div>
      </div>
    )
  }

  if (type === "box") {
    return (
      <div className="relative w-48 h-48 mx-auto">
        <div className="absolute inset-0">
          <div className="relative w-full h-full border-2 border-primary/20 rounded">
            {/* Progress bar animations */}
            {/* Top border - Inhale */}
            <div 
              className={cn(
                "absolute top-0 left-0 h-1 bg-primary rounded-full transition-all duration-300",
                phase === "inhale" ? "w-full opacity-100" : "w-0 opacity-30"
              )}
              style={{
                transitionTimingFunction: "linear"
              }}
            />
            {/* Right border - Hold In */}
            <div 
              className={cn(
                "absolute top-0 right-0 w-1 bg-primary rounded-full transition-all duration-300",
                phase === "hold" ? "h-full opacity-100" : "h-0 opacity-30"
              )}
              style={{
                transitionTimingFunction: "linear"
              }}
            />
            {/* Bottom border - Exhale */}
            <div 
              className={cn(
                "absolute bottom-0 right-0 h-1 bg-primary rounded-full transition-all duration-300",
                phase === "exhale" ? "w-full opacity-100" : "w-0 opacity-30"
              )}
              style={{
                transitionTimingFunction: "linear"
              }}
            />
            {/* Left border - Pause */}
            <div 
              className={cn(
                "absolute bottom-0 left-0 w-1 bg-primary rounded-full transition-all duration-300",
                phase === "pause" ? "h-full opacity-100" : "h-0 opacity-30"
              )}
              style={{
                transitionTimingFunction: "linear"
              }}
            />
          </div>
          
          {/* Box animation */}
          <div className="absolute inset-4 flex items-center justify-center">
            <div 
              className={cn(
                "absolute inset-0 border-2 border-primary/30 rounded transition-all duration-300",
                phase === "inhale" && "scale-110",
                phase === "hold" && "scale-110 rotate-90",
                phase === "exhale" && "scale-100",
                phase === "pause" && "scale-100 -rotate-90"
              )}
              style={{
                transitionTimingFunction: "linear"
              }}
            />
            {/* Centered phase text */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div 
                className={cn(
                  "absolute text-lg font-medium text-primary/90 transition-all duration-300",
                  phase === "inhale" ? "opacity-100 scale-100" : "opacity-0 scale-95"
                )}
              >
                Inhale
              </div>
              <div 
                className={cn(
                  "absolute text-lg font-medium text-primary/90 transition-all duration-300",
                  phase === "hold" ? "opacity-100 scale-100" : "opacity-0 scale-95"
                )}
              >
                Hold
              </div>
              <div 
                className={cn(
                  "absolute text-lg font-medium text-primary/90 transition-all duration-300",
                  phase === "exhale" ? "opacity-100 scale-100" : "opacity-0 scale-95"
                )}
              >
                Exhale
              </div>
              <div 
                className={cn(
                  "absolute text-lg font-medium text-primary/90 transition-all duration-300",
                  phase === "pause" ? "opacity-100 scale-100" : "opacity-0 scale-95"
                )}
              >
                Hold
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (type === "relaxation") {
    return (
      <div className="relative w-64 h-64 mx-auto mt-8">
        {/* Phase text above waves */}
        <div className="absolute -top-2 left-0 right-0 flex items-center justify-center" style={{ zIndex: 20 }}>
          <div 
            className={cn(
              "absolute text-xl font-medium text-primary/90 bg-background/90 px-4 py-1.5 rounded-full transition-all duration-300 shadow-sm",
              phase === "inhale" ? "opacity-100 scale-100" : "opacity-0 scale-95"
            )}
          >
            Inhale
          </div>
          <div 
            className={cn(
              "absolute text-xl font-medium text-primary/90 bg-background/90 px-4 py-1.5 rounded-full transition-all duration-300 shadow-sm",
              phase === "exhale" ? "opacity-100 scale-100" : "opacity-0 scale-95"
            )}
          >
            Exhale
          </div>
        </div>

        {/* Wave animations */}
        <div className="relative w-full h-full overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "absolute inset-0 animate-wave",
                isActive && "running",
                !isActive && "paused"
              )}
              style={{
                animation: `wave ${12 + i * 2}s infinite linear`,
                opacity: 0.15 + i * 0.1,
                transform: `translateY(${30 + i * 15}%)`,
              }}
            >
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="w-full h-full"
                style={{ transform: `translateX(${i * 33}%)` }}
              >
                <path
                  d="M0,50 Q25,35 50,50 T100,50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-primary"
                />
              </svg>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return null
}
