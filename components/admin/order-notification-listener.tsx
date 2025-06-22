"use client"
import { useEffect, useRef } from "react"
import useSWR from "swr"

export function OrderNotificationListener() {
    // Sonido de notificación para nuevos pedidos
    const playNotificationSound = () => {
        const audio = new Audio("/notification.mp3")
        audio.play()
    }

    // SWR para pedidos
    const { data: swrOrders } = useSWR('/api/orders', async (url) => {
        const response = await fetch(url)
        if (!response.ok) throw new Error('Error al cargar los pedidos')
        return response.json()
    }, { refreshInterval: 2500 })

    // Detectar nuevos pedidos y reproducir sonido
    const prevOrdersCount = useRef<number>(0)
    useEffect(() => {
        if (swrOrders && Array.isArray(swrOrders)) {
            if (prevOrdersCount.current && swrOrders.length > prevOrdersCount.current) {
                playNotificationSound()
            }
            prevOrdersCount.current = swrOrders.length
        }
    }, [swrOrders])

    return null
}
