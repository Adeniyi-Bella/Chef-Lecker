"use client"

import { useState, useEffect } from "react"
import { Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"

export function BackgroundToggle() {
  const [isWhiteBackground, setIsWhiteBackground] = useState(false)

  // Apply the background color when the state changes
  useEffect(() => {
    if (isWhiteBackground) {
      document.body.classList.add("white-background")
    } else {
      document.body.classList.remove("white-background")
    }
  }, [isWhiteBackground])

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setIsWhiteBackground(!isWhiteBackground)}
      aria-label={isWhiteBackground ? "Switch to default background" : "Switch to white background"}
      title={isWhiteBackground ? "Switch to default background" : "Switch to white background"}
      className="rounded-full h-10 w-10"
    >
      {isWhiteBackground ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </Button>
  )
}
