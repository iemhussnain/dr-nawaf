"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts"

const data = [
  { name: "Jan", revenue: 45000, expenses: 32000 },
  { name: "Feb", revenue: 52000, expenses: 35000 },
  { name: "Mar", revenue: 61000, expenses: 38000 },
  { name: "Apr", revenue: 58000, expenses: 36000 },
  { name: "May", revenue: 67000, expenses: 40000 },
  { name: "Jun", revenue: 72000, expenses: 42000 },
  { name: "Jul", revenue: 78000, expenses: 45000 },
]

export function RevenueChart() {
  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">
          Revenue Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis
              dataKey="name"
              stroke="#6B7280"
              style={{ fontSize: "12px" }}
            />
            <YAxis stroke="#6B7280" style={{ fontSize: "12px" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "1px solid #374151",
                borderRadius: "8px",
                color: "#F9FAFB"
              }}
              formatter={(value) => `$${value.toLocaleString()}`}
            />
            <Legend />
            <Bar dataKey="revenue" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            <Bar dataKey="expenses" fill="#EF4444" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
