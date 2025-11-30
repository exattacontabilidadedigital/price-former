const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createTestUser() {
  try {
    // Verificar se já existe algum usuário
    const existingUsers = await prisma.user.findMany()
    
    if (existingUsers.length > 0) {
      console.log('Usuários existentes encontrados:', existingUsers.length)
      for (const user of existingUsers) {
        console.log(`- ${user.name} (${user.email}) - ID: ${user.id}`)
      }
      return
    }

    console.log('Nenhum usuário encontrado. Criando usuário de teste...')

    // Criar empresa de teste
    const company = await prisma.company.create({
      data: {
        name: 'Empresa Teste',
        fantasyName: 'Teste',
        cnpj: '12.345.678/0001-90',
        address: 'Rua Teste, 123',
      },
    })

    console.log('Empresa criada:', company.name)

    // Criar usuário de teste
    const hashedPassword = await bcrypt.hash('123456789', 10)
    
    const user = await prisma.user.create({
      data: {
        name: 'Usuário Teste',
        email: 'teste@teste.com',
        password: hashedPassword,
        role: 'ADMIN',
        companyId: company.id,
      },
    })

    console.log('Usuário criado:', user.name, user.email)
    console.log('Senha:', '123456789')

  } catch (error) {
    console.error('Erro ao criar usuário de teste:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestUser()