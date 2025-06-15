import type {
  Product,
  Category,
  Testimonial,
  SalesData,
  Order,
  User,
  Admin,
  Address,
  OrderComplete,
  Brand,
  Supplier,
  Promotion,
  PaymentMethod,
  ShippingMethod,
  Review,
  Coupon,
  Notification,
  ProductTag,
  ProductAttribute,
  ProductVariant,
  Inventory,
  PriceHistory,
  OrderStatus,
  PaymentStatus,
  ShippingStatus,
  StatsData,
} from "./types"

// Categorías
export const categories: Category[] = [
  {
    id: "herramientas",
    name: "Herramientas",
    slug: "herramientas",
    image: "/placeholder.svg?height=64&width=64&text=🔨",
  },
  {
    id: "materiales",
    name: "Materiales",
    slug: "materiales",
    image: "/placeholder.svg?height=64&width=64&text=🧱",
  },
  {
    id: "electricidad",
    name: "Electricidad",
    slug: "electricidad",
    image: "/placeholder.svg?height=64&width=64&text=⚡",
  },
  {
    id: "plomeria",
    name: "Plomería",
    slug: "plomeria",
    image: "/placeholder.svg?height=64&width=64&text=🚿",
  },
  {
    id: "jardineria",
    name: "Jardinería",
    slug: "jardineria",
    image: "/placeholder.svg?height=64&width=64&text=🌱",
  },
  {
    id: "pinturas",
    name: "Pinturas",
    slug: "pinturas",
    image: "/placeholder.svg?height=64&width=64&text=🎨",
  },
]

// Marcas
export const brands: Brand[] = [
  {
    id: "stanley",
    name: "Stanley",
    logo: "/placeholder.svg?height=64&width=64&text=Stanley",
    description: "Herramientas profesionales de alta calidad",
    website: "https://www.stanleytools.com/",
  },
  {
    id: "bosch",
    name: "Bosch",
    logo: "/placeholder.svg?height=64&width=64&text=Bosch",
    description: "Tecnología para la vida",
    website: "https://www.bosch.com/",
  },
  {
    id: "dewalt",
    name: "DeWalt",
    logo: "/placeholder.svg?height=64&width=64&text=DeWalt",
    description: "Herramientas para profesionales",
    website: "https://www.dewalt.com/",
  },
  {
    id: "3m",
    name: "3M",
    logo: "/placeholder.svg?height=64&width=64&text=3M",
    description: "Innovación en productos para el hogar y la industria",
    website: "https://www.3m.com/",
  },
  {
    id: "truper",
    name: "Truper",
    logo: "/placeholder.svg?height=64&width=64&text=Truper",
    description: "Herramientas y productos para el hogar",
    website: "https://www.truper.com/",
  },
  {
    id: "sherwin-williams",
    name: "Sherwin-Williams",
    logo: "/placeholder.svg?height=64&width=64&text=SW",
    description: "Pinturas y recubrimientos de calidad",
    website: "https://www.sherwin-williams.com/",
  },
]

// Proveedores
export const suppliers: Supplier[] = [
  {
    id: "sup-001",
    name: "Distribuidora Nacional",
    contactName: "Carlos Méndez",
    email: "contacto@distribuidoranacional.com",
    phone: "+584141234567",
    address: "Zona Industrial, Galpón 15",
    city: "Caracas",
    state: "Distrito Capital",
    country: "Venezuela",
    categories: ["herramientas", "materiales"],
    rating: 4.8,
  },
  {
    id: "sup-002",
    name: "Importadora del Este",
    contactName: "María Rodríguez",
    email: "ventas@importadoradeleste.com",
    phone: "+584249876543",
    address: "Av. Principal, Centro Comercial Este, Local 5",
    city: "Barcelona",
    state: "Anzoátegui",
    country: "Venezuela",
    categories: ["electricidad", "plomeria"],
    rating: 4.5,
  },
  {
    id: "sup-003",
    name: "Ferretería Mayorista",
    contactName: "José Pérez",
    email: "info@ferreteriamayorista.com",
    phone: "+584168765432",
    address: "Calle Comercio, Edificio Central, Piso 2",
    city: "Valencia",
    state: "Carabobo",
    country: "Venezuela",
    categories: ["jardineria", "pinturas"],
    rating: 4.2,
  },
]

