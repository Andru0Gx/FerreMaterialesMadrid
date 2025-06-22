import { NextResponse } from "next/server"
import { getRecentOrders } from "@/lib/db-queries"

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const period = searchParams.get("period") || "year"
    const limit = parseInt(searchParams.get("limit") || "5", 10)
    const orders = await getRecentOrders(period, limit)
    return NextResponse.json(orders)
}
