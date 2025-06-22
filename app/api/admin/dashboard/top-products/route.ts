import { NextResponse } from "next/server"
import { getTopProducts } from "@/lib/db-queries"

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const period = searchParams.get("period") || "year"
    const limit = parseInt(searchParams.get("limit") || "5", 10)
    const products = await getTopProducts(period, limit)
    return NextResponse.json(products)
}
