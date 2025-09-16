"use client"

import { useState } from "react"
import { Button } from "./button"
import { Card } from "./card"
import { Textarea } from "./textarea"
import { MOOD_EMOJIS } from "@/lib/constants"
import { t, getCurrentLanguage } from "@/lib/i18n"

interface MoodSelectorProps {
  onMoodSelect: (mood: number, note?: string) => void
  disabled?: boolean
}

export function MoodSelector({ onMoodSelect, disabled = false }: MoodSelectorProps) {
  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [note, setNote] = useState("")
  const language = getCurrentLanguage()

  const handleSubmit = () => {
    if (selectedMood) {
      onMoodSelect(selectedMood, note.trim() || undefined)
      setSelectedMood(null)
      setNote("")
    }
  }

  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-lg font-semibold text-center">{t("howAreYouFeeling", language)}</h3>

      <div className="flex justify-center gap-2">
        {MOOD_EMOJIS.map((mood) => (
          <Button
            key={mood.value}
            variant={selectedMood === mood.value ? "default" : "outline"}
            size="lg"
            onClick={() => setSelectedMood(mood.value)}
            disabled={disabled}
            className="flex flex-col gap-1 h-auto py-3 px-4"
          >
            <span className="text-2xl">{mood.emoji}</span>
            <span className="text-xs">{mood.label[language]}</span>
          </Button>
        ))}
      </div>

      {selectedMood && (
        <div className="space-y-3">
          <Textarea
            placeholder={t("addNote", language)}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            disabled={disabled}
            className="min-h-[80px]"
          />

          <Button onClick={handleSubmit} disabled={disabled} className="w-full">
            {t("save", language)}
          </Button>
        </div>
      )}
    </Card>
  )
}
