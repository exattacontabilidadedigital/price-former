const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkData() {
  try {
    console.log('🔍 Verificando dados no banco...\n')

    // Verificar usuários
    const users = await prisma.user.findMany()
    console.log(`👥 Usuários: ${users.length}`)
    users.forEach(user => console.log(`  - ${user.name} (${user.email})`))

    // Verificar empresas
    const companies = await prisma.company.findMany()
    console.log(`\n🏢 Empresas: ${companies.length}`)
    companies.forEach(company => console.log(`  - ${company.name}`))

    // Verificar produtos
    const products = await prisma.product.findMany()
    console.log(`\n📦 Produtos: ${products.length}`)
    products.forEach(product => console.log(`  - ${product.name} - R$ ${product.costPrice}`))

    // Verificar despesas
    const expenses = await prisma.expense.findMany()
    console.log(`\n💸 Despesas: ${expenses.length}`)
    expenses.forEach(expense => console.log(`  - ${expense.description} - R$ ${expense.value} (${expense.type})`))

    // Verificar impostos
    const taxes = await prisma.tax.findMany()
    console.log(`\n📊 Impostos: ${taxes.length}`)
    taxes.forEach(tax => console.log(`  - ${tax.name} - ${tax.rate}%`))

    // Verificar receitas
    const revenues = await prisma.revenue.findMany()
    console.log(`\n💰 Receitas: ${revenues.length}`)
    revenues.forEach(revenue => console.log(`  - R$ ${revenue.value} (${revenue.period})`))

    // Verificar cálculos
    const calculations = await prisma.calculation.findMany()
    console.log(`\n🧮 Cálculos: ${calculations.length}`)
    calculations.forEach(calc => console.log(`  - ${calc.productName} - R$ ${calc.suggestedPrice}`))

    console.log('\n✅ Verificação concluída!')

  } catch (error) {
    console.error('❌ Erro ao verificar dados:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkData()