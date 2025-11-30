import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
    const taxes = await prisma.tax.findMany()
    return NextResponse.json(taxes)
}

export async function POST(request: Request) {
    const body = await request.json()
    const tax = await prisma.tax.create({
        data: {
            name: body.name,
            rate: parseFloat(body.rate),
        },
    })
    return NextResponse.json(tax)
}
