import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, showBs = true): string {
  const usdFormatted = new Intl.NumberFormat("us-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount)

  if (!showBs) {
    return usdFormatted
  }

  // Usar una tasa de cambio por defecto si no está disponible
  const exchangeRate = 36.5 // Este valor se puede actualizar dinámicamente
  const bsAmount = amount * exchangeRate
  const bsFormatted = `${bsAmount.toLocaleString("es-VE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} Bs`

  return `${usdFormatted} / ${bsFormatted}`
}
