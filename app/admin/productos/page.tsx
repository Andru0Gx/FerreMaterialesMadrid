"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ImageUpload } from "@/components/admin/image-upload"
import { Plus, Search, MoreVertical, Edit, Trash, Tag, ArrowUpDown, ChevronUp, ChevronDown } from "lucide-react"
import { getProducts, getCategories, getPromotions } from "@/lib/data"
import { toast } from "@/components/ui/use-toast"

export default function ProductsPage() {
  // Estados para manejar los productos, categorías y promociones
  const [products, setProducts] = useState(getProducts())
  const [filteredProducts, setFilteredProducts] = useState(getProducts())
  const [categories, setCategories] = useState(getCategories)
  const [promotions, setPromotions] = useState(getPromotions())
  const [filteredPromotions, setFilteredPromotions] = useState(getPromotions())

  // Estados para los filtros
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [stockFilter, setStockFilter] = useState("all")
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [promotionSearchTerm, setPromotionSearchTerm] = useState("")
  const [promotionSortField, setPromotionSortField] = useState<string | null>(null)
  const [promotionSortDirection, setPromotionSortDirection] = useState<"asc" | "desc">("asc")

  // Estados para los formularios
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
  const [isPromotionDialogOpen, setIsPromotionDialogOpen] = useState(false)
  const [isDiscountDialogOpen, setIsDiscountDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeletePromotionDialogOpen, setIsDeletePromotionDialogOpen] = useState(false)

  // Estado para el producto o promoción seleccionada
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [selectedPromotion, setSelectedPromotion] = useState<any>(null)

  // Estado para el formulario de producto
  const [productForm, setProductForm] = useState({
    id: "",
    name: "",
    sku: "",
    category: "",
    price: "",
    stock: "",
    shortDescription: "",
    description: "",
    specifications: [] as { title: string; value: string }[],
    images: [] as string[],
  })

  // Estado para el formulario de promoción
  const [promotionForm, setPromotionForm] = useState({
    id: "",
    code: "",
    discountValue: "",
    discountType: "percentage", // "percentage" o "fixed"
    durationType: "date", // "date", "usage", "both"
    startDate: "",
    endDate: "",
    maxUsage: "",
    currentUsage: 0,
    isActive: false,
  })

  // Estado para el formulario de descuento
  const [discountForm, setDiscountForm] = useState({
    discountPercentage: "",
    startDate: "",
    endDate: "",
    description: "",
  })

  // Estado para nueva especificación
  const [newSpecification, setNewSpecification] = useState({
    title: "",
    value: "",
  })

  // Efecto para filtrar productos
  useEffect(() => {
    let result = products

    // Filtrar por término de búsqueda
    if (searchTerm) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtrar por categoría
    if (categoryFilter !== "all") {
      result = result.filter((product) => product.category.toLowerCase() === categoryFilter.toLowerCase())
    }

    // Filtrar por stock
    if (stockFilter !== "all") {
      result = result.filter((product) =>
        stockFilter === "inStock" ? product.inStock !== false : product.inStock === false,
      )
    }

    // Ordenar
    if (sortField) {
      result = [...result].sort((a, b) => {
        let valueA = a[sortField as keyof typeof a]
        let valueB = b[sortField as keyof typeof b]

        // Convertir a minúsculas si son strings
        if (typeof valueA === "string") valueA = valueA.toLowerCase()
        if (typeof valueB === "string") valueB = valueB.toLowerCase()

        if (valueA < valueB) return sortDirection === "asc" ? -1 : 1
        if (valueA > valueB) return sortDirection === "asc" ? 1 : -1
        return 0
      })
    }

    setFilteredProducts(result)
  }, [products, searchTerm, categoryFilter, stockFilter, sortField, sortDirection])

  // Efecto para filtrar promociones
  useEffect(() => {
    let result = promotions

    // Filtrar por término de búsqueda
    if (promotionSearchTerm) {
      result = result.filter(
        (promotion) =>
          promotion.name.toLowerCase().includes(promotionSearchTerm.toLowerCase()) ||
          promotion.description?.toLowerCase().includes(promotionSearchTerm.toLowerCase()),
      )
    }

    // Ordenar
    if (promotionSortField) {
      result = [...result].sort((a, b) => {
        let valueA = a[promotionSortField as keyof typeof a]
        let valueB = b[promotionSortField as keyof typeof b]

        // Convertir a minúsculas si son strings
        if (typeof valueA === "string") valueA = valueA.toLowerCase()
        if (typeof valueB === "string") valueB = valueB.toLowerCase()

        if (valueA < valueB) return promotionSortDirection === "asc" ? -1 : 1
        if (valueA > valueB) return promotionSortDirection === "asc" ? 1 : -1
        return 0
      })
    }

    setFilteredPromotions(result)
  }, [promotions, promotionSearchTerm, promotionSortField, promotionSortDirection])

  // Función para ordenar productos
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Función para ordenar promociones
  const handlePromotionSort = (field: string) => {
    if (promotionSortField === field) {
      setPromotionSortDirection(promotionSortDirection === "asc" ? "desc" : "asc")
    } else {
      setPromotionSortField(field)
      setPromotionSortDirection("asc")
    }
  }

  // Función para abrir el formulario de producto (nuevo o editar)
  const openProductForm = (product?: any) => {
    if (product) {
      setProductForm({
        id: product.id,
        name: product.name,
        sku: product.sku || "",
        category: product.category,
        price: product.price.toString(),
        stock: product.stock?.toString() || "0",
        shortDescription: product.shortDescription || "",
        description: product.description || "",
        specifications: Array.isArray(product.specifications)
          ? product.specifications.map((spec: string) => {
              const [title, value] = spec.split(": ")
              return { title: title || spec, value: value || "" }
            })
          : [],
        images: product.images || [],
      })
      setSelectedProduct(product)
    } else {
      setProductForm({
        id: "",
        name: "",
        sku: "",
        category: "",
        price: "",
        stock: "",
        shortDescription: "",
        description: "",
        specifications: [],
        images: [],
      })
      setSelectedProduct(null)
    }
    setIsProductDialogOpen(true)
  }

  // Función para abrir el formulario de promoción (nuevo o editar)
  const openPromotionForm = (promotion?: any) => {
    if (promotion) {
      setPromotionForm({
        id: promotion.id,
        code: promotion.couponCode || "",
        discountValue: promotion.discountValue?.toString() || "",
        discountType: promotion.discountType || "percentage",
        durationType: promotion.durationType || "date",
        startDate: promotion.startDate || "",
        endDate: promotion.endDate || "",
        maxUsage: promotion.maxUsage?.toString() || "",
        currentUsage: promotion.currentUsage || 0,
        isActive: promotion.active || false,
      })
      setSelectedPromotion(promotion)
    } else {
      setPromotionForm({
        id: "",
        code: "",
        discountValue: "",
        discountType: "percentage",
        durationType: "date",
        startDate: "",
        endDate: "",
        maxUsage: "",
        currentUsage: 0,
        isActive: false,
      })
      setSelectedPromotion(null)
    }
    setIsPromotionDialogOpen(true)
  }

  // Función para abrir el formulario de descuento
  const openDiscountForm = (product: any) => {
    setSelectedProduct(product)
    setDiscountForm({
      discountPercentage: product.discount?.toString() || "",
      startDate: "",
      endDate: "",
      description: "",
    })
    setIsDiscountDialogOpen(true)
  }

  // Función para confirmar eliminación de producto
  const confirmDeleteProduct = (product: any) => {
    setSelectedProduct(product)
    setIsDeleteDialogOpen(true)
  }

  // Función para confirmar eliminación de promoción
  const confirmDeletePromotion = (promotion: any) => {
    setSelectedPromotion(promotion)
    setIsDeletePromotionDialogOpen(true)
  }

  // Función para guardar un producto (nuevo o editado)
  const saveProduct = () => {
    const newProduct = {
      id: productForm.id || `product-${Date.now()}`,
      name: productForm.name,
      sku: productForm.sku,
      category: productForm.category,
      price: Number.parseFloat(productForm.price),
      stock: Number.parseInt(productForm.stock),
      inStock: Number.parseInt(productForm.stock) > 0,
      shortDescription: productForm.shortDescription,
      description: productForm.description,
      specifications: productForm.specifications.map((spec) => `${spec.title}: ${spec.value}`),
      images: productForm.images,
      rating: selectedProduct?.rating || 0,
      reviews: selectedProduct?.reviews || 0,
      discount: selectedProduct?.discount || 0,
      questions: selectedProduct?.questions || [],
      featured: selectedProduct?.featured || false,
    }

    if (selectedProduct) {
      // Editar producto existente
      setProducts(products.map((p) => (p.id === newProduct.id ? { ...p, ...newProduct } : p)))
      toast({
        title: "Producto actualizado",
        description: "El producto ha sido actualizado correctamente",
      })
    } else {
      // Agregar nuevo producto
      setProducts([...products, newProduct])
      toast({
        title: "Producto agregado",
        description: "El producto ha sido agregado correctamente",
      })
    }

    setIsProductDialogOpen(false)
  }

  // Función para guardar una promoción (nueva o editada)
  const savePromotion = () => {
    const newPromotion = {
      id: promotionForm.id || `promotion-${Date.now()}`,
      couponCode: promotionForm.code,
      discountValue: Number.parseFloat(promotionForm.discountValue),
      discountType: promotionForm.discountType,
      durationType: promotionForm.durationType,
      startDate: promotionForm.startDate,
      endDate: promotionForm.endDate,
      maxUsage: Number.parseInt(promotionForm.maxUsage),
      currentUsage: promotionForm.currentUsage,
      active: promotionForm.isActive,
    }

    if (selectedPromotion) {
      // Editar promoción existente
      setPromotions(promotions.map((p) => (p.id === newPromotion.id ? { ...p, ...newPromotion } : p)))
      toast({
        title: "Promoción actualizada",
        description: "La promoción ha sido actualizada correctamente",
      })
    } else {
      // Agregar nueva promoción
      setPromotions([...promotions, newPromotion])
      toast({
        title: "Promoción agregada",
        description: "La promoción ha sido agregada correctamente",
      })
    }

    setIsPromotionDialogOpen(false)
  }

  // Función para aplicar descuento a un producto
  const applyDiscount = () => {
    const discountValue = Number.parseFloat(discountForm.discountPercentage)

    setProducts(products.map((p) => (p.id === selectedProduct.id ? { ...p, discount: discountValue } : p)))

    toast({
      title: "Descuento aplicado",
      description: `Se ha aplicado un descuento del ${discountValue}% al producto "${selectedProduct.name}"`,
    })

    setIsDiscountDialogOpen(false)
  }

  // Función para eliminar un producto
  const deleteProduct = () => {
    setProducts(products.filter((p) => p.id !== selectedProduct.id))
    toast({
      title: "Producto eliminado",
      description: "El producto ha sido eliminado correctamente",
      variant: "destructive",
    })
    setIsDeleteDialogOpen(false)
  }

  // Función para eliminar una promoción
  const deletePromotion = () => {
    setPromotions(promotions.filter((p) => p.id !== selectedPromotion.id))
    toast({
      title: "Promoción eliminada",
      description: "La promoción ha sido eliminada correctamente",
      variant: "destructive",
    })
    setIsDeletePromotionDialogOpen(false)
  }

  // Función para cambiar el estado de una promoción
  const togglePromotionStatus = (promotion: any) => {
    setPromotions(promotions.map((p) => (p.id === promotion.id ? { ...p, active: !p.active } : p)))
    toast({
      title: promotion.active ? "Promoción desactivada" : "Promoción activada",
      description: `La promoción "${promotion.name}" ha sido ${promotion.active ? "desactivada" : "activada"}`,
    })
  }

  // Función para manejar cambios en el formulario de producto
  const handleProductFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setProductForm({
      ...productForm,
      [name]: value,
    })
  }

  // Función para manejar cambios en el formulario de promoción
  const handlePromotionFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setPromotionForm({
      ...promotionForm,
      [name]: value,
    })
  }

  // Función para manejar cambios en el checkbox de promoción activa
  const handlePromotionActiveChange = (checked: boolean) => {
    setPromotionForm({
      ...promotionForm,
      isActive: checked,
    })
  }

  // Función para manejar cambios en el formulario de descuento
  const handleDiscountFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setDiscountForm({
      ...discountForm,
      [name]: value,
    })
  }

  // Función para manejar cambios en la categoría seleccionada
  const handleCategoryChange = (value: string) => {
    setProductForm({
      ...productForm,
      category: value,
    })
  }

  // Función para manejar la subida de imágenes
  const handleImagesUpload = (urls: string[]) => {
    setProductForm({
      ...productForm,
      images: [...productForm.images, ...urls],
    })
  }

  // Función para eliminar una imagen
  const removeImage = (index: number) => {
    setProductForm({
      ...productForm,
      images: productForm.images.filter((_, i) => i !== index),
    })
  }

  // Función para manejar cambios en el formulario de nueva especificación
  const handleNewSpecificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewSpecification({
      ...newSpecification,
      [name]: value,
    })
  }

  // Función para agregar una nueva especificación
  const addSpecification = () => {
    if (newSpecification.title.trim() === "" || newSpecification.value.trim() === "") {
      toast({
        title: "Error",
        description: "El título y el valor de la especificación son obligatorios",
        variant: "destructive",
      })
      return
    }

    setProductForm({
      ...productForm,
      specifications: [...productForm.specifications, { ...newSpecification }],
    })

    setNewSpecification({
      title: "",
      value: "",
    })
  }

  // Función para eliminar una especificación
  const removeSpecification = (index: number) => {
    setProductForm({
      ...productForm,
      specifications: productForm.specifications.filter((_, i) => i !== index),
    })
  }

  // Renderizar el componente
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gestión de Productos</h1>

      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="products">Productos</TabsTrigger>
          <TabsTrigger value="promotions">Promociones</TabsTrigger>
        </TabsList>

        {/* Pestaña de Productos */}
        <TabsContent value="products">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar productos..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex flex-col md:flex-row gap-2">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Todas las categorías" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las categorías</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={stockFilter} onValueChange={setStockFilter}>
                  <SelectTrigger className="w-full md:w-[150px]">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="inStock">En stock</SelectItem>
                    <SelectItem value="outOfStock">Agotado</SelectItem>
                  </SelectContent>
                </Select>

                <Button onClick={() => openProductForm()} className="bg-orange-500 hover:bg-orange-600">
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Producto
                </Button>
              </div>
            </div>

            <div className="border rounded-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center">
                        Producto
                        {sortField === "name" && (
                          <span className="ml-1">
                            {sortDirection === "asc" ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </span>
                        )}
                        {sortField !== "name" && <ArrowUpDown className="ml-1 h-4 w-4" />}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                      onClick={() => handleSort("category")}
                    >
                      <div className="flex items-center">
                        Categoría
                        {sortField === "category" && (
                          <span className="ml-1">
                            {sortDirection === "asc" ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </span>
                        )}
                        {sortField !== "category" && <ArrowUpDown className="ml-1 h-4 w-4" />}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                      onClick={() => handleSort("price")}
                    >
                      <div className="flex items-center">
                        Precio
                        {sortField === "price" && (
                          <span className="ml-1">
                            {sortDirection === "asc" ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </span>
                        )}
                        {sortField !== "price" && <ArrowUpDown className="ml-1 h-4 w-4" />}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                      onClick={() => handleSort("discount")}
                    >
                      <div className="flex items-center">
                        Descuento
                        {sortField === "discount" && (
                          <span className="ml-1">
                            {sortDirection === "asc" ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </span>
                        )}
                        {sortField !== "discount" && <ArrowUpDown className="ml-1 h-4 w-4" />}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                      onClick={() => handleSort("inStock")}
                    >
                      <div className="flex items-center">
                        Stock
                        {sortField === "inStock" && (
                          <span className="ml-1">
                            {sortDirection === "asc" ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </span>
                        )}
                        {sortField !== "inStock" && <ArrowUpDown className="ml-1 h-4 w-4" />}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-4 text-center text-sm text-gray-500">
                        No se encontraron productos
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 text-sm font-medium text-gray-900">{product.name}</td>
                        <td className="px-4 py-4 text-sm text-gray-500">{product.category}</td>
                        <td className="px-4 py-4 text-sm text-gray-500">${product.price.toFixed(2)}</td>
                        <td className="px-4 py-4 text-sm text-gray-500">
                          {product.discount > 0 ? (
                            <Badge className="bg-blue-100 text-blue-800 border-blue-300">{product.discount}% OFF</Badge>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500">
                          {product.inStock ? (
                            <Badge className="bg-green-100 text-green-800 border-green-300">En stock</Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800 border-red-300">Agotado</Badge>
                          )}
                        </td>
                        <td className="px-4 py-4 text-right text-sm font-medium">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Abrir menú</span>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openProductForm(product)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openDiscountForm(product)}>
                                <Tag className="mr-2 h-4 w-4" />
                                Aplicar descuento
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => confirmDeleteProduct(product)} className="text-red-600">
                                <Trash className="mr-2 h-4 w-4" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* Pestaña de Promociones */}
        <TabsContent value="promotions">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar promociones..."
                  className="pl-8"
                  value={promotionSearchTerm}
                  onChange={(e) => setPromotionSearchTerm(e.target.value)}
                />
              </div>
              <Button onClick={() => openPromotionForm()} className="bg-orange-500 hover:bg-orange-600">
                <Plus className="mr-2 h-4 w-4" />
                Agregar Promoción
              </Button>
            </div>

            <div className="border rounded-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                      onClick={() => handlePromotionSort("couponCode")}
                    >
                      <div className="flex items-center">
                        Código promocional
                        {promotionSortField === "couponCode" && (
                          <span className="ml-1">
                            {promotionSortDirection === "asc" ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </span>
                        )}
                        {promotionSortField !== "couponCode" && <ArrowUpDown className="ml-1 h-4 w-4" />}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                      onClick={() => handlePromotionSort("discountValue")}
                    >
                      <div className="flex items-center">
                        Descuento
                        {promotionSortField === "discountValue" && (
                          <span className="ml-1">
                            {promotionSortDirection === "asc" ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </span>
                        )}
                        {promotionSortField !== "discountValue" && <ArrowUpDown className="ml-1 h-4 w-4" />}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                      onClick={() => handlePromotionSort("durationType")}
                    >
                      <div className="flex items-center">
                        Tipo de duración
                        {promotionSortField === "durationType" && (
                          <span className="ml-1">
                            {promotionSortDirection === "asc" ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </span>
                        )}
                        {promotionSortField !== "durationType" && <ArrowUpDown className="ml-1 h-4 w-4" />}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer">
                      <div className="flex items-center">Usos</div>
                    </th>
                    <th
                      className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                      onClick={() => handlePromotionSort("active")}
                    >
                      <div className="flex items-center">
                        Estado
                        {promotionSortField === "active" && (
                          <span className="ml-1">
                            {promotionSortDirection === "asc" ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </span>
                        )}
                        {promotionSortField !== "active" && <ArrowUpDown className="ml-1 h-4 w-4" />}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPromotions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-4 text-center text-sm text-gray-500">
                        No se encontraron promociones
                      </td>
                    </tr>
                  ) : (
                    filteredPromotions.map((promotion) => (
                      <tr key={promotion.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 text-sm font-medium text-gray-900">{promotion.couponCode}</td>
                        <td className="px-4 py-4 text-sm text-gray-500">
                          {promotion.discountValue}
                          {promotion.discountType === "percentage" ? "%" : "$"}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500">{promotion.durationType}</td>
                        <td className="px-4 py-4 text-sm text-gray-500">
                          {promotion.durationType === "date"
                            ? "-"
                            : `${promotion.currentUsage} / ${promotion.maxUsage}`}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500">
                          {promotion.active ? (
                            <Badge className="bg-green-100 text-green-800 border-green-300">Activa</Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-800 border-gray-300">Inactiva</Badge>
                          )}
                        </td>
                        <td className="px-4 py-4 text-right text-sm font-medium">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Abrir menú</span>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openPromotionForm(promotion)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => togglePromotionStatus(promotion)}>
                                <Tag className="mr-2 h-4 w-4" />
                                {promotion.active ? "Desactivar" : "Activar"}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => confirmDeletePromotion(promotion)}
                                className="text-red-600"
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Diálogo para agregar/editar producto */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedProduct ? "Editar Producto" : "Agregar Producto"}</DialogTitle>
            <DialogDescription>Completa los detalles del producto</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del producto</Label>
                <Input
                  id="name"
                  name="name"
                  value={productForm.name}
                  onChange={handleProductFormChange}
                  placeholder="Nombre del producto"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">Código / SKU</Label>
                <Input
                  id="sku"
                  name="sku"
                  value={productForm.sku}
                  onChange={handleProductFormChange}
                  placeholder="SKU-12345"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Categoría</Label>
                <Select value={productForm.category} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Precio en $</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={productForm.price}
                  onChange={handleProductFormChange}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Cantidad en Stock</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                value={productForm.stock}
                onChange={handleProductFormChange}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortDescription">Descripción corta</Label>
              <Textarea
                id="shortDescription"
                name="shortDescription"
                value={productForm.shortDescription}
                onChange={handleProductFormChange}
                placeholder="Breve descripción del producto"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción completa</Label>
              <Textarea
                id="description"
                name="description"
                value={productForm.description}
                onChange={handleProductFormChange}
                placeholder="Descripción detallada del producto"
                rows={4}
              />
            </div>

            <div className="space-y-4">
              <Label>Especificaciones del producto</Label>

              {/* Lista de especificaciones existentes */}
              {productForm.specifications.length > 0 && (
                <div className="space-y-2 mb-4">
                  {productForm.specifications.map((spec, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
                      <div className="flex-1">
                        <p className="font-medium">{spec.title}</p>
                        <p className="text-sm text-gray-500">{spec.value}</p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSpecification(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Formulario para agregar nueva especificación */}
              <div className="grid grid-cols-[1fr_1fr_auto] gap-2 items-end">
                <div>
                  <Label htmlFor="specTitle">Título</Label>
                  <Input
                    id="specTitle"
                    name="title"
                    value={newSpecification.title}
                    onChange={handleNewSpecificationChange}
                    placeholder="Ej: Material"
                  />
                </div>
                <div>
                  <Label htmlFor="specValue">Valor</Label>
                  <Input
                    id="specValue"
                    name="value"
                    value={newSpecification.value}
                    onChange={handleNewSpecificationChange}
                    placeholder="Ej: Acero inoxidable"
                  />
                </div>
                <Button type="button" onClick={addSpecification}>
                  Agregar
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Imágenes del producto</Label>
              <ImageUpload onUpload={handleImagesUpload} maxFiles={5} />

              {productForm.images.length > 0 && (
                <div className="grid grid-cols-5 gap-2 mt-2">
                  {productForm.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Producto ${index + 1}`}
                        className="h-20 w-20 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProductDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveProduct}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para agregar/editar promoción */}
      <Dialog open={isPromotionDialogOpen} onOpenChange={setIsPromotionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedPromotion ? "Editar Promoción" : "Agregar Promoción"}</DialogTitle>
            <DialogDescription>Completa los detalles de la promoción</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="promotionCode">Código de la promoción</Label>
              <Input
                id="promotionCode"
                name="code"
                value={promotionForm.code}
                onChange={handlePromotionFormChange}
                placeholder="Código de la promoción"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discountValue">Valor del descuento</Label>
                <Input
                  id="discountValue"
                  name="discountValue"
                  type="number"
                  value={promotionForm.discountValue}
                  onChange={handlePromotionFormChange}
                  placeholder="Valor del descuento"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountType">Tipo de descuento</Label>
                <Select
                  value={promotionForm.discountType}
                  onValueChange={(value) => setPromotionForm({ ...promotionForm, discountType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de descuento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Porcentaje</SelectItem>
                    <SelectItem value="fixed">Valor fijo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="durationType">Tipo de duración</Label>
                <Select
                  value={promotionForm.durationType}
                  onValueChange={(value) => setPromotionForm({ ...promotionForm, durationType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de duración" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Fecha</SelectItem>
                    <SelectItem value="usage">Usos</SelectItem>
                    <SelectItem value="both">Ambos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {promotionForm.durationType === "date" || promotionForm.durationType === "both" ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Fecha de inicio</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={promotionForm.startDate}
                    onChange={handlePromotionFormChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Fecha de fin</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={promotionForm.endDate}
                    onChange={handlePromotionFormChange}
                  />
                </div>
              </div>
            ) : null}

            {promotionForm.durationType === "usage" || promotionForm.durationType === "both" ? (
              <div className="space-y-2">
                <Label htmlFor="maxUsage">Máximo de usos</Label>
                <Input
                  id="maxUsage"
                  name="maxUsage"
                  type="number"
                  value={promotionForm.maxUsage}
                  onChange={handlePromotionFormChange}
                  placeholder="Máximo de usos"
                />
              </div>
            ) : null}

            <div className="flex items-center space-x-2">
              <Checkbox id="isActive" checked={promotionForm.isActive} onCheckedChange={handlePromotionActiveChange} />
              <Label htmlFor="isActive">Promoción activa</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPromotionDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={savePromotion}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para aplicar descuento */}
      <Dialog open={isDiscountDialogOpen} onOpenChange={setIsDiscountDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aplicar Descuento</DialogTitle>
            <DialogDescription>Configura el descuento para {selectedProduct?.name}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="discountPercentage">Porcentaje de descuento</Label>
              <Input
                id="discountPercentage"
                name="discountPercentage"
                type="number"
                min="0"
                max="100"
                value={discountForm.discountPercentage}
                onChange={handleDiscountFormChange}
                placeholder="0"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discountStartDate">Fecha de inicio</Label>
                <Input
                  id="discountStartDate"
                  name="startDate"
                  type="date"
                  value={discountForm.startDate}
                  onChange={handleDiscountFormChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discountEndDate">Fecha de fin</Label>
                <Input
                  id="discountEndDate"
                  name="endDate"
                  type="date"
                  value={discountForm.endDate}
                  onChange={handleDiscountFormChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="discountDescription">Descripción del descuento</Label>
              <Textarea
                id="discountDescription"
                name="description"
                value={discountForm.description}
                onChange={handleDiscountFormChange}
                placeholder="Descripción del descuento"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDiscountDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={applyDiscount}>Aplicar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para confirmar eliminación de producto */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar el producto "{selectedProduct?.name}"? Esta acción no se puede
              deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={deleteProduct}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para confirmar eliminación de promoción */}
      <Dialog open={isDeletePromotionDialogOpen} onOpenChange={setIsDeletePromotionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar la promoción "{selectedPromotion?.name}"? Esta acción no se puede
              deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeletePromotionDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={deletePromotion}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
