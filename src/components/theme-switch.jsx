"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function ThemeSwitch() {
  const { theme, setTheme, systemTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const currentTheme = theme === "system" ? systemTheme : theme
  const isDark = currentTheme === "dark"

  return (
    <div className="flex items-center gap-2">
      <Sun className="h-4 w-4" />
      <Switch
        id="theme-switch"
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
      />
      <Moon className="h-4 w-4" />
      <Label htmlFor="theme-switch" className="sr-only">
        Toggle theme
      </Label>
    </div>
  )
}