// Productos
export const products: Product[] = [
  {
    id: "taladro-percutor-750w",
    name: "Taladro Percutor Profesional 750W",
    category: "Herramientas",
    price: 89.99,
    discount: 10,
    rating: 4.5,
    reviews: 128,
    inStock: true,
    images: [
      "/placeholder.svg?height=400&width=400&text=Taladro",
      "/placeholder.svg?height=400&width=400&text=Taladro+2",
      "/placeholder.svg?height=400&width=400&text=Taladro+3",
    ],
    shortDescription: "Taladro percutor profesional de 750W con 2 velocidades y maletín incluido.",
    description:
      "Este taladro percutor profesional de 750W es perfecto para trabajos de bricolaje y construcción. Cuenta con 2 velocidades, función de percusión y un diseño ergonómico para mayor comodidad durante el uso prolongado. Incluye maletín de transporte y set de brocas básicas.",
    specifications: [
      "Potencia: 750W",
      "Velocidad en vacío: 0-1100 / 0-2800 rpm",
      "Capacidad de perforación en hormigón: 16mm",
      "Capacidad de perforación en madera: 30mm",
      "Capacidad de perforación en metal: 13mm",
      "Peso: 2.5kg",
    ],
    questions: [
      {
        question: "¿Viene con brocas incluidas?",
        answer: "Sí, incluye un set básico de 5 brocas para diferentes materiales.",
      },
      {
        question: "¿Tiene función de martillo?",
        answer: "Sí, cuenta con función de percusión para taladrar en hormigón y mampostería.",
      },
    ],
    featured: true,
    brandId: "bosch",
    supplierId: "sup-001",
    tags: ["herramientas eléctricas", "taladros", "bricolaje"],
    sku: "TAL-750W-001",
    barcode: "8412345678901",
  },
  {
    id: "set-destornilladores-precision",
    name: "Set de Destornilladores de Precisión 45 piezas",
    category: "Herramientas",
    price: 24.99,
    discount: 0,
    rating: 4.8,
    reviews: 95,
    inStock: true,
    images: [
      "/placeholder.svg?height=400&width=400&text=Destornilladores",
      "/placeholder.svg?height=400&width=400&text=Destornilladores+2",
    ],
    shortDescription: "Set completo de 45 destornilladores de precisión para electrónica y pequeñas reparaciones.",
    description:
      "Este set de 45 destornilladores de precisión es ideal para trabajos de electrónica, reparación de relojes, gafas, smartphones y otros dispositivos pequeños. Incluye puntas de diferentes tipos y tamaños, fabricadas en acero de alta calidad con mangos ergonómicos para un agarre cómodo y seguro.",
    specifications: [
      "45 piezas en total",
      "Incluye puntas Phillips, planas, Torx, hexagonales y más",
      "Mango ergonómico con giro libre para trabajos de precisión",
      "Estuche organizador incluido",
      "Material: Acero cromo-vanadio",
    ],
    questions: [
      {
        question: "¿Sirve para reparar smartphones?",
        answer: "Sí, incluye las puntas específicas para los tornillos más comunes en smartphones y tablets.",
      },
    ],
    featured: true,
    brandId: "stanley",
    supplierId: "sup-001",
    tags: ["herramientas manuales", "destornilladores", "precisión"],
    sku: "DEST-PREC-045",
    barcode: "8412345678902",
  },
  {
    id: "sierra-circular-1200w",
    name: "Sierra Circular 1200W con Guía Láser",
    category: "Herramientas",
    price: 129.99,
    discount: 15,
    rating: 4.3,
    reviews: 74,
    inStock: false,
    images: [
      "/placeholder.svg?height=400&width=400&text=Sierra",
      "/placeholder.svg?height=400&width=400&text=Sierra+2",
    ],
    shortDescription: "Sierra circular potente de 1200W con guía láser para cortes precisos.",
    description:
      "Sierra circular de 1200W con disco de 185mm para cortes precisos en madera, plástico y aluminio. Cuenta con guía láser para mayor precisión, ajuste de profundidad y ángulo de corte, y sistema de extracción de polvo. Ideal para carpintería y bricolaje avanzado.",
    specifications: [
      "Potencia: 1200W",
      "Diámetro de disco: 185mm",
      "Velocidad en vacío: 5000 rpm",
      "Capacidad de corte a 90°: 65mm",
      "Capacidad de corte a 45°: 43mm",
      "Peso: 4.2kg",
    ],
    questions: [
      {
        question: "¿Incluye disco de corte?",
        answer: "Sí, incluye un disco de 24 dientes para cortes en madera.",
      },
      {
        question: "¿Se puede conectar a una aspiradora?",
        answer: "Sí, tiene un puerto de extracción de polvo compatible con la mayoría de aspiradoras domésticas.",
      },
    ],
    featured: false,
    brandId: "dewalt",
    supplierId: "sup-001",
    tags: ["herramientas eléctricas", "sierras", "carpintería"],
    sku: "SIERRA-1200W-001",
    barcode: "8412345678903",
  },
  {
    id: "martillo-carpintero-fibra",
    name: "Martillo de Carpintero con Mango de Fibra",
    category: "Herramientas",
    price: 19.99,
    discount: 0,
    rating: 4.7,
    reviews: 203,
    inStock: true,
    images: [
      "/placeholder.svg?height=400&width=400&text=Martillo",
      "/placeholder.svg?height=400&width=400&text=Martillo+2",
    ],
    shortDescription: "Martillo de carpintero con cabeza de acero y mango ergonómico de fibra de vidrio.",
    description:
      "Martillo de carpintero profesional con cabeza de acero forjado y mango de fibra de vidrio que absorbe las vibraciones. Diseño ergonómico con empuñadura de goma antideslizante para un agarre seguro. Ideal para trabajos de carpintería, construcción y bricolaje general.",
    specifications: [
      "Peso de la cabeza: 450g",
      "Longitud total: 330mm",
      "Material de la cabeza: Acero forjado",
      "Material del mango: Fibra de vidrio con empuñadura de goma",
      "Uña extractora de clavos",
    ],
    questions: [
      {
        question: "¿Es adecuado para uso profesional diario?",
        answer: "Sí, está diseñado para soportar uso intensivo en entornos profesionales.",
      },
    ],
    featured: false,
    brandId: "stanley",
    supplierId: "sup-001",
    tags: ["herramientas manuales", "martillos", "carpintería"],
    sku: "MART-CARP-001",
    barcode: "8412345678904",
  },
  {
    id: "pintura-interior-blanco-mate",
    name: "Pintura Interior Blanco Mate 15L",
    category: "Pinturas",
    price: 39.99,
    discount: 0,
    rating: 4.6,
    reviews: 158,
    inStock: true,
    images: [
      "/placeholder.svg?height=400&width=400&text=Pintura",
      "/placeholder.svg?height=400&width=400&text=Pintura+2",
    ],
    shortDescription: "Pintura acrílica de alta calidad para interiores, acabado mate, color blanco puro.",
    description:
      "Pintura acrílica al agua de alta calidad para interiores con acabado mate. Excelente cubrición y rendimiento, secado rápido y bajo olor. Ideal para paredes y techos de yeso, cemento, ladrillo o papel pintado. Color blanco puro que aporta luminosidad a cualquier estancia.",
    specifications: [
      "Contenido: 15 litros",
      "Rendimiento: 10-12 m²/litro",
      "Secado al tacto: 1 hora",
      "Repintado: 4-6 horas",
      "Acabado: Mate",
      "Base: Agua",
      "Aplicación: Brocha, rodillo o pistola",
    ],
    questions: [
      {
        question: "¿Se puede aplicar directamente sobre humedad?",
        answer: "No, la superficie debe estar seca y limpia antes de aplicar la pintura.",
      },
      {
        question: "¿Cuántas capas se recomiendan?",
        answer: "Se recomiendan dos capas para una cobertura óptima.",
      },
    ],
    featured: true,
    brandId: "sherwin-williams",
    supplierId: "sup-003",
    tags: ["pinturas", "decoración", "interiores"],
    sku: "PINT-INT-15L-001",
    barcode: "8412345678905",
  },
  {
    id: "cemento-multiusos-25kg",
    name: "Cemento Multiusos 25kg",
    category: "Materiales",
    price: 8.99,
    discount: 0,
    rating: 4.5,
    reviews: 87,
    inStock: true,
    images: [
      "/placeholder.svg?height=400&width=400&text=Cemento",
      "/placeholder.svg?height=400&width=400&text=Cemento+2",
    ],
    shortDescription: "Cemento multiusos de secado rápido para trabajos de albañilería general.",
    description:
      "Cemento multiusos de alta calidad para trabajos de albañilería general como reparaciones, anclajes, nivelaciones y pequeñas construcciones. Secado rápido y alta resistencia. Adecuado tanto para interiores como exteriores.",
    specifications: [
      "Peso: 25kg",
      "Tiempo de fraguado inicial: 45 minutos",
      "Resistencia a compresión: 25 MPa",
      "Rendimiento: 14 litros de mortero por saco",
      "Aplicación: Interior y exterior",
    ],
    questions: [
      {
        question: "¿Es resistente al agua una vez seco?",
        answer: "Sí, una vez fraguado correctamente es resistente al agua y a la intemperie.",
      },
    ],
    featured: false,
    brandId: "3m",
    supplierId: "sup-002",
    tags: ["materiales", "construcción", "albañilería"],
    sku: "CEM-MULT-25KG-001",
    barcode: "8412345678906",
  },
  {
    id: "cable-electrico-3x2-5",
    name: "Cable Eléctrico 3x2.5mm² 25m",
    category: "Electricidad",
    price: 29.99,
    discount: 0,
    rating: 4.8,
    reviews: 42,
    inStock: true,
    images: ["/placeholder.svg?height=400&width=400&text=Cable", "/placeholder.svg?height=400&width=400&text=Cable+2"],
    shortDescription: "Cable eléctrico de 3 hilos de 2.5mm² para instalaciones domésticas.",
    description:
      "Cable eléctrico de 3 hilos (fase, neutro y tierra) de 2.5mm² de sección, ideal para instalaciones eléctricas domésticas. Cumple con todas las normativas de seguridad vigentes. Adecuado para circuitos de enchufes y electrodomésticos de potencia media.",
    specifications: [
      "Longitud: 25 metros",
      "Sección: 3x2.5mm²",
      "Tensión nominal: 750V",
      "Material conductor: Cobre",
      "Material aislante: PVC",
      "Color: Según normativa (azul, marrón, amarillo/verde)",
    ],
    questions: [
      {
        question: "¿Es adecuado para exteriores?",
        answer:
          "No, este cable está diseñado para instalaciones interiores. Para exteriores necesitaría un cable con protección especial.",
      },
    ],
    featured: false,
    brandId: "3m",
    supplierId: "sup-002",
    tags: ["electricidad", "cables", "instalaciones"],
    sku: "CABLE-3X2.5-25M-001",
    barcode: "8412345678907",
  },
  {
    id: "grifo-cocina-monomando",
    name: "Grifo de Cocina Monomando con Ducha Extraíble",
    category: "Plomeria",
    price: 69.99,
    discount: 20,
    rating: 4.7,
    reviews: 113,
    inStock: true,
    images: [
      "/placeholder.svg?height=400&width=400&text=Grifo",
      "/placeholder.svg?height=400&width=400&text=Grifo+2",
      "/placeholder.svg?height=400&width=400&text=Grifo+3",
    ],
    shortDescription: "Grifo monomando para cocina con caño giratorio y ducha extraíble de dos funciones.",
    description:
      "Grifo monomando para cocina con acabado cromado de alta calidad. Dispone de caño giratorio 360° y ducha extraíble con dos funciones (chorro y spray). Fácil instalación y cartucho cerámico de larga duración. Diseño moderno que se adapta a cualquier estilo de cocina.",
    specifications: [
      "Material: Latón cromado",
      "Tipo: Monomando",
      "Altura total: 45cm",
      "Longitud del caño: 22cm",
      "Longitud de la manguera: 150cm",
      'Conexiones estándar de 3/8"',
      "Incluye latiguillos de conexión",
    ],
    questions: [
      {
        question: "¿Es compatible con calentadores de agua?",
        answer: "Sí, es compatible con sistemas de agua a presión, incluyendo calentadores y calderas.",
      },
      {
        question: "¿Qué herramientas necesito para instalarlo?",
        answer:
          "Necesitarás una llave inglesa ajustable y posiblemente una llave de tubo, dependiendo de tu instalación actual.",
      },
    ],
    featured: true,
    brandId: "truper",
    supplierId: "sup-002",
    tags: ["plomería", "grifos", "cocina"],
    sku: "GRIFO-COC-001",
    barcode: "8412345678908",
  },
  {
    id: "tijeras-podar-profesionales",
    name: "Tijeras de Podar Profesionales con Mango Ergonómico",
    category: "Jardineria",
    price: 34.99,
    discount: 0,
    rating: 4.9,
    reviews: 76,
    inStock: false,
    images: [
      "/placeholder.svg?height=400&width=400&text=Tijeras",
      "/placeholder.svg?height=400&width=400&text=Tijeras+2",
    ],
    shortDescription: "Tijeras de podar profesionales con hojas de acero y mango ergonómico antideslizante.",
    description:
      "Tijeras de podar profesionales con hojas de acero al carbono de alta calidad, afiladas con precisión para cortes limpios. Mango ergonómico con revestimiento antideslizante para mayor comodidad y control. Sistema de bloqueo de seguridad y muelle de retorno para facilitar el uso continuado. Ideal para jardinería profesional y aficionados exigentes.",
    specifications: [
      "Longitud total: 21cm",
      "Material de las hojas: Acero al carbono SK5",
      "Material del mango: Aluminio con revestimiento de goma",
      "Capacidad de corte: Ramas de hasta 20mm de diámetro",
      "Peso: 280g",
      "Sistema de bloqueo de seguridad",
    ],
    questions: [
      {
        question: "¿Se pueden afilar las hojas?",
        answer:
          "Sí, las hojas se pueden afilar con una lima o piedra de afilar específica para herramientas de jardín. Recomendamos afilarlas periódicamente para mantener un corte óptimo.",
      },
      {
        question: "¿Son adecuadas para zurdos?",
        answer:
          "Sí, estas tijeras tienen un diseño ambidiestro que permite su uso cómodo tanto para diestros como para zurdos.",
      },
    ],
    featured: false,
    brandId: "truper",
    supplierId: "sup-003",
    tags: ["jardinería", "tijeras", "poda"],
    sku: "TIJ-POD-001",
    barcode: "8412345678909",
  },
  {
    id: "escalera-aluminio-5-peldanos",
    name: "Escalera de Aluminio Plegable 5 Peldaños",
    category: "Herramientas",
    price: 49.99,
    discount: 10,
    rating: 4.6,
    reviews: 92,
    inStock: true,
    images: [
      "/placeholder.svg?height=400&width=400&text=Escalera",
      "/placeholder.svg?height=400&width=400&text=Escalera+2",
    ],
    shortDescription: "Escalera plegable de aluminio con 5 peldaños antideslizantes y sistema de seguridad.",
    description:
      "Escalera plegable de aluminio ligero pero resistente, con 5 peldaños antideslizantes para mayor seguridad. Cuenta con sistema de bloqueo de seguridad, pies antideslizantes y bandeja portaherramientas en la parte superior. Fácil de plegar y almacenar, ideal para trabajos domésticos y bricolaje.",
    specifications: [
      "Material: Aluminio",
      "Número de peldaños: 5",
      "Altura desplegada: 165cm",
      "Altura plegada: 95cm",
      "Capacidad de carga: 150kg",
      "Peso: 5.2kg",
      "Peldaños antideslizantes",
      "Sistema de bloqueo de seguridad",
    ],
    questions: [
      {
        question: "¿Se puede usar en exteriores?",
        answer:
          "Sí, es apta para uso tanto en interiores como en exteriores, aunque se recomienda guardarla en un lugar seco después de usarla en exteriores.",
      },
    ],
    featured: false,
    brandId: "truper",
    supplierId: "sup-001",
    tags: ["herramientas", "escaleras", "bricolaje"],
    sku: "ESC-ALU-5P-001",
    barcode: "8412345678910",
  },
]

