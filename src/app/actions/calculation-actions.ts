"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export async function getCalculations() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }

  try {
    const calculations = await prisma.calculation.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return calculations
  } catch (error) {
    console.error("Error fetching calculations:", error)
    throw error
  }
}

export async function saveCalculation(data: {
  id?: string
  calculationName?: string
  productId?: string
  productName: string
  costPrice: number
  markup: number
  suggestedPrice: number
  totalCosts: number
  totalTaxes: number
  profitMargin: number
  desiredProfitMargin?: number
  calculationData: {
    icms: number
    ipi: number
    freight: number
    otherCosts: number
    pis: number
    cofins: number
    cpp: number
    issqn: number
    csll: number
    irpj: number
    taxOthers: number
  }
}) {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect("/login")
  }

  // Verify if user exists in database to avoid Foreign Key errors
  const userExists = await prisma.user.findUnique({
    where: { id: session.user.id }
  })

  if (!userExists) {
    throw new Error("Usuário não encontrado. Por favor, faça login novamente.")
  }

  try {
    if (data.id) {
      // Verify ownership before updating
      const existingCalculation = await prisma.calculation.findUnique({
        where: { id: data.id }
      })

      if (!existingCalculation || existingCalculation.userId !== session.user.id) {
        throw new Error("Cálculo não encontrado ou você não tem permissão para editá-lo.")
      }

      const calculation = await prisma.calculation.update({
        where: { id: data.id },
        data: {
          calculationName: data.calculationName || `Cálculo ${Date.now()}`,
          productId: data.productId,
          productName: data.productName,
          costPrice: data.costPrice,
          markup: data.markup,
          suggestedPrice: data.suggestedPrice,
          totalCosts: data.totalCosts,
          totalTaxes: data.totalTaxes,
          profitMargin: data.profitMargin,
          desiredProfitMargin: data.desiredProfitMargin,
          icms: data.calculationData.icms,
          ipi: data.calculationData.ipi,
          freight: data.calculationData.freight,
          otherCosts: data.calculationData.otherCosts,
          pis: data.calculationData.pis,
          cofins: data.calculationData.cofins,
          cpp: data.calculationData.cpp,
          issqn: data.calculationData.issqn,
          csll: data.calculationData.csll,
          irpj: data.calculationData.irpj,
          taxOthers: data.calculationData.taxOthers,
        }
      })
      return calculation
    } else {
      const calculation = await prisma.calculation.create({
        data: {
          calculationName: data.calculationName || `Cálculo ${Date.now()}`,
          productId: data.productId,
          productName: data.productName,
          costPrice: data.costPrice,
          markup: data.markup,
          suggestedPrice: data.suggestedPrice,
          totalCosts: data.totalCosts,
          totalTaxes: data.totalTaxes,
          profitMargin: data.profitMargin,
          desiredProfitMargin: data.desiredProfitMargin,
          icms: data.calculationData.icms,
          ipi: data.calculationData.ipi,
          freight: data.calculationData.freight,
          otherCosts: data.calculationData.otherCosts,
          pis: data.calculationData.pis,
          cofins: data.calculationData.cofins,
          cpp: data.calculationData.cpp,
          issqn: data.calculationData.issqn,
          csll: data.calculationData.csll,
          irpj: data.calculationData.irpj,
          taxOthers: data.calculationData.taxOthers,
          userId: session.user.id
        }
      })
      return calculation
    }
  } catch (error) {
    console.error("Error saving calculation:", error)
    throw error
  }
}

export async function deleteCalculation(id: string) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }

  try {
    await prisma.calculation.delete({
      where: {
        id: id,
        userId: session.user.id // Garantir que só pode deletar seus próprios cálculos
      }
    })

    return { success: true }
  } catch (error) {
    console.error("Error deleting calculation:", error)
    throw error
  }
}

export async function getCalculation(id: string) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }

  try {
    const calculation = await prisma.calculation.findFirst({
      where: {
        id: id,
        userId: session.user.id
      }
    })

    return calculation
  } catch (error) {
    console.error("Error fetching calculation:", error)
    throw error
  }
}