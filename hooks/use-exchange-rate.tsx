import { useState, useEffect } from "react"

interface ExchangeRateResponse {
  fuente: string
  nombre: string
  compra: number
  venta: number
  promedio: number
  fechaActualizacion: string
}

export function useExchangeRate() {
  const [rate, setRate] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const response = await fetch('https://ve.dolarapi.com/v1/dolares/oficial')
        const data: ExchangeRateResponse = await response.json()
        setRate(Number(data.promedio.toFixed(2)))
        setError(null)
      } catch (err) {
        console.error('Error fetching exchange rate:', err)
        setError('Error al obtener la tasa de cambio')
        setRate(null)
      } finally {
        setLoading(false)
      }
    }

    fetchRate()

    // Actualizar la tasa cada hora
    const interval = setInterval(fetchRate, 3600000)

    return () => clearInterval(interval)
  }, [])

  return { rate, loading, error }
} 