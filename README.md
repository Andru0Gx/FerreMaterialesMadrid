# Ferre Materiales Madrid - Sistema de Gestión

## Descripción
Sistema de gestión integral para Ferre Materiales Madrid, una ferretería ubicada en Maturín. La plataforma incluye gestión de inventario, usuarios, pedidos y un sistema de comercio electrónico.

## Características Principales

### Panel de Administración
- **Gestión de Usuarios**
  - Vista general de todos los usuarios
  - Filtrado y búsqueda avanzada
  - Gestión de estados (activo/inactivo)
  - Historial de pedidos por usuario
  - Sistema de comunicación integrado (email y WhatsApp)

- **Gestión de Productos**
  - Catálogo completo de productos
  - Control de inventario
  - Gestión de categorías
  - Sistema de precios y descuentos
  - Imágenes y descripciones detalladas

- **Gestión de Pedidos**
  - Seguimiento en tiempo real
  - Estados personalizables
  - Historial completo
  - Sistema de notificaciones

### Tienda en Línea
- Catálogo de productos
- Carrito de compras
- Sistema de búsqueda y filtros
- Proceso de checkout optimizado
- Integración con sistema de pagos
- Seguimiento de pedidos

## Tecnologías Utilizadas

### Frontend
- Next.js 13 (App Router)
- React
- TypeScript
- Tailwind CSS
- Shadcn/ui
- Lucide Icons

### Backend
- Next.js API Routes
- Prisma ORM
- PostgreSQL
- NextAuth.js para autenticación

### Herramientas de Desarrollo
- ESLint
- Prettier
- TypeScript
- Git

## Requisitos del Sistema

- Node.js 18.x o superior
- PostgreSQL 14.x o superior
- NPM o Yarn

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/Andru0Gx/FerreMaterialesMadrid.git
```

2. Instalar dependencias:
```bash
npm install
# o
yarn install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

Asegúrate de configurar las siguientes variables en tu archivo .env:
```env
DATABASE_URL="tu_url_de_conexión"
DATABASE_NAME="nombre_de_tu_base_de_datos"
DATABASE_PASSWORD="tu_contraseña_de_base_de_datos"
```

4. Configurar la base de datos:
```bash
npx prisma migrate dev
```

5. Iniciar el servidor de desarrollo:
```bash
npm run dev
# o
yarn dev
```

## Estructura del Proyecto

```
├── app/
│   ├── admin/           # Panel de administración
│   ├── api/            # API Routes
│   ├── auth/           # Páginas de autenticación
│   └── (store)/        # Tienda en línea
├── components/         # Componentes reutilizables
├── lib/               # Utilidades y configuraciones
├── prisma/            # Esquema y migraciones de DB
└── public/            # Archivos estáticos
```

## Configuración

### Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
```env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/nombre_db"
DATABASE_NAME="nombre_de_tu_base_de_datos"
DATABASE_PASSWORD="tu_contraseña_de_base_de_datos"
```

## Despliegue

El proyecto está configurado para ser desplegado en Vercel:

1. Conectar el repositorio con Vercel
2. Configurar las variables de entorno mencionadas arriba
3. Desplegar

## Contribución

1. Fork del repositorio
2. Crear una rama para la feature (`git checkout -b feature/AmazingFeature`)
3. Commit de los cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia

Este proyecto está bajo la licencia [MIT](https://choosealicense.com/licenses/mit/).

## Contacto

Desarrollador - [@Andru0Gx](https://github.com/Andru0Gx)

Link del proyecto: [https://github.com/Andru0Gx/FerreMaterialesMadrid](https://github.com/Andru0Gx/FerreMaterialesMadrid)

## Agradecimientos

- [Next.js](https://nextjs.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn/ui](https://ui.shadcn.com) 