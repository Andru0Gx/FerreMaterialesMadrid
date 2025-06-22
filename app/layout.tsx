import type React from "react"
import type { Metadata } from "next"
import "@fontsource-variable/onest"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { CartProvider } from "@/context/cart-context"
import { AuthProvider } from "@/hooks/use-auth"
import { Toaster } from "@/components/ui/toaster"
import { COMPANY_INFO } from "@/lib/data"

export const metadata: Metadata = {
  title: `${COMPANY_INFO.nombre} - Tu ferretería de confianza`,
  description: "Encuentra todo lo que necesitas para tus proyectos de construcción, remodelación y bricolaje.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/svg/favicon.svg" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light">
          <AuthProvider>
            <CartProvider>
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
              <Toaster />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
