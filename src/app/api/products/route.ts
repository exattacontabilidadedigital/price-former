import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
    const products = await prisma.product.findMany()
    return NextResponse.json(products)
}

export async function POST(request: Request) {
    const body = await request.json()
    const product = await prisma.product.create({
        data: {
            name: body.name,
            costPrice: parseFloat(body.costPrice),
            markup: body.markup ? parseFloat(body.markup) : null,
            salesPrice: body.salesPrice ? parseFloat(body.salesPrice) : null,
        },
    })
    return NextResponse.json(product)
}
