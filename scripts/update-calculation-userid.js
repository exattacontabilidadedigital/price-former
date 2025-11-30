const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateCalculation() {
  try {
    const result = await prisma.calculation.updateMany({
      where: {},
      data: { userId: 'test-user-id' }
    });
    console.log(`✅ ${result.count} cálculo(s) atualizados com userId correto`);
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateCalculation();