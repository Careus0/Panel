
"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Return a placeholder or null to avoid hydration mismatch
    return <div className="w-10 h-10" /> // Placeholder for SSR to match client
  }

  const isDarkMode = theme === "dark"

  const toggleTheme = () => {
    setTheme(isDarkMode ? "light" : "dark")
  }

  return (
    <div className="flex items-center space-x-2">
      <Sun className={`h-5 w-5 transition-all ${isDarkMode ? 'text-muted-foreground' : 'text-yellow-500'}`} />
      <Switch
        id="theme-switch"
        checked={isDarkMode}
        onCheckedChange={toggleTheme}
        aria-label="Ganti tema" // Diubah
      />
      <Moon className={`h-5 w-5 transition-all ${isDarkMode ? 'text-primary' : 'text-muted-foreground'}`} />
    </div>
  )
}
