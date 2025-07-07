"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

function ProductsSearchContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [searchQuery, setSearchQuery] = useState(searchParams?.get("search") || "")

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            router.push(`/productos?search=${encodeURIComponent(searchQuery.trim())}`)
        }
    }

    return (
        <form onSubmit={handleSearch} className="w-full max-w-md">
            <div className="relative">
                <Input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
        </form>
    )
}

export function ProductsSearch() {
    return (
        <Suspense fallback={
            <div className="w-full max-w-md">
                <div className="relative">
                    <Input
                        type="text"
                        placeholder="Buscar productos..."
                        disabled
                        className="w-full pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                </div>
            </div>
        }>
            <ProductsSearchContent />
        </Suspense>
    )
}