// Promociones
export const promotions: Promotion[] = [
  {
    id: "PROMO-001",
    couponCode: "SUMMER2023",
    discountType: "PORCENTAJE",
    discountValue: 20,
    startDate: new Date("2023-06-01"),
    endDate: new Date("2023-08-31"),
    maxUsage: 100,
    active: true,
  },
  {
    id: "PROMO-002",
    couponCode: "WELCOME10",
    discountType: "FIJO",
    discountValue: 10,
    maxUsage: 50,
    active: true,
  },
  {
    id: "PROMO-003",
    couponCode: "FREESHIP",
    discountType: "ENVIO_GRATIS",
    discountValue: 0,
    maxUsage: 200,
    active: true,
  },
]

// Métodos de pago
export const paymentMethods: PaymentMethod[] = [
  {
    id: "pay-001",
    name: "Tarjeta de Crédito/Débito",
    description: "Pago seguro con tarjeta de crédito o débito",
    active: true,
    processingFee: 0,
    icon: "/placeholder.svg?height=32&width=32&text=💳",
  },
  {
    id: "pay-002",
    name: "PayPal",
    description: "Pago rápido y seguro con PayPal",
    active: true,
    processingFee: 0,
    icon: "/placeholder.svg?height=32&width=32&text=PayPal",
  },
  {
    id: "pay-003",
    name: "Transferencia Bancaria",
    description: "Pago mediante transferencia bancaria",
    active: true,
    processingFee: 0,
    icon: "/placeholder.svg?height=32&width=32&text=🏦",
  },
  {
    id: "pay-004",
    name: "Contra Reembolso",
    description: "Pago en efectivo al recibir el pedido",
    active: true,
    processingFee: 2.5,
    icon: "/placeholder.svg?height=32&width=32&text=💵",
  },
]

