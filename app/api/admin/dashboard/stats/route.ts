import { NextResponse } from "next/server"
import { getDashboardStats } from "@/lib/db-queries"

export async function GET(req: Request) {
    // Puedes obtener el período desde la query si lo deseas
    const { searchParams } = new URL(req.url)
    const period = searchParams.get("period") || "year"
    const stats = await getDashboardStats(period)
    return NextResponse.json(stats)
}
