"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { AdminSidebar } from "./admin-sidebar"

export function MobileSidebar() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
        <div className="flex h-16 items-center border-b px-4">
          <div className="flex items-center gap-2 font-semibold">
            <Home className="h-5 w-5" />
            <span>Panel de navegación</span>
          </div>
        </div>
        <AdminSidebar />
      </SheetContent>
    </Sheet>
  )
}