// Métodos de envío
export const shippingMethods: ShippingMethod[] = [
  {
    id: "ship-001",
    name: "Envío Estándar",
    description: "Entrega en 3-5 días laborables",
    price: 4.99,
    estimatedDeliveryDays: 5,
    active: true,
    icon: "/placeholder.svg?height=32&width=32&text=🚚",
  },
  {
    id: "ship-002",
    name: "Envío Express",
    description: "Entrega en 24-48 horas",
    price: 9.99,
    estimatedDeliveryDays: 2,
    active: true,
    icon: "/placeholder.svg?height=32&width=32&text=⚡",
  },
  {
    id: "ship-003",
    name: "Recogida en Tienda",
    description: "Recoge tu pedido en nuestra tienda",
    price: 0,
    estimatedDeliveryDays: 1,
    active: true,
    icon: "/placeholder.svg?height=32&width=32&text=🏪",
  },
]

// Datos de ventas para el dashboard
export const salesData: SalesData[] = [
  { date: "2023-01-01", amount: 1200 },
  { date: "2023-01-02", amount: 1800 },
  { date: "2023-01-03", amount: 2200 },
  { date: "2023-01-04", amount: 1600 },
  { date: "2023-01-05", amount: 2500 },
  { date: "2023-01-06", amount: 2100 },
  { date: "2023-01-07", amount: 1900 },
  { date: "2023-02-01", amount: 2300 },
  { date: "2023-02-02", amount: 2800 },
  { date: "2023-02-03", amount: 3200 },
  { date: "2023-02-04", amount: 2600 },
  { date: "2023-02-05", amount: 3500 },
  { date: "2023-02-06", amount: 3100 },
  { date: "2023-02-07", amount: 2900 },
  { date: "2023-03-01", amount: 3300 },
  { date: "2023-03-02", amount: 3800 },
  { date: "2023-03-03", amount: 4200 },
  { date: "2023-03-04", amount: 3600 },
  { date: "2023-03-05", amount: 4500 },
  { date: "2023-03-06", amount: 4100 },
  { date: "2023-03-07", amount: 3900 },
  { date: "2023-04-01", amount: 4300 },
  { date: "2023-04-02", amount: 4800 },
  { date: "2023-04-03", amount: 5200 },
  { date: "2023-04-04", amount: 4600 },
  { date: "2023-04-05", amount: 5500 },
  { date: "2023-04-06", amount: 5100 },
  { date: "2023-04-07", amount: 4900 },
  { date: "2023-05-01", amount: 5300 },
  { date: "2023-05-02", amount: 5800 },
  { date: "2023-05-03", amount: 6200 },
  { date: "2023-05-04", amount: 5600 },
  { date: "2023-05-05", amount: 6500 },
  { date: "2023-05-06", amount: 6100 },
  { date: "2023-05-07", amount: 5900 },
]

