"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"
import type { SalesData } from "@/lib/types"

interface SalesChartProps {
  data: SalesData[]
  period: "day" | "week" | "month" | "year"
}

// Componente personalizado para el tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-md shadow-md border border-gray-200">
        <p className="font-medium">{`${label}`}</p>
        <p className="text-sm text-gray-600">
          Ventas: <span className="font-medium">${payload[0].value.toLocaleString()}</span>
        </p>
      </div>
    )
  }

  return null
}

export function SalesChart({ data, period }: SalesChartProps) {
  const formattedData = data.map((item) => {
    let formattedDate = item.date

    // Formatear la fecha según el período
    if (period === "day") {
      // Si es formato hora (2023-03-20 08:00), extraer solo la hora
      if (item.date.includes(" ")) {
        formattedDate = item.date.split(" ")[1]
      }
    } else if (period === "week" || period === "month") {
      // Si es formato fecha completa (2023-03-20), extraer día y mes
      const date = new Date(item.date)
      formattedDate = `${date.getDate()}/${date.getMonth() + 1}`
    } else if (period === "year") {
      // Si es formato año-mes (2023-01), extraer mes
      if (item.date.includes("-")) {
        const parts = item.date.split("-")
        const month = Number.parseInt(parts[1])
        const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
        formattedDate = monthNames[month - 1]
      }
    }

    return {
      ...item,
      formattedDate,
    }
  })

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={formattedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="formattedDate" tick={{ fontSize: 12 }} tickMargin={10} />
        <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `$${value.toLocaleString()}`} />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="amount"
          stroke="#3b82f6"
          name="Ventas"
          strokeWidth={2}
          dot={{ r: 4, fill: "#3b82f6", stroke: "#3b82f6" }}
          activeDot={{ r: 6, fill: "#3b82f6", stroke: "#fff", strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
