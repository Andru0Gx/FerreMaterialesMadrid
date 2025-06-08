"use client"

import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { FilterOptions } from "@/lib/types"

interface DateFilterProps {
  value: FilterOptions
  onChange: (value: FilterOptions) => void
}

export function DateFilter({ value, onChange }: DateFilterProps) {
  const [date, setDate] = useState<Date | undefined>(value.startDate ? new Date(value.startDate) : undefined)

  const handlePeriodChange = (period: string) => {
    onChange({
      ...value,
      period: period as "day" | "week" | "month" | "year",
      startDate: undefined,
      endDate: undefined,
    })
  }

  const handleDateChange = (date: Date | undefined) => {
    setDate(date)
    if (date) {
      onChange({
        ...value,
        startDate: format(date, "yyyy-MM-dd"),
        endDate: format(date, "yyyy-MM-dd"),
      })
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={value.period} onValueChange={handlePeriodChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Seleccionar período" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="day">Hoy</SelectItem>
          <SelectItem value="week">Esta semana</SelectItem>
          <SelectItem value="month">Este mes</SelectItem>
          <SelectItem value="year">Este año</SelectItem>
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP", { locale: es }) : "Seleccionar fecha"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={date} onSelect={handleDateChange} initialFocus />
        </PopoverContent>
      </Popover>
    </div>
  )
}
