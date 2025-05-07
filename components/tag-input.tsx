"use client"

import type React from "react"

import { useState } from "react"
import { X, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  suggestions?: string[]
}

export function TagInput({ value = [], onChange, suggestions = [] }: TagInputProps) {
  const [inputValue, setInputValue] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Common tag suggestions
  const commonTags =
    suggestions.length > 0
      ? suggestions
      : [
          "vegan",
          "vegetarian",
          "gluten-free",
          "dairy-free",
          "quick",
          "easy",
          "hard",
          "beef",
          "chicken",
          "fish",
          "breakfast",
          "lunch",
          "dinner",
          "dessert",
        ]

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase()
    if (trimmedTag && !value.includes(trimmedTag)) {
      onChange([...value, trimmedTag])
    }
    setInputValue("")
  }

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue) {
      e.preventDefault()
      addTag(inputValue)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((tag) => (
          <Badge key={tag} variant="secondary" className="flex items-center gap-1 capitalize">
            {tag}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={() => removeTag(tag)}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {tag}</span>
            </Button>
          </Badge>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder="Add tag (e.g., vegan, easy, beef...)"
          className="flex-1"
        />
        <Button
          type="button"
          size="sm"
          onClick={() => {
            if (inputValue) addTag(inputValue)
          }}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>

      {showSuggestions && (
        <div className="flex flex-wrap gap-1 mt-2">
          {commonTags
            .filter((tag) => !value.includes(tag) && tag.includes(inputValue.toLowerCase()))
            .slice(0, 8)
            .map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="cursor-pointer capitalize hover:bg-secondary"
                onClick={() => addTag(tag)}
              >
                {tag}
              </Badge>
            ))}
        </div>
      )}
    </div>
  )
}
