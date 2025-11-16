import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUp, ArrowDown } from "lucide-react"

export function StatsCard({ title, value, change, changeType, icon: Icon, iconColor }) {
  const isPositive = changeType === "positive"

  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${iconColor}`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          {value}
        </div>
        {change && (
          <div className="flex items-center gap-1 mt-2">
            {isPositive ? (
              <ArrowUp className="h-4 w-4 text-green-500" />
            ) : (
              <ArrowDown className="h-4 w-4 text-red-500" />
            )}
            <span
              className={`text-sm font-medium ${
                isPositive ? "text-green-500" : "text-red-500"
              }`}
            >
              {change}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              vs last month
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
