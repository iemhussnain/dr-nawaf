"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Bell,
  Calendar,
  ShoppingBag,
  AlertCircle,
  Megaphone,
  Check,
  Trash2,
  Loader2,
} from "lucide-react"
import axiosInstance from "@/lib/axios"
import { toast } from "sonner"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)

const notificationIcons = {
  appointment: Calendar,
  order: ShoppingBag,
  reminder: AlertCircle,
  announcement: Megaphone,
}

export function NotificationDropdown() {
  const router = useRouter()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    fetchNotifications()
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await axiosInstance.get("/api/notifications?limit=10")

      if (response.data.success) {
        setNotifications(response.data.data.notifications)
        setUnreadCount(response.data.data.unreadCount)
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
    }
  }

  const handleMarkAsRead = async (id) => {
    try {
      const response = await axiosInstance.put(`/api/notifications/${id}`)

      if (response.data.success) {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif._id === id ? { ...notif, isRead: true } : notif
          )
        )
        setUnreadCount((prev) => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.put("/api/notifications/mark-all-read")

      if (response.data.success) {
        setNotifications((prev) =>
          prev.map((notif) => ({ ...notif, isRead: true }))
        )
        setUnreadCount(0)
        toast.success("All notifications marked as read")
      }
    } catch (error) {
      console.error("Error marking all as read:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id, e) => {
    e.stopPropagation()

    try {
      const response = await axiosInstance.delete(`/api/notifications/${id}`)

      if (response.data.success) {
        const deletedNotif = notifications.find((n) => n._id === id)
        setNotifications((prev) => prev.filter((notif) => notif._id !== id))

        if (deletedNotif && !deletedNotif.isRead) {
          setUnreadCount((prev) => Math.max(0, prev - 1))
        }

        toast.success("Notification deleted")
      }
    } catch (error) {
      console.error("Error deleting notification:", error)
    }
  }

  const handleNotificationClick = async (notification) => {
    // Mark as read
    if (!notification.isRead) {
      await handleMarkAsRead(notification._id)
    }

    // Navigate to link if provided
    if (notification.link) {
      setOpen(false)
      router.push(notification.link)
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-[500px] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Notifications
          </h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={loading}
              className="text-xs"
            >
              {loading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <>
                  <Check className="h-3 w-3 mr-1" />
                  Mark all read
                </>
              )}
            </Button>
          )}
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <div className="py-12 text-center">
            <Bell className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              No notifications yet
            </p>
          </div>
        ) : (
          <>
            {notifications.map((notification) => {
              const Icon = notificationIcons[notification.type] || AlertCircle

              return (
                <DropdownMenuItem
                  key={notification._id}
                  className={`flex items-start gap-3 p-4 cursor-pointer ${
                    !notification.isRead ? "bg-blue-50 dark:bg-blue-900/20" : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div
                    className={`p-2 rounded-full ${
                      notification.type === "appointment"
                        ? "bg-blue-100 dark:bg-blue-900/30"
                        : notification.type === "order"
                        ? "bg-green-100 dark:bg-green-900/30"
                        : notification.type === "reminder"
                        ? "bg-orange-100 dark:bg-orange-900/30"
                        : "bg-purple-100 dark:bg-purple-900/30"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 ${
                        notification.type === "appointment"
                          ? "text-blue-600 dark:text-blue-400"
                          : notification.type === "order"
                          ? "text-green-600 dark:text-green-400"
                          : notification.type === "reminder"
                          ? "text-orange-600 dark:text-orange-400"
                          : "text-purple-600 dark:text-purple-400"
                      }`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium ${
                        !notification.isRead
                          ? "text-gray-900 dark:text-white"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {notification.title}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {dayjs(notification.createdAt).fromNow()}
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 flex-shrink-0 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={(e) => handleDelete(notification._id, e)}
                  >
                    <Trash2 className="h-3 w-3 text-gray-400 hover:text-red-600" />
                  </Button>
                </DropdownMenuItem>
              )
            })}

            {/* View All Link */}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href="/notifications"
                className="text-center w-full py-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 font-medium"
              >
                View all notifications
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
