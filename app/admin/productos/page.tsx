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
import { Plus, Search, MoreVertical, Edit, Trash, Tag, ArrowUpDown, ChevronUp, ChevronDown, Bot, Loader } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { fetchGeminiCompletion } from "@/lib/gemini";
import {
  PROMPT_SHORT_DESCRIPTION,
  PROMPT_DESCRIPTION,
  PROMPT_SPECIFICATIONS,
  PROMPT_PRICE,
} from "@/lib/gemini-prompts"

// Lista predefinida de categorías
const CATEGORIES = [
  'Herramientas',
  'Materiales',
  'Electricidad',
  'Plomeria',
  'Jardineria',
  'Pinturas',
  'Otros',
]

export default function ProductsPage() {
  // Estados para manejar los productos, categorías y promociones
  const [products, setProducts] = useState<any[]>([])
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [promotions, setPromotions] = useState<any[]>([])
  const [filteredPromotions, setFilteredPromotions] = useState<any[]>([])

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
    description: "",
    discountValue: "",
    discountType: "PORCENTAJE", // Valores válidos: PORCENTAJE, FIJO, ENVIO_GRATIS
    durationType: "date",
    startDate: "",
    endDate: "",
    maxUsage: "",
    currentUsage: 0,
    isActive: false,
    applicableCategories: [],
    applicableProducts: [],
    minimumPurchase: "",
  })

  // Estado para el formulario de descuento
  const [discountForm, setDiscountForm] = useState({
    discountPercentage: "",
  })

  // Estado para nueva especificación
  const [newSpecification, setNewSpecification] = useState({
    title: "",
    value: "",
  })

  // Estado para deshabilitar el botón Guardar mientras se guarda
  const [isSavingPromotion, setIsSavingPromotion] = useState(false)

  const [isFreeShippingEnabled, setIsFreeShippingEnabled] = useState(false)
  const [isConfirmFreeShippingOpen, setIsConfirmFreeShippingOpen] = useState(false)

  const [isShippingConfigOpen, setIsShippingConfigOpen] = useState(false)
  const [shippingConfig, setShippingConfig] = useState({
    amount: "0",
    isActive: false
  })

  // Estado de loading para los botones AI
  const [aiLoading, setAiLoading] = useState({
    shortDescription: false,
    description: false,
    specifications: false,
    price: false,
  });

  useEffect(() => {
    // Cargar productos y promociones desde la base de datos
    const fetchData = async () => {
      try {
        // Cargar productos
        const resProducts = await fetch('/api/products')
        let dbProducts = await resProducts.json()
        if (!Array.isArray(dbProducts)) dbProducts = []
        setProducts(dbProducts)
        setFilteredProducts(dbProducts)

        // Cargar promociones
        const resPromotions = await fetch('/api/promotions')
        let dbPromotions = await resPromotions.json()
        if (!Array.isArray(dbPromotions)) dbPromotions = []
        setPromotions(dbPromotions)
        setFilteredPromotions(dbPromotions)
      } catch (error) {
        console.error('Error al cargar datos:', error)
        toast({
          title: "Error",
          description: "Hubo un error al cargar los datos",
          variant: "destructive",
        })
      }
    }
    fetchData()
  }, [])

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
          promotion.couponCode?.toLowerCase().includes(promotionSearchTerm.toLowerCase()) ||
          promotion.description?.toLowerCase().includes(promotionSearchTerm.toLowerCase())
      )
    }

    // Ordenar
    if (promotionSortField) {
      result = [...result].sort((a, b) => {
        let valueA = a[promotionSortField] || ""
        let valueB = b[promotionSortField] || ""

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

  // Efecto para cargar el estado inicial del envío gratis
  useEffect(() => {
    const checkShippingConfig = async () => {
      try {
        const response = await fetch('/api/promotions')
        const promotions = await response.json()
        const shippingPromo = promotions.find(
          (p: any) => p.couponCode === 'ENVIO_GRATIS_GLOBAL' && p.discountType === 'ENVIO_GRATIS'
        )
        if (shippingPromo) {
          setShippingConfig({
            amount: shippingPromo.discountValue.toString(),
            isActive: shippingPromo.active
          })
        }
      } catch (error) {
        console.error('Error al verificar configuración de envío:', error)
      }
    }
    checkShippingConfig()
  }, [])

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
          ? product.specifications.map((spec: any) => {
            if (typeof spec === "string") {
              const [title, value] = spec.split(": ")
              return { title: title || spec, value: value || "" }
            }
            // Si ya es objeto, lo devolvemos tal cual
            return spec
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
      // Función auxiliar para formatear la fecha a YYYY-MM-DD para el input
      const formatDateForInput = (date: string | null) => {
        if (!date) return "";
        return new Date(date).toISOString().split('T')[0];
      };

      // Función auxiliar para mostrar la fecha en formato venezolano
      const formatDateForDisplay = (date: string | null) => {
        if (!date) return "";
        return new Date(date).toLocaleDateString('es-VE', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      };

      setPromotionForm({
        id: promotion.id,
        code: promotion.couponCode || "",
        description: promotion.description || "",
        discountValue: promotion.discountValue?.toString() || "",
        discountType: promotion.discountType || "PORCENTAJE",
        durationType: promotion.durationType || "date",
        startDate: formatDateForInput(promotion.startDate),
        endDate: formatDateForInput(promotion.endDate),
        maxUsage: promotion.maxUsage?.toString() || "",
        currentUsage: promotion.currentUsage || 0,
        isActive: promotion.active || false,
        applicableCategories: promotion.applicableCategories || [],
        applicableProducts: promotion.applicableProducts || [],
        minimumPurchase: promotion.minimumPurchase?.toString() || "",
      })
      setSelectedPromotion(promotion)
    } else {
      setPromotionForm({
        id: "",
        code: "",
        description: "",
        discountValue: "",
        discountType: "PORCENTAJE",
        durationType: "date",
        startDate: "",
        endDate: "",
        maxUsage: "",
        currentUsage: 0,
        isActive: false,
        applicableCategories: [],
        applicableProducts: [],
        minimumPurchase: "",
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
  const saveProduct = async () => {
    const method = selectedProduct ? 'PUT' : 'POST';
    const url = selectedProduct ? `/api/products?id=${productForm.id}` : '/api/products';
    const body = {
      name: productForm.name,
      sku: productForm.sku,
      category: productForm.category,
      price: parseFloat(productForm.price),
      stock: parseInt(productForm.stock),
      shortDescription: productForm.shortDescription,
      description: productForm.description,
      specifications: productForm.specifications,
      images: productForm.images,
    };
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error('Error al guardar el producto');
      toast({
        title: selectedProduct ? 'Producto actualizado' : 'Producto agregado',
        description: selectedProduct ? 'El producto ha sido actualizado correctamente' : 'El producto ha sido agregado correctamente',
      });
      // Refrescar productos desde la base de datos
      const productosRes = await fetch('/api/products');
      setProducts(await productosRes.json());
      setIsProductDialogOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Hubo un error al guardar el producto',
        variant: 'destructive',
      });
    }
  };

  // Función para guardar una promoción (nueva o editada)
  const savePromotion = async () => {
    // Validación de campos obligatorios
    console.log('Tipo de descuento:', promotionForm.discountType) // Debug log

    if (!promotionForm.code || promotionForm.code.trim().length < 3) {
      toast({ title: 'Error', description: 'El código de la promoción es obligatorio y debe tener al menos 3 caracteres.', variant: 'destructive' });
      return;
    }
    if (!promotionForm.discountValue || isNaN(Number(promotionForm.discountValue)) || Number(promotionForm.discountValue) <= 0) {
      toast({ title: 'Error', description: 'El valor del descuento debe ser un número mayor a 0.', variant: 'destructive' });
      return;
    }
    if (!promotionForm.discountType || !['PORCENTAJE', 'FIJO', 'ENVIO_GRATIS'].includes(promotionForm.discountType)) {
      toast({ title: 'Error', description: 'Selecciona un tipo de descuento válido.', variant: 'destructive' });
      return;
    }

    // Validar que al menos se haya especificado una fecha o un máximo de usos
    const hasDates = promotionForm.startDate && promotionForm.endDate;
    const hasUsage = promotionForm.maxUsage && parseInt(promotionForm.maxUsage) > 0;

    if (!hasDates && !hasUsage) {
      toast({
        title: 'Error',
        description: 'Debes especificar al menos un período de validez (fechas) o un límite de usos.',
        variant: 'destructive'
      });
      return;
    }

    // Si se especificaron fechas, validar que sean coherentes
    if (promotionForm.startDate && promotionForm.endDate) {
      const start = new Date(promotionForm.startDate);
      const end = new Date(promotionForm.endDate);
      if (end < start) {
        toast({
          title: 'Error',
          description: 'La fecha de fin debe ser posterior a la fecha de inicio.',
          variant: 'destructive'
        });
        return;
      }
    }

    const method = selectedPromotion ? 'PUT' : 'POST';
    const url = selectedPromotion ? `/api/promotions?id=${promotionForm.id}` : '/api/promotions';

    const body = {
      discountType: promotionForm.discountType,
      discountValue: parseFloat(promotionForm.discountValue),
      couponCode: promotionForm.code,
      maxUsage: promotionForm.maxUsage ? parseInt(promotionForm.maxUsage) : null,
      active: promotionForm.isActive,
      startDate: promotionForm.startDate ? new Date(promotionForm.startDate).toISOString() : null,
      endDate: promotionForm.endDate ? new Date(promotionForm.endDate).toISOString() : null,
    };

    console.log('Body a enviar:', body); // Debug log

    try {
      setIsSavingPromotion(true);
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData); // Debug log
        throw new Error(errorData.message || 'Error al guardar la promoción');
      }

      const data = await response.json();
      console.log('Response data:', data); // Debug log

      toast({
        title: selectedPromotion ? 'Promoción actualizada' : 'Promoción agregada',
        description: selectedPromotion ? 'La promoción ha sido actualizada correctamente' : 'La promoción ha sido agregada correctamente',
      });

      // Refrescar promociones desde la base de datos
      const promosRes = await fetch('/api/promotions');
      setPromotions(await promosRes.json());
      setIsPromotionDialogOpen(false);
    } catch (error) {
      console.error('Error completo:', error); // Debug log
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Hubo un error al guardar la promoción',
        variant: 'destructive',
      });
    } finally {
      setIsSavingPromotion(false);
    }
  };

  // Función para aplicar descuento a un producto
  const applyDiscount = async () => {
    if (!selectedProduct) return;

    const discountValue = Number.parseFloat(discountForm.discountPercentage);
    if (isNaN(discountValue) || discountValue < 0 || discountValue > 100) {
      toast({
        title: "Error",
        description: "El descuento debe ser un número entre 0 y 100",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/products?id=${selectedProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...selectedProduct,
          discount: discountValue,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al aplicar el descuento');
      }

      // Refrescar productos desde la base de datos
      const productsRes = await fetch('/api/products');
      const updatedProducts = await productsRes.json();
      setProducts(updatedProducts);

      toast({
        title: "Descuento aplicado",
        description: `Se ha aplicado un descuento del ${discountValue}% al producto "${selectedProduct.name}"`,
      });

      setIsDiscountDialogOpen(false);
    } catch (error) {
      console.error('Error al aplicar descuento:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Hubo un error al aplicar el descuento',
        variant: 'destructive',
      });
    }
  }

  // Función para eliminar un producto
  const deleteProduct = async () => {
    try {
      const response = await fetch(`/api/products?id=${selectedProduct.id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Error al eliminar el producto');
      toast({
        title: 'Producto eliminado',
        description: 'El producto ha sido eliminado correctamente',
        variant: 'destructive',
      });
      // Refrescar productos desde la base de datos
      const productosRes = await fetch('/api/products');
      setProducts(await productosRes.json());
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Hubo un error al eliminar el producto',
        variant: 'destructive',
      });
    }
  };

  // Función para eliminar una promoción
  const deletePromotion = async () => {
    try {
      const response = await fetch(`/api/promotions?id=${selectedPromotion.id}`, { method: 'DELETE' });
      if (!response.ok) {
        const errorData = await response.json();
        toast({
          title: 'Error',
          description: errorData?.message || 'Hubo un error al eliminar la promoción',
          variant: 'destructive',
        });
        return;
      }
      toast({
        title: 'Promoción eliminada',
        description: 'La promoción ha sido eliminada correctamente',
        variant: 'destructive',
      });
      // Refrescar promociones desde la base de datos
      const promosRes = await fetch('/api/promotions');
      setPromotions(await promosRes.json());
      setIsDeletePromotionDialogOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Hubo un error al eliminar la promoción',
        variant: 'destructive',
      });
    }
  };

  // Función para cambiar el estado de una promoción
  const togglePromotionStatus = async (promotion: any) => {
    try {
      const response = await fetch(`/api/promotions?id=${promotion.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...promotion,
          active: !promotion.active,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar el estado de la promoción');
      }

      // Refrescar promociones desde la base de datos
      const promosRes = await fetch('/api/promotions');
      const updatedPromotions = await promosRes.json();
      setPromotions(updatedPromotions);

      toast({
        title: !promotion.active ? "Promoción activada" : "Promoción desactivada",
        description: `La promoción "${promotion.couponCode}" ha sido ${!promotion.active ? "activada" : "desactivada"}`,
      });
    } catch (error) {
      console.error('Error al cambiar estado de promoción:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Hubo un error al actualizar el estado de la promoción',
        variant: 'destructive',
      });
    }
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

  // Función para quitar el descuento de un producto
  const removeDiscount = async (product: any) => {
    try {
      const response = await fetch(`/api/products?id=${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...product,
          discount: 0,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al quitar el descuento');
      }

      // Refrescar productos desde la base de datos
      const productsRes = await fetch('/api/products');
      const updatedProducts = await productsRes.json();
      setProducts(updatedProducts);

      toast({
        title: "Descuento eliminado",
        description: `Se ha quitado el descuento del producto "${product.name}"`,
      });
    } catch (error) {
      console.error('Error al quitar descuento:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Hubo un error al quitar el descuento',
        variant: 'destructive',
      });
    }
  }

  // Función para manejar el toggle de envío gratis
  const handleFreeShippingToggle = async () => {
    try {
      // Si está activado, lo desactivamos directamente
      if (isFreeShippingEnabled) {
        await fetch('/api/promotions?type=free_shipping', { method: 'DELETE' })
        setIsFreeShippingEnabled(false)
        toast({
          title: "Envío gratis desactivado",
          description: "Se ha desactivado el envío gratis para todos los productos",
        })
        return
      }

      // Si está desactivado, mostramos el diálogo de confirmación
      setIsShippingConfigOpen(true)
    } catch (error) {
      console.error('Error al cambiar estado de envío gratis:', error)
      toast({
        title: 'Error',
        description: 'Hubo un error al actualizar el estado del envío gratis',
        variant: 'destructive',
      })
    }
  }

  // Función para guardar la configuración de envío
  const handleSaveShippingConfig = async () => {
    try {
      // Primero eliminamos cualquier configuración existente
      await fetch('/api/promotions?type=free_shipping', { method: 'DELETE' })

      // Luego creamos la nueva configuración
      const response = await fetch('/api/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          discountType: 'ENVIO_GRATIS',
          discountValue: parseFloat(shippingConfig.amount),
          couponCode: 'ENVIO_GRATIS_GLOBAL',
          active: shippingConfig.isActive
        }),
      })

      if (!response.ok) {
        throw new Error('Error al guardar configuración de envío')
      }

      setIsShippingConfigOpen(false)
      toast({
        title: "Configuración guardada",
        description: "La configuración de envío ha sido actualizada",
      })

      // Actualizar la lista de promociones
      const promosRes = await fetch('/api/promotions')
      const updatedPromotions = await promosRes.json()
      setPromotions(updatedPromotions)
    } catch (error) {
      console.error('Error al guardar configuración de envío:', error)
      toast({
        title: 'Error',
        description: 'Hubo un error al guardar la configuración de envío',
        variant: 'destructive',
      })
    }
  }

  // Funciones para los botones AI
  const handleAIGenerateShortDescription = async () => {
    if (!productForm.name) return;
    setAiLoading((prev) => ({ ...prev, shortDescription: true }));
    try {
      const prompt = PROMPT_SHORT_DESCRIPTION(productForm.name);
      const result = await fetchGeminiCompletion(prompt);
      setProductForm((prev) => ({ ...prev, shortDescription: result.trim() }));
    } catch (e) {
      toast({ title: "Error AI", description: "No se pudo generar la descripción corta", variant: "destructive" });
    } finally {
      setAiLoading((prev) => ({ ...prev, shortDescription: false }));
    }
  };

  const handleAIGenerateDescription = async () => {
    if (!productForm.name) return;
    setAiLoading((prev) => ({ ...prev, description: true }));
    try {
      const prompt = PROMPT_DESCRIPTION(productForm.name);
      const result = await fetchGeminiCompletion(prompt);
      setProductForm((prev) => ({ ...prev, description: result.trim() }));
    } catch (e) {
      toast({ title: "Error AI", description: "No se pudo generar la descripción completa", variant: "destructive" });
    } finally {
      setAiLoading((prev) => ({ ...prev, description: false }));
    }
  };

  const handleAIGenerateSpecifications = async () => {
    if (!productForm.name) return;
    setAiLoading((prev) => ({ ...prev, specifications: true }));
    try {
      const prompt = PROMPT_SPECIFICATIONS(productForm.name);
      const result = await fetchGeminiCompletion(prompt);
      // Limpiar y parsear el JSON de la AI
      let specs = [];
      let jsonText = result.trim();
      // Buscar el primer y último corchete para aislar el array
      const firstBracket = jsonText.indexOf("[");
      const lastBracket = jsonText.lastIndexOf("]");
      if (firstBracket !== -1 && lastBracket !== -1) {
        jsonText = jsonText.substring(firstBracket, lastBracket + 1);
      }
      // Intentar parsear normalmente
      try {
        specs = JSON.parse(jsonText);
      } catch {
        // Si falla, intentar reemplazar comillas simples por dobles
        try {
          specs = JSON.parse(jsonText.replace(/'/g, '"'));
        } catch {
          toast({ title: "Error AI", description: "La AI no devolvió especificaciones válidas", variant: "destructive" });
          return;
        }
      }
      // Validar que sea un array de objetos con title y value
      if (!Array.isArray(specs) || !specs.every(s => s.title && s.value)) {
        toast({ title: "Error AI", description: "La AI no devolvió especificaciones válidas", variant: "destructive" });
        return;
      }
      setProductForm((prev) => ({ ...prev, specifications: specs }));
    } catch (e) {
      toast({ title: "Error AI", description: "No se pudo generar especificaciones", variant: "destructive" });
    } finally {
      setAiLoading((prev) => ({ ...prev, specifications: false }));
    }
  };

  const handleAIGeneratePrice = async () => {
    if (!productForm.name) return;
    setAiLoading((prev) => ({ ...prev, price: true }));
    try {
      const prompt = PROMPT_PRICE(productForm.name);
      const result = await fetchGeminiCompletion(prompt);
      // Solo el número, sin símbolos
      const price = result.replace(/[^\d.,]/g, "").replace(",", ".");
      setProductForm((prev) => ({ ...prev, price }));
    } catch (e) {
      toast({ title: "Error AI", description: "No se pudo sugerir el precio", variant: "destructive" });
    } finally {
      setAiLoading((prev) => ({ ...prev, price: false }));
    }
  };

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
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
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
                              {product.discount > 0 && (
                                <DropdownMenuItem onClick={() => removeDiscount(product)} className="text-orange-600">
                                  <Tag className="mr-2 h-4 w-4" />
                                  Quitar descuento
                                </DropdownMenuItem>
                              )}
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
              <div className="flex gap-2">
                <Button onClick={() => openPromotionForm()} className="bg-orange-500 hover:bg-orange-600">
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Promoción
                </Button>
                <Button
                  onClick={() => setIsShippingConfigOpen(true)}
                  variant="default"
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Tag className="mr-2 h-4 w-4" />
                  Configurar Envío
                </Button>
              </div>
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
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer">
                      <div className="flex items-center"> Usos restantes / Fecha final</div>
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
                    filteredPromotions
                      .filter(promotion => promotion.couponCode !== 'ENVIO_GRATIS_GLOBAL')
                      .map((promotion) => (
                        <tr key={promotion.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 text-sm font-medium text-gray-900">{promotion.couponCode}</td>
                          <td className="px-4 py-4 text-sm text-gray-500">
                            {promotion.discountValue}
                            {promotion.discountType === "PORCENTAJE" ? "%" : "$"}
                          </td>

                          <td className="px-4 py-4 text-sm text-gray-500">
                            {promotion.maxUsage ? (
                              `${promotion.maxUsage}`
                            ) : promotion.startDate && promotion.endDate ? (
                              new Date(promotion.startDate).toLocaleDateString('es-VE', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                              })
                            ) : (
                              "-"
                            )}
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
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Precio en $</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    value={productForm.price}
                    onChange={handleProductFormChange}
                    placeholder="0.00"
                  />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          disabled={!productForm.name}
                          onClick={handleAIGeneratePrice}
                          className="h-8 w-8"
                        >
                          {aiLoading.price ? <Loader className="animate-spin h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {productForm.name ? "Sugerir precio" : "Ingresa el nombre del producto"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
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
              <div className="flex items-center gap-2">
                <Textarea
                  id="shortDescription"
                  name="shortDescription"
                  value={productForm.shortDescription}
                  onChange={handleProductFormChange}
                  placeholder="Breve descripción del producto"
                  rows={2}
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        disabled={!productForm.name}
                        onClick={handleAIGenerateShortDescription}
                        className="h-8 w-8"
                      >
                        {aiLoading.shortDescription ? <Loader className="animate-spin h-4 w-4" /> : <Bot className="h-4 w-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {productForm.name ? "Generar descripción corta" : "Ingresa el nombre del producto"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción completa</Label>
              <div className="flex items-center gap-2">
                <Textarea
                  id="description"
                  name="description"
                  value={productForm.description}
                  onChange={handleProductFormChange}
                  placeholder="Descripción detallada del producto"
                  rows={4}
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        disabled={!productForm.name}
                        onClick={handleAIGenerateDescription}
                        className="h-8 w-8"
                      >
                        {aiLoading.description ? <Loader className="animate-spin h-4 w-4" /> : <Bot className="h-4 w-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {productForm.name ? "Generar descripción completa" : "Ingresa el nombre del producto"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
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
              <div className="grid grid-cols-[1fr_1fr_auto_auto] gap-2 items-end">
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
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        disabled={!productForm.name}
                        onClick={handleAIGenerateSpecifications}
                        className="h-8 w-8"
                      >
                        {aiLoading.specifications ? <Loader className="animate-spin h-4 w-4" /> : <Bot className="h-4 w-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {productForm.name ? "Generar especificaciones" : "Ingresa el nombre del producto"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
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
                    <SelectItem value="PORCENTAJE">Porcentaje</SelectItem>
                    <SelectItem value="FIJO">Valor fijo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

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

      {/* Diálogo para configurar envío gratis */}
      <Dialog open={isShippingConfigOpen} onOpenChange={setIsShippingConfigOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configuración de Envío</DialogTitle>
            <DialogDescription>
              Configura el monto de envío y su estado
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="shippingAmount">Monto del envío ($)</Label>
              <Input
                id="shippingAmount"
                type="number"
                step="0.01"
                value={shippingConfig.amount}
                onChange={(e) => setShippingConfig(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="0.00"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="shippingActive"
                checked={shippingConfig.isActive}
                onCheckedChange={(checked) =>
                  setShippingConfig(prev => ({ ...prev, isActive: checked as boolean }))
                }
              />
              <Label htmlFor="shippingActive">Envío gratis activo</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsShippingConfigOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveShippingConfig} className="bg-orange-500 hover:bg-orange-600">
              Guardar configuración
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