// Pedidos recientes para el dashboard
export const recentOrders: Order[] = [
  {
    id: "ORD-001",
    customer: "Juan Pérez",
    date: "2023-05-07",
    status: "completed",
    total: 250.99,
    items: 3,
    phone: "+584124111616",
    email: "juan@example.com",
  },
  {
    id: "ORD-002",
    customer: "María López",
    date: "2023-05-06",
    status: "processing",
    total: 120.5,
    items: 2,
    phone: "+584124222727",
    email: "maria@example.com",
  },
  {
    id: "ORD-003",
    customer: "Carlos Rodríguez",
    date: "2023-05-05",
    status: "pending",
    total: 350.75,
    items: 5,
    phone: "+584124333838",
    email: "carlos@example.com",
  },
  {
    id: "ORD-004",
    customer: "Ana Martínez",
    date: "2023-05-04",
    status: "completed",
    total: 180.25,
    items: 1,
    phone: "+584124444949",
    email: "ana@example.com",
  },
  {
    id: "ORD-005",
    customer: "Pedro Sánchez",
    date: "2023-05-03",
    status: "cancelled",
    total: 420.0,
    items: 4,
    phone: "+584124555050",
    email: "pedro@example.com",
  },
]

// Pedidos completos con detalles
export const orders: OrderComplete[] = [
  {
    id: "ORD-001",
    customer: "Juan Pérez",
    date: "2023-05-07",
    status: "completed",
    total: 250.99,
    items: [
      {
        id: "ITEM-001",
        orderId: "ORD-001",
        productId: "taladro-percutor-750w",
        quantity: 1,
        price: 89.99,
        product: products.find((p) => p.id === "taladro-percutor-750w"),
      },
      {
        id: "ITEM-002",
        orderId: "ORD-001",
        productId: "martillo-carpintero-fibra",
        quantity: 2,
        price: 19.99,
        product: products.find((p) => p.id === "martillo-carpintero-fibra"),
      },
    ],
    phone: "+584124111616",
    email: "juan@example.com",
    address: {
      id: "ADDR-001",
      userId: "USR-001",
      name: "Casa",
      address: "Calle Principal 123",
      city: "Madrid",
      zip: "28001",
      isDefault: true,
    },
    paymentMethod: "tarjeta",
    notes: "Entregar en horario de tarde",
    scheduledDate: "2023-05-10",
  },
  {
    id: "ORD-002",
    customer: "María López",
    date: "2023-05-06",
    status: "processing",
    total: 120.5,
    items: [
      {
        id: "ITEM-003",
        orderId: "ORD-002",
        productId: "set-destornilladores-precision",
        quantity: 1,
        price: 24.99,
        product: products.find((p) => p.id === "set-destornilladores-precision"),
      },
      {
        id: "ITEM-004",
        orderId: "ORD-002",
        productId: "cemento-multiusos-25kg",
        quantity: 2,
        price: 8.99,
        product: products.find((p) => p.id === "cemento-multiusos-25kg"),
      },
    ],
    phone: "+584124222727",
    email: "maria@example.com",
    address: {
      id: "ADDR-002",
      userId: "USR-002",
      name: "Oficina",
      address: "Avenida Comercial 456",
      city: "Barcelona",
      zip: "08001",
      isDefault: true,
    },
    paymentMethod: "transferencia",
    notes: "Llamar antes de entregar",
    scheduledDate: "2023-05-12",
  },
  {
    id: "ORD-003",
    customer: "Carlos Rodríguez",
    date: "2023-05-05",
    status: "pending",
    total: 350.75,
    items: [
      {
        id: "ITEM-005",
        orderId: "ORD-003",
        productId: "sierra-circular-1200w",
        quantity: 1,
        price: 129.99,
        product: products.find((p) => p.id === "sierra-circular-1200w"),
      },
      {
        id: "ITEM-006",
        orderId: "ORD-003",
        productId: "escalera-aluminio-5-peldanos",
        quantity: 1,
        price: 49.99,
        product: products.find((p) => p.id === "escalera-aluminio-5-peldanos"),
      },
      {
        id: "ITEM-007",
        orderId: "ORD-003",
        productId: "pintura-interior-blanco-mate",
        quantity: 2,
        price: 39.99,
        product: products.find((p) => p.id === "pintura-interior-blanco-mate"),
      },
    ],
    phone: "+584124333838",
    email: "carlos@example.com",
    address: {
      id: "ADDR-003",
      userId: "USR-003",
      name: "Casa de campo",
      address: "Carretera Rural km 5",
      city: "Valencia",
      zip: "46001",
      isDefault: true,
    },
    paymentMethod: "efectivo",
    notes: "Dejar con el vecino si no estoy",
    scheduledDate: "2023-05-15",
  },
]

