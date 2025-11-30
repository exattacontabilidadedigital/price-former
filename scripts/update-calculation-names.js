const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function updateCalculationNames() {
  try {
    console.log('Atualizando nomes dos cálculos...')
    
    // Buscar todos os cálculos sem nome
    const calculations = await prisma.calculation.findMany({
      where: {
        calculationName: null
      }
    })
    
    console.log(`Encontrados ${calculations.length} cálculos sem nome`)
    
    // Atualizar cada cálculo
    let updated = 0
    for (const calc of calculations) {
      const calculationName = `Cenário ${updated + 1}`
      
      await prisma.calculation.update({
        where: { id: calc.id },
        data: { calculationName }
      })
      
      updated++
      console.log(`Atualizado: ${calculationName} (ID: ${calc.id})`)
    }
    
    console.log(`\nTotal de ${updated} cálculos atualizados com sucesso!`)
    
  } catch (error) {
    console.error('Erro ao atualizar nomes:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateCalculationNames()