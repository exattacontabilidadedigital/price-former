const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createTestCalculation() {
  try {
    const calc = await prisma.calculation.create({
      data: {
        calculationName: 'Teste Manual Direto',
        productName: 'Produto Teste',
        costPrice: 50,
        markup: 1.5,
        suggestedPrice: 75,
        totalCosts: 50,
        totalTaxes: 0,
        profitMargin: 25,
        desiredProfitMargin: 30,  // Este é o campo que queremos testar
        icms: 0,
        ipi: 0,
        freight: 0,
        otherCosts: 0,
        pis: 0,
        cofins: 0,
        cpp: 0,
        issqn: 0,
        csll: 0,
        irpj: 0,
        taxOthers: 0
      }
    });
    console.log('✅ Cálculo criado com sucesso!');
    console.log('- ID:', calc.id);
    console.log('- Nome:', calc.calculationName);
    console.log('- Lucro desejado salvo:', calc.desiredProfitMargin + '%');
  } catch (error) {
    console.error('❌ Erro ao criar cálculo:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createTestCalculation();