// Usuarios
export const users: User[] = [
  {
    id: "USR-001",
    name: "Juan Pérez",
    email: "juan@example.com",
    role: "customer",
    phone: "+584124111616",
    address: "Calle Principal 123",
    city: "Madrid",
    zip: "28001",
  },
  {
    id: "USR-002",
    name: "María López",
    email: "maria@example.com",
    role: "customer",
    phone: "+584124222727",
    address: "Avenida Comercial 456",
    city: "Barcelona",
    zip: "08001",
  },
  {
    id: "USR-003",
    name: "Carlos Rodríguez",
    email: "carlos@example.com",
    role: "customer",
    phone: "+584124333838",
    address: "Carretera Rural km 5",
    city: "Valencia",
    zip: "46001",
  },
  {
    id: "USR-004",
    name: "Admin Principal",
    email: "admin@ferremateriales.com",
    role: "admin",
    phone: "+584129876543",
  },
  {
    id: "USR-005",
    name: "Super Admin",
    email: "superadmin@ferremateriales.com",
    role: "super_admin",
    phone: "+584121234567",
  },
]

// Administradores
export const admins: Admin[] = [
  {
    id: "ADM-001",
    name: "Admin Principal",
    email: "admin@ferremateriales.com",
    role: "admin",
    permissions: ["products", "orders", "users"],
    lastLogin: "2023-05-07T10:30:00",
  },
  {
    id: "ADM-002",
    name: "Super Admin",
    email: "superadmin@ferremateriales.com",
    role: "super_admin",
    permissions: ["products", "orders", "users", "admins", "settings"],
    lastLogin: "2023-05-07T09:15:00",
  },
  {
    id: "ADM-003",
    name: "Gestor de Ventas",
    email: "ventas@ferremateriales.com",
    role: "admin",
    permissions: ["orders"],
    lastLogin: "2023-05-06T16:45:00",
  },
]

// Direcciones
export const addresses: Address[] = [
  {
    id: "ADDR-001",
    userId: "USR-001",
    name: "Casa",
    address: "Calle Principal 123",
    city: "Madrid",
    zip: "28001",
    isDefault: true,
  },
  {
    id: "ADDR-002",
    userId: "USR-001",
    name: "Trabajo",
    address: "Calle Empresarial 45",
    city: "Madrid",
    zip: "28045",
    isDefault: false,
  },
  {
    id: "ADDR-003",
    userId: "USR-002",
    name: "Oficina",
    address: "Avenida Comercial 456",
    city: "Barcelona",
    zip: "08001",
    isDefault: true,
  },
  {
    id: "ADDR-004",
    userId: "USR-003",
    name: "Casa de campo",
    address: "Carretera Rural km 5",
    city: "Valencia",
    zip: "46001",
    isDefault: true,
  },
]

// Testimonios
export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Carlos Rodríguez",
    avatar: "/placeholder.svg?height=48&width=48&text=CR",
    location: "Madrid",
    rating: 5,
    text: "Excelente servicio y productos de calidad. Encontré todo lo que necesitaba para mi proyecto de renovación y el personal fue muy atento y profesional.",
  },
  {
    id: "2",
    name: "Laura Martínez",
    avatar: "/placeholder.svg?height=48&width=48&text=LM",
    location: "Toledo",
    rating: 4,
    text: "Buenos precios y amplio catálogo. La entrega fue rápida y todo llegó en perfectas condiciones. Repetiré sin duda.",
  },
  {
    id: "3",
    name: "Miguel Ángel Sánchez",
    avatar: "/placeholder.svg?height=48&width=48&text=MS",
    location: "Guadalajara",
    rating: 5,
    text: "Como profesional de la construcción, valoro mucho la calidad de las herramientas. En FerreMateriales siempre encuentro marcas de confianza a precios competitivos.",
  },
]

// Reseñas de productos
export const reviews: Review[] = [
  {
    id: "REV-001",
    productId: "taladro-percutor-750w",
    userId: "USR-001",
    rating: 5,
    title: "Excelente taladro",
    comment: "Muy potente y fácil de usar. Perfecto para trabajos de bricolaje en casa.",
    date: "2023-04-15",
    verified: true,
  },
  {
    id: "REV-002",
    productId: "taladro-percutor-750w",
    userId: "USR-002",
    rating: 4,
    title: "Buena relación calidad-precio",
    comment: "Funciona muy bien aunque es un poco pesado para trabajos prolongados.",
    date: "2023-03-22",
    verified: true,
  },
  {
    id: "REV-003",
    productId: "set-destornilladores-precision",
    userId: "USR-003",
    rating: 5,
    title: "Justo lo que necesitaba",
    comment: "Perfecto para trabajos de precisión. Las puntas son de muy buena calidad.",
    date: "2023-04-30",
    verified: true,
  },
]

// Cupones
export const coupons: Coupon[] = [
  {
    id: "COUPON-001",
    code: "BIENVENIDA10",
    discountType: "percentage",
    discountValue: 10,
    minimumPurchase: 50,
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    usageLimit: 1,
    usageCount: 0,
    active: true,
    description: "10% de descuento en tu primera compra",
  },
  {
    id: "COUPON-002",
    code: "ENVIOGRATIS",
    discountType: "freeShipping",
    discountValue: 0,
    minimumPurchase: 100,
    startDate: "2023-05-01",
    endDate: "2023-06-30",
    usageLimit: 0,
    usageCount: 0,
    active: true,
    description: "Envío gratis en compras superiores a 100€",
  },
  {
    id: "COUPON-003",
    code: "HERRAMIENTAS20",
    discountType: "percentage",
    discountValue: 20,
    minimumPurchase: 0,
    startDate: "2023-05-15",
    endDate: "2023-05-31",
    usageLimit: 0,
    usageCount: 0,
    active: true,
    description: "20% de descuento en herramientas",
    applicableCategories: ["herramientas"],
  },
]

// Notificaciones
export const notifications: Notification[] = [
  {
    id: "NOTIF-001",
    userId: "USR-001",
    title: "Pedido enviado",
    message: "Tu pedido ORD-001 ha sido enviado y llegará en 3-5 días laborables.",
    date: "2023-05-08T10:30:00",
    read: false,
    type: "order",
    link: "/mi-cuenta/pedidos/ORD-001",
  },
  {
    id: "NOTIF-002",
    userId: "USR-002",
    title: "Oferta especial",
    message: "¡Aprovecha nuestro 2x1 en pinturas hasta el 15 de junio!",
    date: "2023-05-15T09:00:00",
    read: true,
    type: "promotion",
    link: "/promociones",
  },
  {
    id: "NOTIF-003",
    userId: "USR-003",
    title: "Producto disponible",
    message: "El producto 'Sierra Circular 1200W' que estabas esperando ya está disponible.",
    date: "2023-05-10T14:15:00",
    read: false,
    type: "product",
    link: "/productos/sierra-circular-1200w",
  },
]

