'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getProducts() {
    return await prisma.product.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    })
}

export async function getPaginatedProducts(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit
    
    const [products, total] = await Promise.all([
        prisma.product.findMany({
            skip,
            take: limit,
            orderBy: {
                createdAt: 'desc'
            }
        }),
        prisma.product.count()
    ])
    
    return {
        products,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        totalItems: total
    }
}

export async function createProduct(data: {
    name: string
    ncm?: string
    costPrice: number
    markup?: number
    salesPrice?: number
    icms?: number
    icmsPurchase?: number
    ipi?: number
    ipiPurchase?: number
    freight?: number
    others?: number
    pis?: number
    cofins?: number
    cpp?: number
    issqn?: number
    csll?: number
    irpj?: number
    taxOthers?: number
}) {
    const product = await prisma.product.create({
        data: {
            name: data.name,
            ncm: data.ncm,
            costPrice: data.costPrice,
            markup: data.markup,
            salesPrice: data.salesPrice,
            icms: data.icms,
            icmsPurchase: data.icmsPurchase,
            ipi: data.ipi,
            ipiPurchase: data.ipiPurchase,
            freight: data.freight,
            others: data.others,
            pis: data.pis,
            cofins: data.cofins,
            cpp: data.cpp,
            issqn: data.issqn,
            csll: data.csll,
            irpj: data.irpj,
            taxOthers: data.taxOthers,
        },
    })
    revalidatePath('/products')
    return product
}

export async function createProducts(products: any[]) {
    const createdProducts = await prisma.$transaction(
        products.map((product) => 
            prisma.product.create({
                data: {
                    name: product.name,
                    ncm: product.ncm,
                    costPrice: product.costPrice,
                    markup: product.markup,
                    salesPrice: product.salesPrice,
                    icms: product.icms,
                    icmsPurchase: product.icmsPurchase,
                    ipi: product.ipi,
                    ipiPurchase: product.ipiPurchase,
                    freight: product.freight,
                    others: product.others,
                    pis: product.pis,
                    cofins: product.cofins,
                    cpp: product.cpp,
                    issqn: product.issqn,
                    csll: product.csll,
                    irpj: product.irpj,
                    taxOthers: product.taxOthers,
                }
            })
        )
    )
    revalidatePath('/products')
    return createdProducts
}

export async function updateProduct(id: string, data: {
    name: string
    ncm?: string
    costPrice: number
    markup?: number
    salesPrice?: number
    icms?: number
    icmsPurchase?: number
    ipi?: number
    ipiPurchase?: number
    freight?: number
    others?: number
    pis?: number
    cofins?: number
    cpp?: number
    issqn?: number
    csll?: number
    irpj?: number
    taxOthers?: number
}) {
    const product = await prisma.product.update({
        where: { id },
        data: {
            name: data.name,
            ncm: data.ncm,
            costPrice: data.costPrice,
            markup: data.markup,
            salesPrice: data.salesPrice,
            icms: data.icms,
            icmsPurchase: data.icmsPurchase,
            ipi: data.ipi,
            ipiPurchase: data.ipiPurchase,
            freight: data.freight,
            others: data.others,
            pis: data.pis,
            cofins: data.cofins,
            cpp: data.cpp,
            issqn: data.issqn,
            csll: data.csll,
            irpj: data.irpj,
            taxOthers: data.taxOthers,
        },
    })
    revalidatePath('/products')
    return product
}

export async function deleteProduct(id: string) {
    await prisma.product.delete({
        where: { id },
    })
    revalidatePath('/products')
}
