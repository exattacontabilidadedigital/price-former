const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function createTestData() {
  try {
    console.log('Criando dados de teste...')

    // Criar uma empresa (ou usar existente)
    const company = await prisma.company.upsert({
      where: { id: 'test-company-id' },
      update: {},
      create: {
        id: 'test-company-id',
        name: 'Exatta Contabilidade',
        fantasyName: 'Exatta',
        cnpj: '35496100000135'
      }
    })
    console.log('Empresa:', company.name)

    // Criar um usuário (ou usar existente)
    const user = await prisma.user.upsert({
      where: { id: 'test-user-id' },
      update: {},
      create: {
        id: 'test-user-id',
        email: 'teste@exatta.com.br',
        name: 'Usuário Teste',
        password: 'hashed-password-test', // Em produção seria um hash real
        companyId: company.id
      }
    })
    console.log('Usuário:', user.name)

    // Criar um produto (ou usar existente)
    const product = await prisma.product.upsert({
      where: { id: 'test-product-id' },
      update: {},
      create: {
        id: 'test-product-id',
        name: 'Produto Teste',
        ncm: '12345678',
        costPrice: 10.0
      }
    })
    console.log('Produto:', product.name)

    // Criar algumas receitas e despesas
    // (não há relação com company em Revenue/Expense pelo schema atual)

    console.log('Dados de teste criados/verificados com sucesso!')

  } catch (error) {
    console.error('Erro ao criar dados:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestData()