"use client"

import { useState } from "react"
import { Bell, Search, Menu, LogOut, User, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

export function Header({ onMenuClick }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [notificationCount] = useState(2)

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push("/login")
  }

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 lg:px-6">
      {/* Left: Mobile menu + Search */}
      <div className="flex items-center gap-4 flex-1">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="hidden md:flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 max-w-md flex-1">
          <Search className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <input
            type="text"
            placeholder="Search patients, appointments..."
            className="bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 w-full"
          />
        </div>
      </div>

      {/* Right: Notifications + Theme + Profile */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-y-auto">
              <div className="px-2 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Upcoming appointment
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Appointment with John Doe at 10:00 AM
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">1 hour from now</p>
              </div>
              <div className="px-2 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  New patient message
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Jane Smith sent you a message
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">3 hours ago</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <div className="px-2 py-2">
              <Button variant="ghost" className="w-full text-sm">
                View all notifications
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {session?.user?.name?.[0] || "D"}
                </span>
              </div>
              <span className="hidden md:inline text-sm font-medium text-gray-900 dark:text-white">
                {session?.user?.name || "Doctor"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {session?.user?.name || "Doctor"}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {session?.user?.email || "doctor@drnawaf.com"}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/doctor/profile")}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/doctor/schedule")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Schedule Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
