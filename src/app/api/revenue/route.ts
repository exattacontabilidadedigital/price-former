import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
    const revenue = await prisma.revenue.findMany()
    return NextResponse.json(revenue)
}

export async function POST(request: Request) {
    const body = await request.json()
    const revenue = await prisma.revenue.create({
        data: {
            value: parseFloat(body.value),
            period: body.period,
            date: body.date ? new Date(body.date) : undefined,
        },
    })
    return NextResponse.json(revenue)
}
