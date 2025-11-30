import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
    const expenses = await prisma.expense.findMany()
    return NextResponse.json(expenses)
}

export async function POST(request: Request) {
    const body = await request.json()
    const expense = await prisma.expense.create({
        data: {
            description: body.description,
            value: parseFloat(body.value),
            type: body.type,
        },
    })
    return NextResponse.json(expense)
}
