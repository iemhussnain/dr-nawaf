"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Calendar,
  Stethoscope,
  ShoppingBag,
  FileText,
  MessageSquare,
  Settings,
  Package,
  Bell
} from "lucide-react"

const menuItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Patients", href: "/admin/patients", icon: Users },
  { name: "Doctors", href: "/admin/doctors", icon: Stethoscope },
  { name: "Appointments", href: "/admin/appointments", icon: Calendar },
  { name: "Services", href: "/admin/services", icon: Package },
  { name: "Products", href: "/admin/products", icon: ShoppingBag },
  { name: "Blog", href: "/admin/blog", icon: FileText },
  { name: "FAQ", href: "/admin/faq", icon: MessageSquare },
  { name: "Notifications", href: "/admin/notifications", icon: Bell },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  const isActive = (href) => pathname === href

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <Stethoscope className="h-7 w-7 text-blue-600 dark:text-blue-400" />
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            Dr. Nawaf Admin
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive(item.href)
                  ? "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-10 h-10 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center">
            <span className="text-white font-medium">A</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              Admin User
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              admin@drnawaf.com
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}
