import { useState, useEffect } from 'react'

interface ShippingConfig {
    amount: number
    isActive: boolean
}

export function useShipping() {
    const [shippingConfig, setShippingConfig] = useState<ShippingConfig>({
        amount: 10,
        isActive: false
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadShippingConfig = async () => {
            try {
                const response = await fetch('/api/promotions')
                const promotions = await response.json()
                const shippingPromo = promotions.find(
                    (p: any) => p.couponCode === 'ENVIO_GRATIS_GLOBAL' && p.discountType === 'ENVIO_GRATIS'
                )

                if (shippingPromo) {
                    setShippingConfig({
                        amount: shippingPromo.discountValue,
                        isActive: shippingPromo.active
                    })
                }
            } catch (error) {
                console.error('Error loading shipping config:', error)
            } finally {
                setLoading(false)
            }
        }

        loadShippingConfig()
    }, [])

    const getShippingCost = (subtotal: number) => {
        if (shippingConfig.isActive) {
            return 0
        }
        return shippingConfig.amount
    }

    return {
        shippingConfig,
        loading,
        getShippingCost
    }
} 