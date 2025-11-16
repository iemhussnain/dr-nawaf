"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Bell,
  Calendar,
  ShoppingBag,
  AlertCircle,
  Megaphone,
  Check,
  Trash2,
  Loader2,
  CheckCheck,
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

export default function NotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all") // all, unread, read
  const [typeFilter, setTypeFilter] = useState("all")
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1,
  })
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    fetchNotifications()
  }, [pagination.page, filter, typeFilter])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      })

      if (filter === "unread") params.append("isRead", "false")
      if (filter === "read") params.append("isRead", "true")
      if (typeFilter && typeFilter !== "all") params.append("type", typeFilter)

      const response = await axiosInstance.get(`/api/notifications?${params}`)

      if (response.data.success) {
        setNotifications(response.data.data.notifications)
        setPagination(response.data.data.pagination)
        setUnreadCount(response.data.data.unreadCount)
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (id) => {
    try {
      const response = await axiosInstance.put(`/api/notifications/${id}`)

      if (response.data.success) {
        fetchNotifications()
        toast.success("Notification marked as read")
      }
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const response = await axiosInstance.put("/api/notifications/mark-all-read")

      if (response.data.success) {
        fetchNotifications()
        toast.success("All notifications marked as read")
      }
    } catch (error) {
      console.error("Error marking all as read:", error)
    }
  }

  const handleDelete = async (id) => {
    try {
      const response = await axiosInstance.delete(`/api/notifications/${id}`)

      if (response.data.success) {
        fetchNotifications()
        toast.success("Notification deleted")
      }
    } catch (error) {
      console.error("Error deleting notification:", error)
    }
  }

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification._id)
    }

    if (notification.link) {
      router.push(notification.link)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Bell className="h-8 w-8" />
                Notifications
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {unreadCount > 0
                  ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                  : "You're all caught up!"}
              </p>
            </div>

            {unreadCount > 0 && (
              <Button onClick={handleMarkAllAsRead} variant="outline">
                <CheckCheck className="h-4 w-4 mr-2" />
                Mark All Read
              </Button>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="read">Read</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="appointment">Appointments</SelectItem>
                <SelectItem value="order">Orders</SelectItem>
                <SelectItem value="reminder">Reminders</SelectItem>
                <SelectItem value="announcement">Announcements</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : notifications.length === 0 ? (
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="py-16 text-center">
              <Bell className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No notifications
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {filter === "unread"
                  ? "You have no unread notifications"
                  : "You don't have any notifications yet"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="space-y-3">
              {notifications.map((notification) => {
                const Icon = notificationIcons[notification.type] || AlertCircle

                return (
                  <Card
                    key={notification._id}
                    className={`bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 cursor-pointer transition-all hover:shadow-md ${
                      !notification.isRead ? "border-l-4 border-l-blue-600" : ""
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div
                          className={`p-3 rounded-full flex-shrink-0 ${
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
                            className={`h-5 w-5 ${
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
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3
                                className={`font-semibold ${
                                  !notification.isRead
                                    ? "text-gray-900 dark:text-white"
                                    : "text-gray-600 dark:text-gray-400"
                                }`}
                              >
                                {notification.title}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-3 mt-2">
                                <p className="text-xs text-gray-500 dark:text-gray-500">
                                  {dayjs(notification.createdAt).fromNow()}
                                </p>
                                <Badge
                                  variant="outline"
                                  className="text-xs capitalize"
                                >
                                  {notification.type}
                                </Badge>
                                {!notification.isRead && (
                                  <Badge className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                    New
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <div className="flex gap-2 flex-shrink-0">
                              {!notification.isRead && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleMarkAsRead(notification._id)
                                  }}
                                  className="h-8 w-8"
                                >
                                  <Check className="h-4 w-4 text-blue-600" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDelete(notification._id)
                                }}
                                className="h-8 w-8 hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-600" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() =>
                    setPagination({ ...pagination, page: pagination.page - 1 })
                  }
                  disabled={pagination.page === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600 dark:text-gray-400 px-4">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <Button
                  variant="outline"
                  onClick={() =>
                    setPagination({ ...pagination, page: pagination.page + 1 })
                  }
                  disabled={pagination.page === pagination.pages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
