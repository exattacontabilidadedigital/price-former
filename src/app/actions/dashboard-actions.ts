'use server'

import { prisma } from "@/lib/prisma"

export async function getDashboardMetrics() {
    const products = await prisma.product.findMany()
    const revenues = await prisma.revenue.findMany()
    const expenses = await prisma.expense.findMany()

    const totalProducts = products.length

    // Calculate metrics
    const totalBilling = revenues.reduce((acc, curr) => acc + curr.value, 0)
    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.value, 0)

    // Potential Revenue from Products (for reference or other cards)
    const totalPotentialRevenue = products.reduce((acc, curr) => acc + (curr.salesPrice || 0), 0)

    const averageMarkup = totalProducts > 0
        ? products.reduce((acc, curr) => acc + (curr.markup || 0), 0) / totalProducts
        : 0

    // Top 5 products by margin (markup)
    const topProducts = [...products]
        .sort((a, b) => (b.markup || 0) - (a.markup || 0))
        .slice(0, 5)
        .map(p => ({
            name: p.name,
            value: p.markup || 0,
            color: 'bg-blue-500'
        }))

    // Low markup products (e.g. < 1.5)
    const lowMarkupProducts = products
        .filter(p => (p.markup || 0) < 1.5 && (p.markup || 0) > 0)
        .slice(0, 5)
        .map(p => ({
            name: p.name,
            current: p.markup || 0,
            suggested: 2.0
        }))

    return {
        totalBilling,
        totalExpenses,
        totalPotentialRevenue,
        averageMarkup,
        topProducts,
        lowMarkupProducts,
        totalProducts
    }
}
