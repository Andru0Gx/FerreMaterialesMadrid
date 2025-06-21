import { cookies } from "next/headers"
import { prisma } from "@/lib/db"

export interface Session {
    user: {
        id: string
        name: string
        email: string
        role: string
    }
}

export async function getServerSession(): Promise<Session | null> {
    try {
        const sessionId = cookies().get("sessionId")?.value

        if (!sessionId) {
            return null
        }

        const user = await prisma.user.findFirst({
            where: {
                id: sessionId,
                isActive: true
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
        })

        if (!user) {
            return null
        }

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        }
    } catch (error) {
        return null
    }
} 