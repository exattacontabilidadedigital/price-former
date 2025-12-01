'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// --- Expenses ---

export async function getExpenses() {
    return await prisma.expense.findMany({
        orderBy: { createdAt: 'desc' }
    })
}

export async function createExpense(data: {
    description: string
    value: number
    type: string
}) {
    const expense = await prisma.expense.create({
        data: {
            description: data.description,
            value: data.value,
            type: data.type,
        },
    })
    revalidatePath('/costs')
    revalidatePath('/calculator')
    return expense
}

export async function updateExpense(id: string, data: {
    description: string
    value: number
    type: string
}) {
    const expense = await prisma.expense.update({
        where: { id },
        data: {
            description: data.description,
            value: data.value,
            type: data.type,
        },
    })
    revalidatePath('/costs')
    revalidatePath('/calculator')
    return expense
}

export async function deleteExpense(id: string) {
    await prisma.expense.delete({ where: { id } })
    revalidatePath('/costs')
    revalidatePath('/calculator')
}

// --- Revenue ---

export async function getRevenues() {
    return await prisma.revenue.findMany({
        orderBy: { createdAt: 'desc' }
    })
}

export async function createRevenue(data: {
    value: number
    period: string
}) {
    const revenue = await prisma.revenue.create({
        data: {
            value: data.value,
            period: data.period,
        },
    })
    revalidatePath('/costs')
    revalidatePath('/calculator')
    return revenue
}

export async function updateRevenue(id: string, data: {
    value: number
    period: string
}) {
    const revenue = await prisma.revenue.update({
        where: { id },
        data: {
            value: data.value,
            period: data.period,
        },
    })
    revalidatePath('/costs')
    revalidatePath('/calculator')
    return revenue
}

export async function deleteRevenue(id: string) {
    await prisma.revenue.delete({ where: { id } })
    revalidatePath('/costs')
    revalidatePath('/calculator')
}

// --- Taxes ---

export async function getTaxes() {
    return await prisma.tax.findMany({
        orderBy: { createdAt: 'desc' }
    })
}

export async function createTax(data: {
    name: string
    rate: number
    type: string
}) {
    const tax = await prisma.tax.create({
        data: {
            name: data.name,
            rate: data.rate,
            type: data.type,
        },
    })
    revalidatePath('/costs')
    revalidatePath('/calculator')
    return tax
}

export async function updateTax(id: string, data: {
    name: string
    rate: number
    type: string
}) {
    const tax = await prisma.tax.update({
        where: { id },
        data: {
            name: data.name,
            rate: data.rate,
            type: data.type,
        },
    })
    revalidatePath('/costs')
    revalidatePath('/calculator')
    return tax
}

export async function deleteTax(id: string) {
    await prisma.tax.delete({ where: { id } })
    revalidatePath('/costs')
    revalidatePath('/calculator')
}
