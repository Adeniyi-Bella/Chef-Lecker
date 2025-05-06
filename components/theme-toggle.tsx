"use client"

import { useState, useEffect } from "react"
import { Sun, Moon, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"

export function ThemeToggle({ className = "" }) {
  const { theme, setTheme } = useTheme()
  const [isWhiteBackground, setIsWhiteBackground] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Only show the toggle after mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Apply the background color when the state changes
  useEffect(() => {
    if (isWhiteBackground) {
      document.body.classList.add("white-background")
    } else {
      document.body.classList.remove("white-background")
    }
  }, [isWhiteBackground])

  if (!mounted) {
    return null
  }

  return (
    <div className={`flex gap-2 ${className}`}>
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

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
            {theme === "light" ? (
              <Sun className="h-5 w-5" />
            ) : theme === "dark" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Monitor className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