// Etiquetas de productos
export const productTags: ProductTag[] = [
  {
    id: "TAG-001",
    name: "Oferta",
    slug: "oferta",
    color: "#FF5733",
  },
  {
    id: "TAG-002",
    name: "Nuevo",
    slug: "nuevo",
    color: "#33FF57",
  },
  {
    id: "TAG-003",
    name: "Destacado",
    slug: "destacado",
    color: "#3357FF",
  },
  {
    id: "TAG-004",
    name: "Agotado",
    slug: "agotado",
    color: "#FF3333",
  },
]

// Atributos de productos
export const productAttributes: ProductAttribute[] = [
  {
    id: "ATTR-001",
    name: "Color",
    values: ["Rojo", "Azul", "Verde", "Negro", "Blanco"],
  },
  {
    id: "ATTR-002",
    name: "Tamaño",
    values: ["Pequeño", "Mediano", "Grande", "Extra Grande"],
  },
  {
    id: "ATTR-003",
    name: "Material",
    values: ["Acero", "Aluminio", "Plástico", "Madera", "Fibra de vidrio"],
  },
  {
    id: "ATTR-004",
    name: "Potencia",
    values: ["500W", "750W", "1000W", "1200W", "1500W"],
  },
]

// Variantes de productos
export const productVariants: ProductVariant[] = [
  {
    id: "VAR-001",
    productId: "pintura-interior-blanco-mate",
    sku: "PINT-INT-5L-001",
    barcode: "8412345678911",
    attributes: {
      Tamaño: "5L",
    },
    price: 19.99,
    discount: 0,
    inStock: true,
    images: ["/placeholder.svg?height=400&width=400&text=Pintura+5L"],
  },
  {
    id: "VAR-002",
    productId: "pintura-interior-blanco-mate",
    sku: "PINT-INT-10L-001",
    barcode: "8412345678912",
    attributes: {
      Tamaño: "10L",
    },
    price: 29.99,
    discount: 0,
    inStock: true,
    images: ["/placeholder.svg?height=400&width=400&text=Pintura+10L"],
  },
  {
    id: "VAR-003",
    productId: "pintura-interior-blanco-mate",
    sku: "PINT-INT-15L-001",
    barcode: "8412345678905",
    attributes: {
      Tamaño: "15L",
    },
    price: 39.99,
    discount: 0,
    inStock: true,
    images: [
      "/placeholder.svg?height=400&width=400&text=Pintura",
      "/placeholder.svg?height=400&width=400&text=Pintura+2",
    ],
  },
]

// Inventario
export const inventory: Inventory[] = [
  {
    id: "INV-001",
    productId: "taladro-percutor-750w",
    variantId: null,
    quantity: 25,
    location: "Almacén Principal",
    lastUpdated: "2023-05-01",
    minimumStock: 5,
    reservedQuantity: 2,
  },
  {
    id: "INV-002",
    productId: "set-destornilladores-precision",
    variantId: null,
    quantity: 50,
    location: "Almacén Principal",
    lastUpdated: "2023-05-02",
    minimumStock: 10,
    reservedQuantity: 0,
  },
  {
    id: "INV-003",
    productId: "sierra-circular-1200w",
    variantId: null,
    quantity: 0,
    location: "Almacén Principal",
    lastUpdated: "2023-05-03",
    minimumStock: 3,
    reservedQuantity: 0,
  },
]

// Historial de precios
export const priceHistory: PriceHistory[] = [
  {
    id: "PRICE-001",
    productId: "taladro-percutor-750w",
    variantId: null,
    price: 99.99,
    date: "2023-01-01",
  },
  {
    id: "PRICE-002",
    productId: "taladro-percutor-750w",
    variantId: null,
    price: 94.99,
    date: "2023-03-15",
  },
  {
    id: "PRICE-003",
    productId: "taladro-percutor-750w",
    variantId: null,
    price: 89.99,
    date: "2023-05-01",
  },
]

// Estados de pedidos
export const orderStatuses: OrderStatus[] = [
  {
    id: "STATUS-001",
    name: "Pendiente",
    slug: "pending",
    color: "#FFC107",
    description: "El pedido ha sido recibido pero aún no ha sido procesado",
  },
  {
    id: "STATUS-002",
    name: "Procesando",
    slug: "processing",
    color: "#2196F3",
    description: "El pedido está siendo preparado para su envío",
  },
  {
    id: "STATUS-003",
    name: "Completado",
    slug: "completed",
    color: "#4CAF50",
    description: "El pedido ha sido entregado correctamente",
  },
  {
    id: "STATUS-004",
    name: "Cancelado",
    slug: "cancelled",
    color: "#F44336",
    description: "El pedido ha sido cancelado",
  },
]

// Estados de pago
export const paymentStatuses: PaymentStatus[] = [
  {
    id: "PAY-STATUS-001",
    name: "Pendiente",
    slug: "pending",
    color: "#FFC107",
    description: "El pago está pendiente de confirmación",
  },
  {
    id: "PAY-STATUS-002",
    name: "Completado",
    slug: "completed",
    color: "#4CAF50",
    description: "El pago ha sido completado correctamente",
  },
  {
    id: "PAY-STATUS-003",
    name: "Fallido",
    slug: "failed",
    color: "#F44336",
    description: "El pago ha fallado",
  },
  {
    id: "PAY-STATUS-004",
    name: "Reembolsado",
    slug: "refunded",
    color: "#9C27B0",
    description: "El pago ha sido reembolsado",
  },
]

