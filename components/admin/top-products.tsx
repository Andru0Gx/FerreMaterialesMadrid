"use client"

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"
import { Badge } from "@/components/ui/badge"

interface TopProductsProps {
  data: {
    name: string
    sales: number
  }[]
}

// Colores para las secciones del gráfico de pastel
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export function TopProducts({ data }: TopProductsProps) {
  // Limitar a 5 productos y obtener solo la primera palabra del nombre
  const limitedData = data.slice(0, 5).map((item) => ({
    ...item,
    shortName: item.name.split(" ")[0],
    fullName: item.name,
  }))

  // Calcular el total de ventas para los porcentajes
  const totalSales = limitedData.reduce((sum, product) => sum + product.sales, 0)

  return (
    <div className="flex flex-col md:flex-row items-center justify-between h-full gap-4">
      <div className="w-full md:w-1/2 h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={limitedData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="sales"
              nameKey="shortName"
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
            >
              {limitedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="w-full md:w-1/2">
        <h4 className="text-sm font-medium mb-3">Top 5 Productos</h4>
        <div className="space-y-3">
          {limitedData.map((product, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-sm font-medium truncate max-w-[120px]" title={product.fullName}>
                  {product.shortName}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">{product.sales}</span>
                <Badge variant="outline" className="text-xs">
                  {((product.sales / totalSales) * 100).toFixed(1)}%
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
