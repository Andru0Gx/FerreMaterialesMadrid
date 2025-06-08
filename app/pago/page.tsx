"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CreditCard, CheckCircle, Upload, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/hooks/use-auth"
import { useExchangeRate } from "@/hooks/use-exchange-rate"

// Datos de la empresa para pagos móviles y transferencias
const companyPaymentData = {
  pagoMovil: {
    bank: "0102 - Banco de Venezuela",
    cedula: "J-12345678-9",
    phone: "+58 412-1234567",
  },
  transferencia: {
    bank: "0102 - Banco de Venezuela",
    accountNumber: "01020123456789012345",
    rif: "J-12345678-9",
    accountHolder: "Ferre Materiales Madrid C.A.",
  },
}

// Direcciones de ejemplo del usuario
const userAddresses = [
  {
    id: "addr-1",
    name: "Casa",
    address: "Calle Principal 123",
    city: "Maturín",
    state: "Monagas",
    zip: "6201",
    isDefault: true,
  },
  {
    id: "addr-2",
    name: "Trabajo",
    address: "Avenida Comercial 456",
    city: "Maturín",
    state: "Monagas",
    zip: "6201",
    isDefault: false,
  },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { cart, clearCart } = useCart()
  const { user } = useAuth()
  const { formatPrice } = useExchangeRate()
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState("")
  const [paymentData, setPaymentData] = useState({
    bank: "",
    phone: "",
    reference: "",
    receipt: null as File | null,
  })

  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/pago")
      return
    }

    // Seleccionar dirección por defecto
    const defaultAddress = userAddresses.find((addr) => addr.isDefault)
    if (defaultAddress) {
      setSelectedAddress(defaultAddress.id)
    }
  }, [user, router])

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const tax = subtotal * 0.16 // 16% de impuesto
  const shipping = subtotal > 50 ? 0 : 10 // Envío gratis en compras mayores a $50
  const total = subtotal + tax + shipping

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedAddress) {
      toast({
        title: "Error",
        description: "Debes seleccionar una dirección de envío",
        variant: "destructive",
      })
      return
    }

    if ((paymentMethod === "pago-movil" || paymentMethod === "transferencia") && !paymentData.receipt) {
      toast({
        title: "Error",
        description: "Debes subir el comprobante de pago",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulamos el proceso de pago
    setTimeout(() => {
      clearCart()
      toast({
        title: "¡Pedido completado!",
        description: "Tu pedido ha sido procesado correctamente.",
        duration: 5000,
      })
      router.push("/pago/confirmacion")
      setIsSubmitting(false)
    }, 2000)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPaymentData((prev) => ({ ...prev, receipt: file }))
    }
  }

  const handlePaymentDataChange = (field: string, value: string) => {
    setPaymentData((prev) => ({ ...prev, [field]: value }))
  }

  if (!user) {
    return null
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-6">No hay productos para pagar</h1>
        <p className="text-gray-600 mb-8">Tu carrito está vacío. Agrega productos antes de proceder al pago.</p>
        <Link href="/productos">
          <Button size="lg">Ver productos</Button>
        </Link>
      </div>
    )
  }

  const selectedAddressData = userAddresses.find((addr) => addr.id === selectedAddress)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Finalizar compra</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulario de pago */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            {/* Dirección de envío */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Dirección de envío</h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Seleccionar dirección</Label>
                  <Select value={selectedAddress} onValueChange={setSelectedAddress}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una dirección" />
                    </SelectTrigger>
                    <SelectContent>
                      {userAddresses.map((address) => (
                        <SelectItem key={address.id} value={address.id}>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            <div>
                              <span className="font-medium">{address.name}</span>
                              {address.isDefault && (
                                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                  Predeterminada
                                </span>
                              )}
                              <div className="text-sm text-gray-500">
                                {address.address}, {address.city}
                              </div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedAddressData && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium">{selectedAddressData.name}</p>
                    <p className="text-sm text-gray-600">{selectedAddressData.address}</p>
                    <p className="text-sm text-gray-600">
                      {selectedAddressData.city}, {selectedAddressData.state} {selectedAddressData.zip}
                    </p>
                  </div>
                )}

                <div className="text-sm text-blue-600">
                  <Link href="/mi-cuenta?tab=direcciones">
                    ¿Quieres usar otra dirección? Gestiona tus direcciones aquí
                  </Link>
                </div>
              </div>
            </div>

            {/* Método de pago */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Método de pago</h2>

              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                <div className="flex items-center space-x-2 border rounded-md p-4">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Tarjeta de crédito/débito
                  </Label>
                </div>

                <div className="flex items-center space-x-2 border rounded-md p-4">
                  <RadioGroupItem value="pago-movil" id="pago-movil" />
                  <Label htmlFor="pago-movil">Pago Móvil</Label>
                </div>

                <div className="flex items-center space-x-2 border rounded-md p-4">
                  <RadioGroupItem value="transferencia" id="transferencia" />
                  <Label htmlFor="transferencia">Transferencia Bancaria</Label>
                </div>
              </RadioGroup>

              {/* Datos de la empresa para pago móvil */}
              {paymentMethod === "pago-movil" && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">Datos para Pago Móvil</h3>
                  <div className="space-y-1 text-sm text-blue-800">
                    <p>
                      <strong>Banco:</strong> {companyPaymentData.pagoMovil.bank}
                    </p>
                    <p>
                      <strong>Cédula:</strong> {companyPaymentData.pagoMovil.cedula}
                    </p>
                    <p>
                      <strong>Teléfono:</strong> {companyPaymentData.pagoMovil.phone}
                    </p>
                  </div>
                </div>
              )}

              {/* Datos de la empresa para transferencia */}
              {paymentMethod === "transferencia" && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <h3 className="font-medium text-green-900 mb-2">Datos para Transferencia</h3>
                  <div className="space-y-1 text-sm text-green-800">
                    <p>
                      <strong>Banco:</strong> {companyPaymentData.transferencia.bank}
                    </p>
                    <p>
                      <strong>Número de cuenta:</strong> {companyPaymentData.transferencia.accountNumber}
                    </p>
                    <p>
                      <strong>RIF:</strong> {companyPaymentData.transferencia.rif}
                    </p>
                    <p>
                      <strong>Titular:</strong> {companyPaymentData.transferencia.accountHolder}
                    </p>
                  </div>
                </div>
              )}

              {/* Formulario para tarjeta */}
              {paymentMethod === "card" && (
                <div className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Número de tarjeta</Label>
                    <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Fecha de expiración</Label>
                      <Input id="expiryDate" placeholder="MM/AA" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nameOnCard">Nombre en la tarjeta</Label>
                    <Input id="nameOnCard" required />
                  </div>
                </div>
              )}

              {/* Formulario para pago móvil y transferencia */}
              {(paymentMethod === "pago-movil" || paymentMethod === "transferencia") && (
                <div className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bank">Banco desde donde realizaste el pago</Label>
                    <Select onValueChange={(value) => handlePaymentDataChange("bank", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu banco" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0102">0102 - Banco de Venezuela</SelectItem>
                        <SelectItem value="0108">0108 - BBVA Provincial</SelectItem>
                        <SelectItem value="0114">0114 - Bancaribe</SelectItem>
                        <SelectItem value="0115">0115 - Banco Exterior</SelectItem>
                        <SelectItem value="0128">0128 - Banco Caroní</SelectItem>
                        <SelectItem value="0134">0134 - Banesco</SelectItem>
                        <SelectItem value="0151">0151 - BFC Banco Fondo Común</SelectItem>
                        <SelectItem value="0156">0156 - 100% Banco</SelectItem>
                        <SelectItem value="0157">0157 - DelSur Banco</SelectItem>
                        <SelectItem value="0163">0163 - Banco del Tesoro</SelectItem>
                        <SelectItem value="0166">0166 - Banco Agrícola de Venezuela</SelectItem>
                        <SelectItem value="0168">0168 - Bancrecer</SelectItem>
                        <SelectItem value="0169">0169 - Mi Banco</SelectItem>
                        <SelectItem value="0171">0171 - Banco Activo</SelectItem>
                        <SelectItem value="0172">0172 - Bancamiga</SelectItem>
                        <SelectItem value="0174">0174 - Banplus</SelectItem>
                        <SelectItem value="0175">0175 - Banco Bicentenario</SelectItem>
                        <SelectItem value="0177">0177 - Banco de la Fuerza Armada Nacional Bolivariana</SelectItem>
                        <SelectItem value="0191">0191 - Banco Nacional de Crédito</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono desde donde realizaste el pago</Label>
                    <Input
                      id="phone"
                      placeholder="+58 412-1234567"
                      value={paymentData.phone}
                      onChange={(e) => handlePaymentDataChange("phone", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reference">Número de referencia</Label>
                    <Input
                      id="reference"
                      placeholder="123456789"
                      value={paymentData.reference}
                      onChange={(e) => handlePaymentDataChange("reference", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="receipt">Comprobante de pago</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="receipt"
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileUpload}
                        required
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      <Upload className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-500">Sube una imagen o PDF del comprobante de pago</p>
                    {paymentData.receipt && (
                      <p className="text-sm text-green-600">✓ Archivo seleccionado: {paymentData.receipt.name}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Procesando..." : "Finalizar compra"}
            </Button>
          </form>
        </div>

        {/* Resumen del pedido */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
            <h2 className="text-xl font-bold mb-4">Resumen del pedido</h2>

            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <span className="text-gray-500 ml-1">x{item.quantity}</span>
                  </div>
                  <div className="text-right">
                    <div>{formatPrice(item.price * item.quantity).usd}</div>
                    <div className="text-xs text-gray-500">{formatPrice(item.price * item.quantity).bs}</div>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <div className="text-right">
                  <div>{formatPrice(subtotal).usd}</div>
                  <div className="text-xs text-gray-500">{formatPrice(subtotal).bs}</div>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Impuestos (16%)</span>
                <div className="text-right">
                  <div>{formatPrice(tax).usd}</div>
                  <div className="text-xs text-gray-500">{formatPrice(tax).bs}</div>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Envío</span>
                <span>{shipping === 0 ? "Gratis" : formatPrice(shipping).combined}</span>
              </div>

              <Separator />

              <div className="flex justify-between font-bold">
                <span>Total</span>
                <div className="text-right">
                  <div>{formatPrice(total).usd}</div>
                  <div className="text-sm text-gray-600">{formatPrice(total).bs}</div>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-500">
              <p className="flex items-center mb-2">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                Pago seguro garantizado
              </p>
              <p className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                Envío rápido en 24-48 horas
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
