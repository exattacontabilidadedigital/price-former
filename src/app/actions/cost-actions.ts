'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// --- Expenses ---

export async function getExpenses() {
    return await prisma.expense.findMany({
        orderBy: { createdAt: 'desc' }
    })
}

export async function getPaginatedExpenses(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit
    const [expenses, total] = await prisma.$transaction([
        prisma.expense.findMany({
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' }
        }),
        prisma.expense.count()
    ])
    
    return {
        expenses,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        totalItems: total
    }
}

export async function getExpensesSummary() {
    const fixed = await prisma.expense.aggregate({
        where: { type: 'fixed' },
        _sum: { value: true }
    })
    const variable = await prisma.expense.aggregate({
        where: { type: 'variable' },
        _sum: { value: true }
    })
    return {
        totalFixed: fixed._sum.value || 0,
        totalVariable: variable._sum.value || 0
    }
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

export async function createExpenses(data: {
    description: string
    value: number
    type: string
}[]) {
    const expenses = await prisma.expense.createMany({
        data: data.map(item => ({
            description: item.description,
            value: item.value,
            type: item.type,
        })),
    })
    revalidatePath('/costs')
    revalidatePath('/calculator')
    return expenses
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

export async function getPaginatedRevenues(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit
    const [revenues, total] = await prisma.$transaction([
        prisma.revenue.findMany({
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' }
        }),
        prisma.revenue.count()
    ])
    
    return {
        revenues,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        totalItems: total
    }
}

export async function getRevenuesSummary() {
    const monthly = await prisma.revenue.aggregate({
        where: { period: 'monthly' },
        _sum: { value: true }
    })
    const annual = await prisma.revenue.aggregate({
        where: { period: 'annual' },
        _sum: { value: true }
    })
    return {
        totalMonthly: monthly._sum.value || 0,
        totalAnnual: annual._sum.value || 0
    }
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

export async function createRevenues(data: {
    value: number
    period: string
}[]) {
    const revenues = await prisma.revenue.createMany({
        data: data.map(item => ({
            value: item.value,
            period: item.period,
        })),
    })
    revalidatePath('/costs')
    revalidatePath('/calculator')
    return revenues
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

export async function getPaginatedTaxes(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit
    const [taxes, total] = await prisma.$transaction([
        prisma.tax.findMany({
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' }
        }),
        prisma.tax.count()
    ])
    
    return {
        taxes,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        totalItems: total
    }
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

export async function createTaxes(data: {
    name: string
    rate: number
    type: string
}[]) {
    const taxes = await prisma.tax.createMany({
        data: data.map(item => ({
            name: item.name,
            rate: item.rate,
            type: item.type,
        })),
    })
    revalidatePath('/costs')
    revalidatePath('/calculator')
    return taxes
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