// Estados de envío
export const shippingStatuses: ShippingStatus[] = [
  {
    id: "SHIP-STATUS-001",
    name: "Pendiente",
    slug: "pending",
    color: "#FFC107",
    description: "El envío está pendiente de procesamiento",
  },
  {
    id: "SHIP-STATUS-002",
    name: "Preparando",
    slug: "preparing",
    color: "#2196F3",
    description: "El pedido está siendo preparado para su envío",
  },
  {
    id: "SHIP-STATUS-003",
    name: "Enviado",
    slug: "shipped",
    color: "#4CAF50",
    description: "El pedido ha sido enviado",
  },
  {
    id: "SHIP-STATUS-004",
    name: "Entregado",
    slug: "delivered",
    color: "#4CAF50",
    description: "El pedido ha sido entregado correctamente",
  },
  {
    id: "SHIP-STATUS-005",
    name: "Cancelado",
    slug: "cancelled",
    color: "#F44336",
    description: "El envío ha sido cancelado",
  },
]

// Función para filtrar datos de ventas por período
export function filterSalesData(
  period: "day" | "week" | "month" | "year",
  startDate?: string,
  endDate?: string,
  data: SalesData[] = salesData,
): SalesData[] {
  let filteredData = [...data]

  if (startDate) {
    const start = new Date(startDate)
    filteredData = filteredData.filter((item) => new Date(item.date) >= start)
  }

  if (endDate) {
    const end = new Date(endDate)
    filteredData = filteredData.filter((item) => new Date(item.date) <= end)
  }

  const now = new Date()

  filteredData = filteredData.filter((item) => {
    const itemDate = new Date(item.date)

    switch (period) {
      case "day":
        return (
          itemDate.getDate() === now.getDate() &&
          itemDate.getMonth() === now.getMonth() &&
          itemDate.getFullYear() === now.getFullYear()
        )
      case "week":
        const oneWeekAgo = new Date(now)
        oneWeekAgo.setDate(now.getDate() - 7)
        return itemDate >= oneWeekAgo
      case "month":
        return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear()
      case "year":
        return itemDate.getFullYear() === now.getFullYear()
      default:
        return true
    }
  })

  return filteredData
}

// Función para obtener estadísticas filtradas
export function getFilteredStats(period: "day" | "week" | "month" | "year"): StatsData {
  const filteredSales = filterSalesData(period)

  // Calcular el total de ventas
  const totalSales = filteredSales.reduce((sum, item) => sum + item.amount, 0)

  // Calcular el número de pedidos (asumimos que cada entrada en salesData es un pedido)
  const totalOrders = filteredSales.length

  // Calcular el promedio de venta por pedido
  const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0

  // Calcular el número de pedidos pendientes
  const pendingOrders = orders.filter((order) => order.status === "pending").length

  return {
    totalSales,
    totalOrders,
    totalCustomers: 0, // This field is not used
    averageOrderValue,
    pendingOrders,
  }
}

// Funciones para obtener datos
export function getProducts(): Product[] {
  return products
}

export function getFeaturedProducts(): Product[] {
  return products.filter((product) => product.featured)
}

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id)
}

export function getRelatedProducts(category: string, currentProductId: string): Product[] {
  return products.filter((product) => product.category === category && product.id !== currentProductId).slice(0, 4)
}

export function getOrders(): OrderComplete[] {
  return orders
}

export function getOrderById(id: string): OrderComplete | undefined {
  return orders.find((order) => order.id === id)
}

export function getUsers(): User[] {
  return users
}

export function getUserById(id: string): User | undefined {
  return users.find((user) => user.id === id)
}

export function getAdmins(): Admin[] {
  return admins
}

export function getAdminById(id: string): Admin | undefined {
  return admins.find((admin) => admin.id === id)
}

export function getAddresses(userId?: string): Address[] {
  if (userId) {
    return addresses.filter((address) => address.userId === userId)
  }
  return addresses
}

export function getAddressById(id: string): Address | undefined {
  return addresses.find((address) => address.id === id)
}

export function getBrands(): Brand[] {
  return brands
}

export function getBrandById(id: string): Brand | undefined {
  return brands.find((brand) => brand.id === id)
}

export function getSuppliers(): Supplier[] {
  return suppliers
}

export function getSupplierById(id: string): Supplier | undefined {
  return suppliers.find((supplier) => supplier.id === id)
}

export function getPromotions(): Promotion[] {
  return promotions
}

export function getPromotionById(id: string): Promotion | undefined {
  return promotions.find((promotion) => promotion.id === id)
}

export function getPaymentMethods(): PaymentMethod[] {
  return paymentMethods
}

export function getPaymentMethodById(id: string): PaymentMethod | undefined {
  return paymentMethods.find((method) => method.id === id)
}

export function getShippingMethods(): ShippingMethod[] {
  return shippingMethods
}

export function getShippingMethodById(id: string): ShippingMethod | undefined {
  return shippingMethods.find((method) => method.id === id)
}

export function getReviews(productId?: string): Review[] {
  if (productId) {
    return reviews.filter((review) => review.productId === productId)
  }
  return reviews
}

export function getReviewById(id: string): Review | undefined {
  return reviews.find((review) => review.id === id)
}

export function getCoupons(): Coupon[] {
  return coupons
}

export function getCouponByCode(code: string): Coupon | undefined {
  return coupons.find((coupon) => coupon.code === code)
}

export function getNotifications(userId: string): Notification[] {
  return notifications.filter((notification) => notification.userId === userId)
}

export function getProductTags(): ProductTag[] {
  return productTags
}

export function getProductAttributes(): ProductAttribute[] {
  return productAttributes
}

export function getProductVariants(productId?: string): ProductVariant[] {
  if (productId) {
    return productVariants.filter((variant) => variant.productId === productId)
  }
  return productVariants
}

export function getInventory(productId?: string): Inventory[] {
  if (productId) {
    return inventory.filter((item) => item.productId === productId)
  }
  return inventory
}

export function getPriceHistory(productId: string): PriceHistory[] {
  return priceHistory.filter((item) => item.productId === productId)
}

export function getOrderStatuses(): OrderStatus[] {
  return orderStatuses
}

export function getPaymentStatuses(): PaymentStatus[] {
  return paymentStatuses
}

export function getShippingStatuses(): ShippingStatus[] {
  return shippingStatuses
}

export { categories as getCategories }
