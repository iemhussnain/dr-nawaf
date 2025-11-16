"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts"

const data = [
  { name: "Jan", appointments: 65, completed: 58 },
  { name: "Feb", appointments: 78, completed: 70 },
  { name: "Mar", appointments: 90, completed: 85 },
  { name: "Apr", appointments: 81, completed: 75 },
  { name: "May", appointments: 95, completed: 88 },
  { name: "Jun", appointments: 105, completed: 98 },
  { name: "Jul", appointments: 112, completed: 105 },
]

export function AppointmentsChart() {
  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">
          Appointments Trend
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
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
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="appointments"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ fill: "#3B82F6", r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="completed"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ fill: "#10B981", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
