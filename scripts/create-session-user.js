const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createSessionUser() {
  try {
    // Dados da sessão
    const sessionUserId = '63463500-a395-4fa9-88e1-30407182a6ca'
    const sessionUserName = 'ROMARIO RODRIGUES'
    const sessionUserEmail = 'exattagestaocontabil@gmail.com'
    
    console.log('🔍 Verificando usuário da sessão...')

    // Verificar se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { id: sessionUserId }
    })

    if (existingUser) {
      console.log('✅ Usuário da sessão já existe!')
      return
    }

    console.log('❌ Usuário da sessão não encontrado. Criando...')

    // Verificar se a empresa existe
    const sessionCompanyId = 'cf6215c0-a6f5-4572-8d1b-9c12eab94fac'
    let company = await prisma.company.findUnique({
      where: { id: sessionCompanyId }
    })

    if (!company) {
      // Criar empresa
      company = await prisma.company.create({
        data: {
          id: sessionCompanyId,
          name: 'R R de Oliveira',
          fantasyName: 'Exatta contabilidade',
          cnpj: '35496100000135',
          logoUrl: '/uploads/1d2bdee4-58ee-4cfc-9427-2240eb1abd35.png'
        }
      })
      console.log('🏢 Empresa criada:', company.name)
    }

    // Criar usuário com ID específico
    const hashedPassword = await bcrypt.hash('123456789', 10)
    
    const user = await prisma.user.create({
      data: {
        id: sessionUserId,
        name: sessionUserName,
        email: sessionUserEmail,
        password: hashedPassword,
        role: 'ADMIN',
        companyId: sessionCompanyId
      }
    })

    console.log('👤 Usuário criado:', user.name, user.email)
    console.log('🔑 Senha:', '123456789')

  } catch (error) {
    console.error('❌ Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createSessionUser()