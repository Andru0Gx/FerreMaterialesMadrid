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
import { formatPrice } from "@/lib/utils"

interface Address {
  id: string
  name: string
  address: string
  city: string
  state: string
  zip: string
  isDefault: boolean
}

interface BankAccount {
  id: string
  type: "PAGO_MOVIL" | "TRANSFERENCIA"
  bank: string
  accountNumber?: string
  phone?: string
  document: string
  accountHolder: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { cart, clearCart, discount } = useCart()
  const { user, loading } = useAuth()
  const { rate } = useExchangeRate()
  const [paymentMethod, setPaymentMethod] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState("")
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loadingAddresses, setLoadingAddresses] = useState(true)
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([])
  const [loadingBankAccounts, setLoadingBankAccounts] = useState(true)
  const [selectedBankAccount, setSelectedBankAccount] = useState<BankAccount | null>(null)
  const [paymentData, setPaymentData] = useState({
    bank: "",
    phone: "",
    reference: "",
    receipt: null as File | null,
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/pago")
      return
    }

    const loadUserAddresses = async () => {
      if (user) {
        try {
          const response = await fetch(`/api/users/${user.id}/addresses`)
          if (response.ok) {
            const data = await response.json()
            setAddresses(data)
            // Seleccionar la dirección por defecto si existe
            const defaultAddress = data.find((addr: Address) => addr.isDefault)
            if (defaultAddress) {
              setSelectedAddress(defaultAddress.id)
            } else if (data.length > 0) {
              // Si no hay dirección por defecto, seleccionar la primera
              setSelectedAddress(data[0].id)
            }
          } else {
            throw new Error('Error al cargar las direcciones')
          }
        } catch (error) {
          console.error('Error cargando direcciones:', error)
          toast({
            title: "Error",
            description: "No se pudieron cargar las direcciones",
            variant: "destructive",
          })
        } finally {
          setLoadingAddresses(false)
        }
      }
    }

    const loadBankAccounts = async () => {
      try {
        const response = await fetch('/api/bank-accounts')
        if (response.ok) {
          const data = await response.json()
          setBankAccounts(data)
          // Si hay cuentas, seleccionar la primera por defecto
          if (data.length > 0) {
            setPaymentMethod(data[0].id)
            setSelectedBankAccount(data[0])
          }
        } else {
          throw new Error('Error al cargar las cuentas bancarias')
        }
      } catch (error) {
        console.error('Error cargando cuentas bancarias:', error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los métodos de pago",
          variant: "destructive",
        })
      } finally {
        setLoadingBankAccounts(false)
      }
    }

    loadUserAddresses()
    loadBankAccounts()
  }, [user, router, loading, toast])

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const discountAmount = discount?.discountAmount || 0
  const subtotalAfterDiscount = subtotal - discountAmount
  const tax = subtotalAfterDiscount * 0.16 // 16% de impuesto
  const shipping = subtotalAfterDiscount > 50 ? 0 : 10 // Envío gratis en compras mayores a $50
  const total = subtotalAfterDiscount + tax + shipping

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedAddress) {
      toast({
        title: "Error",
        description: "Debes seleccionar una dirección de envío",
        variant: "destructive",
      })
      return
    }

    if (!selectedBankAccount || !paymentData.receipt || !paymentData.bank) {
      toast({
        title: "Error",
        description: "Debes seleccionar un método de pago, el banco y subir el comprobante",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Crear la orden
      const orderData = {
        items: cart.map(item => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount || 0
        })),
        total,
        shippingAddressId: selectedAddress,
        paymentMethod: selectedBankAccount.type,
        paymentBank: paymentData.bank,
        paymentReference: paymentData.reference,
        phone: user?.phone || "",
        email: user?.email || "",
        discount: discount || null
      }

      const token = localStorage.getItem('token')

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || errorData.error || 'Error al crear la orden')
      }

      const order = await response.json()

      // Subir el comprobante de pago
      if (paymentData.receipt) {
        const formData = new FormData()
        formData.append('file', paymentData.receipt)
        formData.append('orderId', order.id)
        formData.append('type', 'payment_receipt')

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })

        if (!uploadResponse.ok) {
          throw new Error('Error al subir el comprobante')
        }
      }

      // Limpiar el carrito
      clearCart()

      // Redirigir a la página de confirmación con el ID de la orden
      router.push(`/pago/confirmacion?orderId=${order.id}`)
    } catch (error) {
      console.error('Error procesando el pago:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al procesar el pago",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
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

  if (loading || loadingAddresses || loadingBankAccounts) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-medium">Cargando...</h2>
      </div>
    )
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

  const selectedAddressData = addresses.find((addr) => addr.id === selectedAddress)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Finalizar compra</h1>

      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg font-medium">Procesando tu pedido...</p>
            <p className="text-gray-500">Por favor, no cierres esta ventana</p>
          </div>
        </div>
      )}

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
                  {addresses.length > 0 ? (
                    <Select value={selectedAddress} onValueChange={setSelectedAddress}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una dirección" />
                      </SelectTrigger>
                      <SelectContent>
                        {addresses.map((address) => (
                          <SelectItem key={address.id} value={address.id}>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2" />
                              <div>
                                <span className="font-medium">{address.name}</span>
                                <div className="text-sm text-gray-500">
                                  {address.address}, {address.city}
                                </div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500 mb-4">No tienes direcciones guardadas</p>
                      <Link href="/mi-cuenta?tab=direcciones">
                        <Button variant="outline">Agregar dirección</Button>
                      </Link>
                    </div>
                  )}
                </div>

                {selectedAddressData && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium">{selectedAddressData.name}</p>
                    <p className="text-sm text-gray-600">{selectedAddressData.address}</p>
                    <p className="text-sm text-gray-600">
                      {selectedAddressData.city}, {selectedAddressData.zip}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Método de pago */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Método de pago</h2>

              {bankAccounts.length === 0 ? (
                <p className="text-gray-600">No hay métodos de pago disponibles en este momento.</p>
              ) : (
                <>
                  <RadioGroup value={paymentMethod} onValueChange={(value) => {
                    setPaymentMethod(value)
                    const account = bankAccounts.find(acc => acc.id === value)
                    setSelectedBankAccount(account || null)
                  }} className="space-y-4">
                    {bankAccounts.map((account) => (
                      <div key={account.id} className="flex items-center space-x-2 border rounded-md p-4">
                        <RadioGroupItem value={account.id} id={account.id} />
                        <Label htmlFor={account.id}>
                          {account.type === "PAGO_MOVIL" ? "Pago Móvil" : "Transferencia"} - {account.bank}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>

                  {selectedBankAccount && (
                    <div className={`mt-4 p-4 rounded-lg ${selectedBankAccount.type === "PAGO_MOVIL" ? "bg-blue-50" : "bg-green-50"
                      }`}>
                      <h3 className={`font-medium mb-2 ${selectedBankAccount.type === "PAGO_MOVIL" ? "text-blue-900" : "text-green-900"
                        }`}>
                        Datos para {selectedBankAccount.type === "PAGO_MOVIL" ? "Pago Móvil" : "Transferencia"}
                      </h3>
                      <div className={`space-y-1 text-sm ${selectedBankAccount.type === "PAGO_MOVIL" ? "text-blue-800" : "text-green-800"
                        }`}>
                        <p><strong>Titular:</strong> {selectedBankAccount.accountHolder}</p>
                        <p><strong>Banco:</strong> {selectedBankAccount.bank}</p>
                        <p><strong>{selectedBankAccount.type === "PAGO_MOVIL" ? "Cédula/RIF" : "Cédula/RIF"}:</strong> {selectedBankAccount.document}</p>
                        {selectedBankAccount.type === "PAGO_MOVIL" ? (
                          <p><strong>Teléfono:</strong> {selectedBankAccount.phone}</p>
                        ) : (
                          <p><strong>Número de cuenta:</strong> {selectedBankAccount.accountNumber}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedBankAccount && (
                    <div className="mt-4 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="bank">Banco desde donde realizaste el pago</Label>
                        <Select value={paymentData.bank} onValueChange={(value) => handlePaymentDataChange("bank", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona tu banco" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0172">0172 - BANCAMIGA</SelectItem>
                            <SelectItem value="0102">0102 - BANCO DE VENEZUELA</SelectItem>
                            <SelectItem value="0104">0104 - BANCO VENEZOLANO DE CRÉDITO</SelectItem>
                            <SelectItem value="0105">0105 - BANCO MERCANTIL</SelectItem>
                            <SelectItem value="0108">0108 - BANCO PROVINCIAL</SelectItem>
                            <SelectItem value="0114">0114 - BANCO DEL CARIBE</SelectItem>
                            <SelectItem value="0115">0115 - BANCO EXTERIOR</SelectItem>
                            <SelectItem value="0128">0128 - BANCO CARONÍ</SelectItem>
                            <SelectItem value="0134">0134 - BANESCO</SelectItem>
                            <SelectItem value="0137">0137 - BANCO SOFITASA</SelectItem>
                            <SelectItem value="0138">0138 - BANCO PLAZA</SelectItem>
                            <SelectItem value="0146">0146 - BANGENTE</SelectItem>
                            <SelectItem value="0151">0151 - BFC BANCO FONDO COMÚN</SelectItem>
                            <SelectItem value="0156">0156 - 100% BANCO</SelectItem>
                            <SelectItem value="0157">0157 - DELSUR BANCO</SelectItem>
                            <SelectItem value="0163">0163 - BANCO DEL TESORO</SelectItem>
                            <SelectItem value="0168">0168 - BANCRECER</SelectItem>
                            <SelectItem value="0169">0169 - MIBANCO</SelectItem>
                            <SelectItem value="0171">0171 - BANCO ACTIVO</SelectItem>
                            <SelectItem value="0174">0174 - BANPLUS</SelectItem>
                            <SelectItem value="0175">0175 - BANCO BICENTENARIO</SelectItem>
                            <SelectItem value="0177">0177 - BANFANB</SelectItem>
                            <SelectItem value="0191">0191 - BANCO NACIONAL DE CRÉDITO</SelectItem>
                            <SelectItem value="0601">0601 - INSTITUTO MUNICIPAL DE CRÉDITO POPULAR</SelectItem>
                          </SelectContent>
                        </Select>
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

                      <div>
                        <Label htmlFor="receipt">Comprobante de pago</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            id="receipt"
                            type="file"
                            accept="image/*,.pdf"
                            onChange={handleFileUpload}
                            required
                            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer h-fit"
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
                </>
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
                    <div>{formatPrice(item.price * item.quantity, rate).usd}</div>
                    <div className="text-xs text-gray-500">{formatPrice(item.price * item.quantity, rate).bs}</div>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <div className="text-right">
                  <div>{formatPrice(subtotal, rate).usd}</div>
                  <div className="text-xs text-gray-500">{formatPrice(subtotal, rate).bs}</div>
                </div>
              </div>

              {discount && (
                <div className="flex justify-between text-green-600">
                  <span>Descuento ({discount.code})</span>
                  <div className="text-right">
                    <div>-{formatPrice(discountAmount, rate).usd}</div>
                    <div className="text-xs">-{formatPrice(discountAmount, rate).bs}</div>
                  </div>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-600">Impuestos (16%)</span>
                <div className="text-right">
                  <div>{formatPrice(tax, rate).usd}</div>
                  <div className="text-xs text-gray-500">{formatPrice(tax, rate).bs}</div>
                </div>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Envío</span>
                <span>{shipping === 0 ? "Gratis" : formatPrice(shipping, rate).combined}</span>
              </div>

              <Separator />

              <div className="flex justify-between font-bold">
                <span>Total</span>
                <div className="text-right">
                  <div>{formatPrice(total, rate).usd}</div>
                  <div className="text-sm text-gray-600">{formatPrice(total, rate).bs}</div>
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
